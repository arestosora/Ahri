import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { StringSelectMenuInteraction, EmbedBuilder, MessageCollector, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from "discord.js";
import { TextOnImageOptions, Utils } from "../../utils/util";
const { Emojis, Colors, drawTextOnImage, IDGenerator, shortenURL, Prices } = Utils
import { Ahri } from "../..";
import { AhriLogger } from "../../structures/Logger";
import { uploadImageToCloudinary } from "../../utils/functions/Cloudinary";
import { loadImage } from "canvas";
import { dirname } from "path";

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
                .setCustomId(`menu:skin_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Skin Misteriosa",
                        emoji: "1222589428187402283", // 1
                        value: "490:HIM",
                    },
                    {
                        label: "Skin 975 RP",
                        emoji: "1222589428187402283", // 1
                        value: "975:HIM",
                    },
                    {
                        label: "Skin épica 1350 RP",
                        emoji: "1149419858241532049", // 1
                        value: "1350:HIM",
                    },
                    {
                        label: "Skin Legendaria 1820 RP",
                        emoji: "1149420773275095222", // 2
                        value: "1820:HIM",
                    },
                    {
                        label: "Skin Definitiva 3250 RP",
                        emoji: "1149420803151122503", // 3
                        value: "3250:HIM",
                    },
                    {
                        label: "Chroma",
                        emoji: "1222588752581361705", // 1
                        value: "290:HIM",
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

            selectedOption = selectedOption.replace(":HIM", user).replace("ME", interaction.user.id);

            let args: any[] = selectedOption.split(/:+/g);

            for (let i = 0; i < args.length; i++) {
                args[i] = [...args[i].split(/&+/g)];
            }

            const opcion = args[0][0];

            switch (opcion) {

                case "490": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Skin Misteriosa`. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }
                            const NameEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
                                embeds: [NameEmbed],
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;
                                await shortenURL(attachmentURL).then(async (shortURL) => {
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
                                                value: `Skin Misteriosa`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                            }

                                        )
                                        .setDescription(
                                            `Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`
                                        )
                                        .setColor(Colors.Success)
                                        .setImage(attachmentURL);

                                    const botone = new ActionRowBuilder<ButtonBuilder>();
                                    const module1 = await import(
                                        "../buttons/g/c"
                                    );
                                    const module2 = await import(
                                        "../buttons/g/a"
                                    );

                                    await module1.build(
                                        botone,
                                        { disabled: false, author: interaction.user.id },
                                        []
                                    );
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `sk`]
                                    );

                                    await interaction.channel.send({
                                        embeds: [AttachmentEmbed],
                                        components: [botone],
                                    });
                                }).catch((error) => {
                                    Log.error('Error al acortar la URL:', error);
                                });

                            });
                        }
                    });
                }

                    break;

                case "975": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Skin 975 RP` . Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }

                            const SkinEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, escribe por favor el nombre de la Skin que deseas adquirir.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
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

                            SkinCollector.on("end", async (collected, reason) => {
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
                                }
                                else {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.`
                                        )
                                        .setColor(Colors.Success);

                                    await interaction.channel.send({
                                        embeds: [NameEmbed],
                                    });
                                }
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;


                                await interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                    try {
                                        // Cargar la imagen adicional
                                        const imageToDraw = await loadImage(attachmentURL);
                                        const backgroundImage = await loadImage("./assets/bg.png");

                                        const textOptions: TextOnImageOptions = {
                                            text: skin,
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 200, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw); // Pasa la imagen de fondo como primer argumento
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
                                                    value: `\`Skin 975RP\``,
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
                                            .setImage(publicImageURL); // Aquí usamos la URL pública de la imagen cargada en ImgBB.

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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `sk`]
                                        );

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
                    break;
                case "290": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Chroma de Skin` . Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }

                            const SkinEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, escribe por favor el nombre del Chroma que deseas adquirir.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
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

                            SkinCollector.on("end", async (collected, reason) => {
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
                                }
                                else {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y el chroma que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.`
                                        )
                                        .setColor(Colors.Success);

                                    await interaction.channel.send({
                                        embeds: [NameEmbed],
                                    });
                                }
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;


                                await interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                    try {
                                        // Cargar la imagen adicional
                                        const imageToDraw = await loadImage(attachmentURL);
                                        const backgroundImage = await loadImage("./assets/bg.png");

                                        const textOptions: TextOnImageOptions = {
                                            text: skin,
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 200, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw); // Pasa la imagen de fondo como primer argumento
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
                                                    value: `\`Chroma\``,
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
                                            .setImage(publicImageURL); // Aquí usamos la URL pública de la imagen cargada en ImgBB.

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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `ch`]
                                        );

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
                    break;
                case "1350": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Skin Epica de 1350 RP` <:epicskin:1149419858241532049>. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }

                            const SkinEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, escribe por favor el nombre de la Skin que deseas adquirir.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
                                embeds: [SkinEmbed],
                            });

                            const SkinCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let skin = "";
                            SkinCollector.on("collect", (message) => {
                                if (message.content && message.content.trim() !== "" || '' && message.attachments.size === 0) {
                                    skin = message.content;
                                }
                            });

                            SkinCollector.on("end", async (collected, reason) => {
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
                                }
                                else {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** \`3105947529\` <:nequi:1134763235522924596>, **Bancolombia** \`91260328099\` <:bancolombia:1134763479925010518>,  **PayPal**: https://bit.ly/RPHUBGLOBAL <:paypal:1134763669855678546>. o **Binance**: \`114799953\` <:binance:1135310399084965923>`
                                        )
                                        .setColor(Colors.Success);

                                    await interaction.channel.send({
                                        embeds: [NameEmbed],
                                    });
                                }
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;


                                await interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                    try {
                                        // Cargar la imagen adicional
                                        const imageToDraw = await loadImage(attachmentURL);
                                        const backgroundImage = await loadImage("./assets/bg.png");

                                        const textOptions: TextOnImageOptions = {
                                            text: skin,
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 200, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw); // Pasa la imagen de fondo como primer argumento
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
                                                    value: `\`Skin Epica\``,
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
                                            .setImage(publicImageURL); // Aquí usamos la URL pública de la imagen cargada en ImgBB.

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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `sk`]
                                        );

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
                    break;

                case "1820": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Skin Legendaria de 1820 RP` <:legendary:1149420773275095222>. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }

                            const SkinEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, escribe por favor el nombre de la Skin que deseas adquirir.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
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

                            SkinCollector.on("end", async (collected, reason) => {
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
                                }
                                else {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** \`3105947529\` <:nequi:1134763235522924596>, **Bancolombia** \`91260328099\` <:bancolombia:1134763479925010518>,  **PayPal**: https://bit.ly/RPHUBGLOBAL <:paypal:1134763669855678546>. o **Binance**: \`114799953\` <:binance:1135310399084965923>`
                                        )
                                        .setColor(Colors.Success);

                                    await interaction.channel.send({
                                        embeds: [NameEmbed],
                                    });
                                }
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;


                                await interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                    try {
                                        // Cargar la imagen adicional
                                        const imageToDraw = await loadImage(attachmentURL);
                                        const backgroundImage = await loadImage("./assets/bg.png");

                                        const textOptions: TextOnImageOptions = {
                                            text: skin,
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 200, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw); // Pasa la imagen de fondo como primer argumento
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
                                                    value: `\`Skin Legendaria\``,
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
                                            .setImage(publicImageURL); // Aquí usamos la URL pública de la imagen cargada en ImgBB.

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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `sk`]
                                        );

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
                    break;

                case "3250": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Skin Definitiva de 3250 RP` <:Definitive:1149420803151122503>. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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

                    nameCollector.on("end", async (collected, reason) => {
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
                            if (name.length > 22) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 22 caracteres. Inténtalo de nuevo.`
                                            ),
                                    ],
                                });
                                return;
                            }

                            const SkinEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, escribe por favor el nombre de la Skin que deseas adquirir.`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
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

                            SkinCollector.on("end", async (collected, reason) => {
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
                                }
                                else {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** \`3105947529\` <:nequi:1134763235522924596>, **Bancolombia** \`91260328099\` <:bancolombia:1134763479925010518>,  **PayPal**: https://bit.ly/RPHUBGLOBAL <:paypal:1134763669855678546>. o **Binance**: \`114799953\` <:binance:1135310399084965923>`
                                        )
                                        .setColor(Colors.Success);

                                    await interaction.channel.send({
                                        embeds: [NameEmbed],
                                    });
                                }
                            });

                            const imageCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) =>
                                    msg.author.id === interaction.user.id && msg.attachments.size > 0,
                                max: 1
                            });

                            imageCollector.on("collect", async (message) => {
                                const attachment = message.attachments.first();
                                const attachmentURL = attachment?.url;
                                const attachmentName = attachment?.name;


                                await interaction.channel.send({ content: `${Emojis.Misc.Loading}` }).then(async (msg) => {
                                    try {
                                        // Cargar la imagen adicional
                                        const imageToDraw = await loadImage(attachmentURL);
                                        const backgroundImage = await loadImage("./assets/bg.png");

                                        const textOptions: TextOnImageOptions = {
                                            text: `${name}\n${skin}`,
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 200, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(backgroundImage, textOptions, imageToDraw); // Pasa la imagen de fondo como primer argumento
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
                                                    value: `\`Skin Definitva\``,
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
                                            .setImage(publicImageURL); // Aquí usamos la URL pública de la imagen cargada en ImgBB.

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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`, `sk`]
                                        );

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