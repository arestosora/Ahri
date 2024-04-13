import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { StringSelectMenuInteraction, EmbedBuilder, MessageCollector, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from "discord.js";
import { TextOnImageOptions, Utils } from "../../utils/util";
const { Emojis, Colors, drawTextOnImage, IDGenerator, shortenURL, Prices } = Utils
import { Ahri } from "../..";
import { AhriLogger } from "../../structures/Logger";
import { uploadImageToCloudinary } from "../../utils/functions/Cloudinary";
import { loadImage } from "canvas";
const Log = new AhriLogger();

interface optionsObject {
    disabled: boolean | undefined;
    author: string | undefined;
}

export const build = async (
    actionRowBuilder: ActionRowBuilder,
    options: optionsObject,
    data: String[] | undefined
) => {
    return new Promise((resolve) => {
        actionRowBuilder.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`menu:wc_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "1000 Wild Cores",
                        emoji: "1149424355353313420", // 1
                        value: "1000WC:HIM",
                    },
                    {
                        label: "2000 Wild Cores",
                        emoji: "1149424355353313420", // 1
                        value: "2000WC:HIM",
                    },
                    {
                        label: "3000 Wild Cores",
                        emoji: "1149424355353313420", // 1
                        value: "3000WC:HIM",
                    },
                    {
                        label: "5000 Wild Cores",
                        emoji: "1149424355353313420", // 1
                        value: "5000WC:HIM",
                    },
                    {
                        label: "10000 Wild Cores",
                        emoji: "1149424355353313420", // 1
                        value: "10000WC:HIM",
                    },


                )
        );
        resolve(true);
    });
};
export class ShopMenuHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu,
        });
    }


    public override async parse(interaction: StringSelectMenuInteraction) {

        const cat: string = interaction.customId.split(/:+/g)[0];
        const id: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[0];
        if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
       // if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && id == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1].split(/\.+/g)[0]) {
            const restriction: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[1];
            let permited: boolean = restriction.startsWith("a")
            if (!permited && restriction.startsWith("u")) {
                permited = (interaction.user.id == restriction.slice(1, restriction.length))
            }
            if (permited) {
                return this.some();
            } else {
                return this.none();
            }
        } else {
            return this.none();
        }
    }


    public async run(interaction: StringSelectMenuInteraction) {
        try {
            const UniqueID = await IDGenerator(5);
            const data = interaction.customId
                .split(/_+/g)
            [interaction.customId.split(/_+/g).length - 1].split(/,+/g);
            const user = data[0];

            let selectedOption = interaction.values[0];

            selectedOption = selectedOption
                .replace(":HIM", user)
                .replace("ME", interaction.user.id);

            let args: any[] = selectedOption.split(/:+/g);

            for (let i = 0; i < args.length; i++) {
                args[i] = [...args[i].split(/&+/g)];
            }

            const opcion = args[0][0];

            switch (opcion) {
                case "10000WC": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `10000 Wild Cores`. Para poder gestionar tu pedido se requiere el acceso a tu cuenta de WildRift, así que primeramente escribe el método de inicio de sesión."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
                    });

                    const MetodoCollector = new MessageCollector(interaction.channel, {
                        filter: (msg) => msg.author.id === interaction.user.id,
                        max: 1,
                        time: 120000,
                    });

                    let metodo = "";
                    MetodoCollector.on("collect", (message) => {
                        metodo = message.content;
                    });

                    MetodoCollector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Error)
                                        .setDescription(
                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                        ),
                                ],
                            });
                        } else {

                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Success)
                                        .setDescription(
                                            `Ahora escribe tu email.`
                                        ),
                                ],
                            });

                            const nameCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let name = "";
                            nameCollector.on("collect", (message) => {
                                name = message.content;
                            });

                            nameCollector.on("end", (collected, reason) => {
                                if (reason === "time") {
                                    interaction.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${Ahri.user.username}`,
                                                    iconURL: Ahri.user.displayAvatarURL(),
                                                })
                                                .setColor(Colors.Error)
                                                .setDescription(
                                                    `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                ),
                                        ],
                                    });
                                } else {
                                    const SkinEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu email es \`${name}\` y tu método de inicio de sesión es \`${metodo}\`. Ahora, por favor, escribe la contraseña.`
                                        )
                                        .setColor(Colors.Success);

                                    interaction.channel.send({
                                        embeds: [SkinEmbed],
                                    });

                                    const SkinCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) => msg.author.id === interaction.user.id,
                                        max: 1,
                                        time: 120000,
                                    });

                                    let skin = "";
                                    SkinCollector.on("collect", (message) => {
                                        skin = message.content;
                                    });

                                    SkinCollector.on("end", (collected, reason) => {
                                        if (reason === "time") {
                                            interaction.channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({
                                                            name: `${Ahri.user.username}`,
                                                            iconURL: Ahri.user.displayAvatarURL(),
                                                        })
                                                        .setColor(Colors.Error)
                                                        .setDescription(
                                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                        ),
                                                ],
                                            });
                                        } else {
                                            const NameEmbed = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${interaction.user.username}`,
                                                    iconURL: interaction.user.displayAvatarURL(),
                                                })
                                                .setDescription(
                                                    `Perfecto, tus datos de acceso son ${name}, ${skin} y ${metodo}. Ahora, envía el comprobante.`
                                                )
                                                .setColor(Colors.Success);

                                            interaction.channel.send({
                                                embeds: [NameEmbed],
                                            });
                                        }
                                    });

                                    const imageCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) =>
                                            msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                        max: 1,
                                    });

                                    imageCollector.on("collect", (message) => {
                                        const attachment = message.attachments.first();
                                        const attachmentURL = attachment?.url;
                                        const attachmentName = attachment?.name;

                                        interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                            try {
                                                const imageToDraw = await loadImage(attachmentURL);
                                                const backgroundImage = await loadImage("./assets/bg.png");

                                                const textOptions: TextOnImageOptions = {
                                                    text: `Metodo: ${metodo}\nEmail: ${name}\nPassword: ${skin}`,
                                                    fontSize: 20,
                                                    fontColor: 'red',
                                                    x: 500,
                                                    y: 800,
                                                };
                                                const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw);
                                                const publicImageURL = await uploadImageToCloudinary(localImagePath);
                                                const shortURL = await shortenURL(publicImageURL);

                                                const AttachmentEmbed = new EmbedBuilder()
                                                    .setTitle("¡Resumen de tu pedido! " + Emojis.General.Warning)
                                                    .setAuthor({
                                                        name: `${interaction.user.username}`,
                                                        iconURL: interaction.user.displayAvatarURL(),
                                                    })
                                                    .addFields(
                                                        {
                                                            name: "Nombre de invocador",
                                                            value: `\`${name}\``,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: "Producto",
                                                            value: `\`10.000\` WC`,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                                        },
                                                        {
                                                            name: 'Skin A Comprar', value: `${skin}`, inline: true
                                                        }
                                                    )
                                                    .setDescription(
                                                        `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                                    )
                                                    .setColor(Colors.Success)
                                                    .setImage(publicImageURL);

                                                const botone = new ActionRowBuilder<ButtonBuilder>();
                                                const module1 = await import(
                                                    "../../interaction-handlers/buttons/g/c"
                                                );
                                                const module2 = await import(
                                                    "../../interaction-handlers/buttons/g/a"
                                                );

                                                await module1.build(
                                                    botone,
                                                    { disabled: false, author: interaction.user.id },
                                                    []
                                                );
                                                await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`,`wc`]);

                                                await msg.edit({
                                                    content: '',
                                                    embeds: [AttachmentEmbed],
                                                    components: [botone],
                                                });
                                            } catch (error) {
                                                Log.error('Error al dibujar texto en la imagen:', error);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                    break;
                case "5000WC": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `5000 Wild Cores`. Para poder gestionar tu pedido se requiere el acceso a tu cuenta de WildRift, así que primeramente escribe el método de inicio de sesión."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
                    });

                    const MetodoCollector = new MessageCollector(interaction.channel, {
                        filter: (msg) => msg.author.id === interaction.user.id,
                        max: 1,
                        time: 120000,
                    });

                    let metodo = "";
                    MetodoCollector.on("collect", (message) => {
                        metodo = message.content;
                    });

                    MetodoCollector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Error)
                                        .setDescription(
                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                        ),
                                ],
                            });
                        } else {

                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Success)
                                        .setDescription(
                                            `Ahora escribe tu email.`
                                        ),
                                ],
                            });

                            const nameCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let name = "";
                            nameCollector.on("collect", (message) => {
                                name = message.content;
                            });

                            nameCollector.on("end", (collected, reason) => {
                                if (reason === "time") {
                                    interaction.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${Ahri.user.username}`,
                                                    iconURL: Ahri.user.displayAvatarURL(),
                                                })
                                                .setColor(Colors.Error)
                                                .setDescription(
                                                    `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                ),
                                        ],
                                    });
                                } else {
                                    const SkinEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu email es \`${name}\` y tu método de inicio de sesión es \`${metodo}\`. Ahora, por favor, escribe la contraseña.`
                                        )
                                        .setColor(Colors.Success);

                                    interaction.channel.send({
                                        embeds: [SkinEmbed],
                                    });

                                    const SkinCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) => msg.author.id === interaction.user.id,
                                        max: 1,
                                        time: 120000,
                                    });

                                    let skin = "";
                                    SkinCollector.on("collect", (message) => {
                                        skin = message.content;
                                    });

                                    SkinCollector.on("end", (collected, reason) => {
                                        if (reason === "time") {
                                            interaction.channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({
                                                            name: `${Ahri.user.username}`,
                                                            iconURL: Ahri.user.displayAvatarURL(),
                                                        })
                                                        .setColor(Colors.Error)
                                                        .setDescription(
                                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                        ),
                                                ],
                                            });
                                        } else {
                                            const NameEmbed = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${interaction.user.username}`,
                                                    iconURL: interaction.user.displayAvatarURL(),
                                                })
                                                .setDescription(
                                                    `Perfecto, tus datos de acceso son ${name}, ${skin} y ${metodo}. Ahora, envía el comprobante.`
                                                )
                                                .setColor(Colors.Success);

                                            interaction.channel.send({
                                                embeds: [NameEmbed],
                                            });
                                        }
                                    });

                                    const imageCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) =>
                                            msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                        max: 1,
                                    });

                                    imageCollector.on("collect", (message) => {
                                        const attachment = message.attachments.first();
                                        const attachmentURL = attachment?.url;
                                        const attachmentName = attachment?.name;

                                        interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                            try {
                                                const imageToDraw = await loadImage(attachmentURL);
                                                const backgroundImage = await loadImage("./assets/bg.png");

                                                const textOptions: TextOnImageOptions = {
                                                    text: `Metodo: ${metodo}\nEmail: ${name}\nPassword: ${skin}`,
                                                    fontSize: 20,
                                                    fontColor: 'red',
                                                    x: 500,
                                                    y: 800,
                                                };
                                                const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw);
                                                const publicImageURL = await uploadImageToCloudinary(localImagePath);
                                                const shortURL = await shortenURL(publicImageURL);

                                                const AttachmentEmbed = new EmbedBuilder()
                                                    .setTitle("¡Resumen de tu pedido! " + Emojis.General.Warning)
                                                    .setAuthor({
                                                        name: `${interaction.user.username}`,
                                                        iconURL: interaction.user.displayAvatarURL(),
                                                    })
                                                    .addFields(
                                                        {
                                                            name: "Nombre de invocador",
                                                            value: `\`${name}\``,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: "Producto",
                                                            value: `\`5.000\` WC`,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                                        },
                                                        {
                                                            name: 'Skin A Comprar', value: `${skin}`, inline: true
                                                        }
                                                    )
                                                    .setDescription(
                                                        `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                                    )
                                                    .setColor(Colors.Success)
                                                    .setImage(publicImageURL);

                                                const botone = new ActionRowBuilder<ButtonBuilder>();
                                                const module1 = await import(
                                                    "../../interaction-handlers/buttons/g/c"
                                                );
                                                const module2 = await import(
                                                    "../../interaction-handlers/buttons/g/a"
                                                );

                                                await module1.build(
                                                    botone,
                                                    { disabled: false, author: interaction.user.id },
                                                    []
                                                );
                                                await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`,`wc`]);

                                                await msg.edit({
                                                    content: '',
                                                    embeds: [AttachmentEmbed],
                                                    components: [botone],
                                                });
                                            } catch (error) {
                                                Log.error('Error al dibujar texto en la imagen:', error);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                    break;
                case "3000WC": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `3000 Wild Cores`. Para poder gestionar tu pedido se requiere el acceso a tu cuenta de WildRift, así que primeramente escribe el método de inicio de sesión."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
                    });

                    const MetodoCollector = new MessageCollector(interaction.channel, {
                        filter: (msg) => msg.author.id === interaction.user.id,
                        max: 1,
                        time: 120000,
                    });

                    let metodo = "";
                    MetodoCollector.on("collect", (message) => {
                        metodo = message.content;
                    });

                    MetodoCollector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Error)
                                        .setDescription(
                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                        ),
                                ],
                            });
                        } else {

                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Success)
                                        .setDescription(
                                            `Ahora escribe tu email.`
                                        ),
                                ],
                            });

                            const nameCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let name = "";
                            nameCollector.on("collect", (message) => {
                                name = message.content;
                            });

                            nameCollector.on("end", (collected, reason) => {
                                if (reason === "time") {
                                    interaction.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${Ahri.user.username}`,
                                                    iconURL: Ahri.user.displayAvatarURL(),
                                                })
                                                .setColor(Colors.Error)
                                                .setDescription(
                                                    `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                ),
                                        ],
                                    });
                                } else {
                                    const SkinEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu email es \`${name}\` y tu método de inicio de sesión es \`${metodo}\`. Ahora, por favor, escribe la contraseña.`
                                        )
                                        .setColor(Colors.Success);

                                    interaction.channel.send({
                                        embeds: [SkinEmbed],
                                    });

                                    const SkinCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) => msg.author.id === interaction.user.id,
                                        max: 1,
                                        time: 120000,
                                    });

                                    let skin = "";
                                    SkinCollector.on("collect", (message) => {
                                        skin = message.content;
                                    });

                                    SkinCollector.on("end", (collected, reason) => {
                                        if (reason === "time") {
                                            interaction.channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({
                                                            name: `${Ahri.user.username}`,
                                                            iconURL: Ahri.user.displayAvatarURL(),
                                                        })
                                                        .setColor(Colors.Error)
                                                        .setDescription(
                                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                        ),
                                                ],
                                            });
                                        } else {
                                            const NameEmbed = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${interaction.user.username}`,
                                                    iconURL: interaction.user.displayAvatarURL(),
                                                })
                                                .setDescription(
                                                    `Perfecto, tus datos de acceso son ${name}, ${skin} y ${metodo}. Ahora, envía el comprobante.`
                                                )
                                                .setColor(Colors.Success);

                                            interaction.channel.send({
                                                embeds: [NameEmbed],
                                            });
                                        }
                                    });

                                    const imageCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) =>
                                            msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                        max: 1,
                                    });

                                    imageCollector.on("collect", (message) => {
                                        const attachment = message.attachments.first();
                                        const attachmentURL = attachment?.url;
                                        const attachmentName = attachment?.name;

                                        interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                            try {
                                                const imageToDraw = await loadImage(attachmentURL);
                                                const backgroundImage = await loadImage("./assets/bg.png");

                                                const textOptions: TextOnImageOptions = {
                                                    text: `Metodo: ${metodo}\nEmail: ${name}\nPassword: ${skin}`,
                                                    fontSize: 20,
                                                    fontColor: 'red',
                                                    x: 500,
                                                    y: 800,
                                                };
                                                const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw);
                                                const publicImageURL = await uploadImageToCloudinary(localImagePath);
                                                const shortURL = await shortenURL(publicImageURL);

                                                const AttachmentEmbed = new EmbedBuilder()
                                                    .setTitle("¡Resumen de tu pedido! " + Emojis.General.Warning)
                                                    .setAuthor({
                                                        name: `${interaction.user.username}`,
                                                        iconURL: interaction.user.displayAvatarURL(),
                                                    })
                                                    .addFields(
                                                        {
                                                            name: "Nombre de invocador",
                                                            value: `\`${name}\``,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: "Producto",
                                                            value: `\`3.000\` WC`,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                                        },
                                                        {
                                                            name: 'Skin A Comprar', value: `${skin}`, inline: true
                                                        }
                                                    )
                                                    .setDescription(
                                                        `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                                    )
                                                    .setColor(Colors.Success)
                                                    .setImage(publicImageURL);

                                                const botone = new ActionRowBuilder<ButtonBuilder>();
                                                const module1 = await import(
                                                    "../../interaction-handlers/buttons/g/c"
                                                );
                                                const module2 = await import(
                                                    "../../interaction-handlers/buttons/g/a"
                                                );

                                                await module1.build(
                                                    botone,
                                                    { disabled: false, author: interaction.user.id },
                                                    []
                                                );
                                                await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`,`wc`]);

                                                await msg.edit({
                                                    content: '',
                                                    embeds: [AttachmentEmbed],
                                                    components: [botone],
                                                });
                                            } catch (error) {
                                                Log.error('Error al dibujar texto en la imagen:', error);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                    break;
                case "1000WC": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `1000 Wild Cores`. Para poder gestionar tu pedido se requiere el acceso a tu cuenta de WildRift, así que primeramente escribe el método de inicio de sesión."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
                    });

                    const MetodoCollector = new MessageCollector(interaction.channel, {
                        filter: (msg) => msg.author.id === interaction.user.id,
                        max: 1,
                        time: 120000,
                    });

                    let metodo = "";
                    MetodoCollector.on("collect", (message) => {
                        metodo = message.content;
                    });

                    MetodoCollector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Error)
                                        .setDescription(
                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                        ),
                                ],
                            });
                        } else {

                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Success)
                                        .setDescription(
                                            `Ahora escribe tu email.`
                                        ),
                                ],
                            });

                            const nameCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let name = "";
                            nameCollector.on("collect", (message) => {
                                name = message.content;
                            });

                            nameCollector.on("end", (collected, reason) => {
                                if (reason === "time") {
                                    interaction.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${Ahri.user.username}`,
                                                    iconURL: Ahri.user.displayAvatarURL(),
                                                })
                                                .setColor(Colors.Error)
                                                .setDescription(
                                                    `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                ),
                                        ],
                                    });
                                } else {
                                    const SkinEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu email es \`${name}\` y tu método de inicio de sesión es \`${metodo}\`. Ahora, por favor, escribe la contraseña.`
                                        )
                                        .setColor(Colors.Success);

                                    interaction.channel.send({
                                        embeds: [SkinEmbed],
                                    });

                                    const SkinCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) => msg.author.id === interaction.user.id,
                                        max: 1,
                                        time: 120000,
                                    });

                                    let skin = "";
                                    SkinCollector.on("collect", (message) => {
                                        skin = message.content;
                                    });

                                    SkinCollector.on("end", (collected, reason) => {
                                        if (reason === "time") {
                                            interaction.channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({
                                                            name: `${Ahri.user.username}`,
                                                            iconURL: Ahri.user.displayAvatarURL(),
                                                        })
                                                        .setColor(Colors.Error)
                                                        .setDescription(
                                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                        ),
                                                ],
                                            });
                                        } else {
                                            const NameEmbed = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${interaction.user.username}`,
                                                    iconURL: interaction.user.displayAvatarURL(),
                                                })
                                                .setDescription(
                                                    `Perfecto, tus datos de acceso son ${name}, ${skin} y ${metodo}. Ahora, envía el comprobante.`
                                                )
                                                .setColor(Colors.Success);

                                            interaction.channel.send({
                                                embeds: [NameEmbed],
                                            });
                                        }
                                    });

                                    const imageCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) =>
                                            msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                        max: 1,
                                    });

                                    imageCollector.on("collect", (message) => {
                                        const attachment = message.attachments.first();
                                        const attachmentURL = attachment?.url;
                                        const attachmentName = attachment?.name;

                                        interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                            try {
                                                const imageToDraw = await loadImage(attachmentURL);
                                                const backgroundImage = await loadImage("./assets/bg.png");

                                                const textOptions: TextOnImageOptions = {
                                                    text: `Metodo: ${metodo}\nEmail: ${name}\nPassword: ${skin}`,
                                                    fontSize: 20,
                                                    fontColor: 'red',
                                                    x: 500,
                                                    y: 800,
                                                };
                                                const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw);
                                                const publicImageURL = await uploadImageToCloudinary(localImagePath);
                                                const shortURL = await shortenURL(publicImageURL);

                                                const AttachmentEmbed = new EmbedBuilder()
                                                    .setTitle("¡Resumen de tu pedido! " + Emojis.General.Warning)
                                                    .setAuthor({
                                                        name: `${interaction.user.username}`,
                                                        iconURL: interaction.user.displayAvatarURL(),
                                                    })
                                                    .addFields(
                                                        {
                                                            name: "Nombre de invocador",
                                                            value: `\`${name}\``,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: "Producto",
                                                            value: `\`1.000\` WC`,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                                        },
                                                        {
                                                            name: 'Skin A Comprar', value: `${skin}`, inline: true
                                                        }
                                                    )
                                                    .setDescription(
                                                        `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                                    )
                                                    .setColor(Colors.Success)
                                                    .setImage(publicImageURL);

                                                const botone = new ActionRowBuilder<ButtonBuilder>();
                                                const module1 = await import(
                                                    "../../interaction-handlers/buttons/g/c"
                                                );
                                                const module2 = await import(
                                                    "../../interaction-handlers/buttons/g/a"
                                                );

                                                await module1.build(
                                                    botone,
                                                    { disabled: false, author: interaction.user.id },
                                                    []
                                                );
                                                await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`,`wc`]);

                                                await msg.edit({
                                                    content: '',
                                                    embeds: [AttachmentEmbed],
                                                    components: [botone],
                                                });
                                            } catch (error) {
                                                Log.error('Error al dibujar texto en la imagen:', error);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                    break;
                case "2000WC": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `2000 Wild Cores`. Para poder gestionar tu pedido se requiere el acceso a tu cuenta de WildRift, así que primeramente escribe el método de inicio de sesión."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
                    });

                    const MetodoCollector = new MessageCollector(interaction.channel, {
                        filter: (msg) => msg.author.id === interaction.user.id,
                        max: 1,
                        time: 120000,
                    });

                    let metodo = "";
                    MetodoCollector.on("collect", (message) => {
                        metodo = message.content;
                    });

                    MetodoCollector.on("end", (collected, reason) => {
                        if (reason === "time") {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Error)
                                        .setDescription(
                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                        ),
                                ],
                            });
                        } else {

                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({
                                            name: `${Ahri.user.username}`,
                                            iconURL: Ahri.user.displayAvatarURL(),
                                        })
                                        .setColor(Colors.Success)
                                        .setDescription(
                                            `Ahora escribe tu email.`
                                        ),
                                ],
                            });

                            const nameCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let name = "";
                            nameCollector.on("collect", (message) => {
                                name = message.content;
                            });

                            nameCollector.on("end", (collected, reason) => {
                                if (reason === "time") {
                                    interaction.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${Ahri.user.username}`,
                                                    iconURL: Ahri.user.displayAvatarURL(),
                                                })
                                                .setColor(Colors.Error)
                                                .setDescription(
                                                    `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                ),
                                        ],
                                    });
                                } else {
                                    const SkinEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu email es \`${name}\` y tu método de inicio de sesión es \`${metodo}\`. Ahora, por favor, escribe la contraseña.`
                                        )
                                        .setColor(Colors.Success);

                                    interaction.channel.send({
                                        embeds: [SkinEmbed],
                                    });

                                    const SkinCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) => msg.author.id === interaction.user.id,
                                        max: 1,
                                        time: 120000,
                                    });

                                    let skin = "";
                                    SkinCollector.on("collect", (message) => {
                                        skin = message.content;
                                    });

                                    SkinCollector.on("end", (collected, reason) => {
                                        if (reason === "time") {
                                            interaction.channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({
                                                            name: `${Ahri.user.username}`,
                                                            iconURL: Ahri.user.displayAvatarURL(),
                                                        })
                                                        .setColor(Colors.Error)
                                                        .setDescription(
                                                            `Se ha acabado el tiempo para responder. Inténtalo de nuevo.`
                                                        ),
                                                ],
                                            });
                                        } else {
                                            const NameEmbed = new EmbedBuilder()
                                                .setAuthor({
                                                    name: `${interaction.user.username}`,
                                                    iconURL: interaction.user.displayAvatarURL(),
                                                })
                                                .setDescription(
                                                    `Perfecto, tus datos de acceso son ${name}, ${skin} y ${metodo}. Ahora, envía el comprobante.`
                                                )
                                                .setColor(Colors.Success);

                                            interaction.channel.send({
                                                embeds: [NameEmbed],
                                            });
                                        }
                                    });

                                    const imageCollector = new MessageCollector(interaction.channel, {
                                        filter: (msg) =>
                                            msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                        max: 1,
                                    });

                                    imageCollector.on("collect", (message) => {
                                        const attachment = message.attachments.first();
                                        const attachmentURL = attachment?.url;
                                        const attachmentName = attachment?.name;

                                        interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                            try {
                                                const imageToDraw = await loadImage(attachmentURL);
                                                const backgroundImage = await loadImage("./assets/bg.png");

                                                const textOptions: TextOnImageOptions = {
                                                    text: `Metodo: ${metodo}\nEmail: ${name}\nPassword: ${skin}`,
                                                    fontSize: 20,
                                                    fontColor: 'red',
                                                    x: 500,
                                                    y: 800,
                                                };
                                                const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw);
                                                const publicImageURL = await uploadImageToCloudinary(localImagePath);
                                                const shortURL = await shortenURL(publicImageURL);

                                                const AttachmentEmbed = new EmbedBuilder()
                                                    .setTitle("¡Resumen de tu pedido! " + Emojis.General.Warning)
                                                    .setAuthor({
                                                        name: `${interaction.user.username}`,
                                                        iconURL: interaction.user.displayAvatarURL(),
                                                    })
                                                    .addFields(
                                                        {
                                                            name: "Nombre de invocador",
                                                            value: `\`${name}\``,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: "Producto",
                                                            value: `\`2.000\` WC`,
                                                            inline: true,
                                                        },
                                                        {
                                                            name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                                        },
                                                        {
                                                            name: 'Skin A Comprar', value: `${skin}`, inline: true
                                                        }
                                                    )
                                                    .setDescription(
                                                        `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                                    )
                                                    .setColor(Colors.Success)
                                                    .setImage(publicImageURL);

                                                const botone = new ActionRowBuilder<ButtonBuilder>();
                                                const module1 = await import(
                                                    "../../interaction-handlers/buttons/g/c"
                                                );
                                                const module2 = await import(
                                                    "../../interaction-handlers/buttons/g/a"
                                                );

                                                await module1.build(
                                                    botone,
                                                    { disabled: false, author: interaction.user.id },
                                                    []
                                                );
                                                await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`,`wc`]);

                                                await msg.edit({
                                                    content: '',
                                                    embeds: [AttachmentEmbed],
                                                    components: [botone],
                                                });
                                            } catch (error) {
                                                Log.error('Error al dibujar texto en la imagen:', error);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                    break;
            }

        } catch (error) {
            Log.error(error);
            return interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `${Ahri.user.username}`,
                            iconURL: Ahri.user.displayAvatarURL(),
                        })
                        .setColor(Colors.Error)
                        .setDescription(
                            `${Emojis.General.Error} Ha ocurrido un error al realizar tu pedido, inténtalo de nuevo. En caso de que el error persista, contacta con los administradores.`
                        ),
                ],
            });
        }
    }
}        