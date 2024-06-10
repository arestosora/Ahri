import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { StringSelectMenuInteraction, EmbedBuilder, MessageCollector, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from "discord.js";
import { TextOnImageOptions, Utils } from "../../utils/util";
const { Emojis, Colors, drawTextOnImage, IDGenerator, shortenURL, Prices } = Utils
import { Ahri } from "../..";
import { AhriLogger } from "../../structures/Logger";
import { uploadImageToCloudinary } from "../../utils/functions/Cloudinary";

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
                .setCustomId(`menu:chest_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Cofre Artesano + Llave",
                        emoji: "1136127811078332578", // 1
                        value: "cofre1:HIM",
                    },
                    {
                        label: "5 Cofres Artesanos + Llaves",
                        emoji: "1136127811078332578", // 2
                        value: "cofre5:HIM",
                    },
                    {
                        label: "11 Cofres Artesanos + Llaves",
                        emoji: "1136127811078332578", // 3
                        value: "cofre11:HIM",
                    },
                    {
                        label: "Pase de League of Legends",
                        emoji: "1136127461562781817", // 3
                        value: "pase:HIM",
                    },
                    {
                        label: "Boleto Clash Premium",
                        emoji: "1222600756557774860", // 3
                        value: "boleto:HIM",
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
                case "cofre1": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Cofres` **1**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596> \`3105947529\`, **Bancolombia** <:bancolombia:1134763479925010518> \`91260328099\` , **PayPal** <:paypal:1134763669855678546>. https://bit.ly/RPHUBGLOBAL, BinanceID <:binance:1135310399084965923> \`114799953\`
 `
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
                                const cloudinaryImage = await uploadImageToCloudinary(attachmentURL);
                                await shortenURL(cloudinaryImage).then(async (shortURL) => {
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
                                                value: `\`1 Cofre\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `1 Cofre`, `${shortURL}`, `${UniqueID}`, `ca`]
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
                case "boleto": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado **Boleto Premium de Clash**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596> \`3105947529\`, **Bancolombia** <:bancolombia:1134763479925010518> \`91260328099\` , **PayPal** <:paypal:1134763669855678546>. https://bit.ly/RPHUBGLOBAL, BinanceID <:binance:1135310399084965923> \`114799953\`
     `
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
                                const cloudinaryImage = await uploadImageToCloudinary(attachmentURL);
                                await shortenURL(cloudinaryImage).then(async (shortURL) => {
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
                                                value: `\`Boleto\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `Boleto`, `${shortURL}`, `${UniqueID}`, `ca`]
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
                case "cofre5": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Cofres` **5**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596> \`3105947529\`, **Bancolombia** <:bancolombia:1134763479925010518> \`91260328099\` , **PayPal** <:paypal:1134763669855678546>. https://bit.ly/RPHUBGLOBAL, BinanceID <:binance:1135310399084965923> \`114799953\`
 `
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
                                const cloudinaryImage = await uploadImageToCloudinary(attachmentURL);
                                await shortenURL(cloudinaryImage).then(async (shortURL) => {
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
                                                value: `\`5 Cofres\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `5 Cofres`, `${shortURL}`, `${UniqueID}`, `ca`]
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
                case "cofre11": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Capsulas` **11**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596> \`3105947529\`, **Bancolombia** <:bancolombia:1134763479925010518> \`91260328099\` , **PayPal** <:paypal:1134763669855678546>. https://bit.ly/RPHUBGLOBAL, BinanceID <:binance:1135310399084965923> \`114799953\`
 `
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
                                const cloudinaryImage = await uploadImageToCloudinary(attachmentURL);
                                await shortenURL(cloudinaryImage).then(async (shortURL) => {
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
                                                value: `\`11 Cofres\` RP`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                            }

                                        )
                                        .setDescription(`Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`)
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `11 Cofres`, `${shortURL}`, `${UniqueID}`, `ca`]
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

                case "pase": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el **Pase de League of Legends**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596> \`3105947529\`, **Bancolombia** <:bancolombia:1134763479925010518> \`91260328099\` , **PayPal** <:paypal:1134763669855678546>. https://bit.ly/RPHUBGLOBAL, BinanceID <:binance:1135310399084965923> \`114799953\`
 `
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
                                const cloudinaryImage = await uploadImageToCloudinary(attachmentURL);
                                await shortenURL(cloudinaryImage).then(async (shortURL) => {
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
                                                value: `\`Pase LoL\``,
                                                inline: true,
                                            },
                                            {
                                                name: 'Comprobante', value: `[Click aquí](${shortURL})`, inline: true
                                            }

                                        )
                                        .setDescription(`Por favor corrobora que esta información es correcta, ya que es la que se enviará para que procesen tu pedido.`)
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `Pase`, `${shortURL}`, `${UniqueID}`, `ca`]
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