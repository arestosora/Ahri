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
                .setCustomId(`menu:cap_a_${data?.join(",")}`)
                .setPlaceholder(options.disabled ? "Menú no disponible" : "Seleccione una opción")
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Capsula Prime Gaming",
                        emoji: "1149426772765581442",
                        value: "prime:HIM",
                    },
                    {
                        label: "1 Capsula",
                        emoji: "1149426772765581442",
                        value: "capsula1:HIM",
                    },
                    {
                        label: "3 Capsulas",
                        emoji: "1149426772765581442",
                        value: "capsula3:HIM",
                    },
                    {
                        label: "9 Casulas",
                        emoji: "1149426772765581442",
                        value: "capsula9:HIM",
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
        //if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && id == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1].split(/\.+/g)[0]) {
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
                case "capsula3": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Capsulas` **3**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                                value: `\`3 Capsulas\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `3 Capsulas`, `${shortURL}`,  `${UniqueID}`,`ca`]
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
                case "capsula1": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Capsulas` **1**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                const attachmentName = attachment?.name;
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
                                                value: `\`1 Capsula\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`ca`, `${interaction.user.id}`, `${name}`, `1 Capsula`, `${shortURL}`, `${UniqueID}`,`ca` ]
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
                case "capsula9": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `Capsulas` **9**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`. "
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
                                const attachmentName = attachment?.name;
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
                                                value: `\`9 Capsulas\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `9 Capsulas`, `${shortURL}`, `${UniqueID}`,`ca`]
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
                case "capsula11": {
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
                                                value: `\`11 Capsulas\``,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`ca`, `${interaction.user.id}`, `${name}`, `11 Capsulas`, `${shortURL}`, `${UniqueID}`]
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
                case "prime": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado `Capsula Prime`. Por favor escribe tu nombre de usuario de acceso a tu cuenta."
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
                                    `Perfecto, tu username es \`${name}\`. Ahora, por favor, escribe la contraseña.`
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
                                            `Perfecto, tus datos de acceso son ${name}, ${skin}. Ahora, envía el comprobante.`
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
                                            text: `Email: ${name}\nPassword: ${skin}`,
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
                                                    value: `\`Capsulas Prime\``,
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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `Prime Gaming`, `${shortURL}`, `${UniqueID}`,`mc`]);

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