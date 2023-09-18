import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
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
                .setCustomId(`menus:shop_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "765 RP",
                        emoji: "1134181246029807637", // 1
                        value: "765:HIM",
                    },
                    {
                        label: "1530 RP",
                        emoji: "1134181246029807637", // 2
                        value: "1530:HIM",
                    },
                    {
                        label: "2295 RP",
                        emoji: "1134181246029807637", // 3
                        value: "2295:HIM",
                    },
                    {
                        label: "3060 RP",
                        emoji: "1134181246029807637", // 4
                        value: "3060:HIM",
                    },
                    {
                        label: "3825 RP",
                        emoji: "1134181246029807637", // 5
                        value: "3825:HIM",
                    },
                    {
                        label: "4590 RP",
                        emoji: "1134181246029807637", // 6
                        value: "4590:HIM",
                    },
                    {
                        label: "5355 RP",
                        emoji: "1134181246029807637", // 7
                        value: "5355:HIM",
                    },
                    {
                        label: "6120 RP",
                        emoji: "1134181246029807637", // 8
                        value: "6120:HIM",
                    },
                    {
                        label: "6885 RP",
                        emoji: "1134181246029807637", // 9
                        value: "6885:HIM",
                    },
                    {
                        label: "7650 RP",
                        emoji: "1134181246029807637", // 10
                        value: "7650:HIM",
                    },
                    {
                        label: "8415 RP",
                        emoji: "1134181246029807637", // 11
                        value: "8415:HIM",
                    }, {
                    label: "Skin 1350 RP",
                    emoji: '1136127437659455569', // 12
                    value: 'skin1350:HIM'
                }, {
                    label: "Skin 1820 RP",
                    emoji: '1136127437659455569', // 13
                    value: 'skin1820:HIM'
                }, {
                    label: "Skin 3250 RP",
                    emoji: '1136127437659455569', // 14
                    value: 'skin3250:HIM'
                },
                    {
                        label: '1 Cofre artesano + Llave', // 15
                        emoji: '',
                        value: 'chest1:HIM'
                    },
                    {
                        label: '5 Cofres artesanos + Llaves', // 16
                        emoji: '',
                        value: 'chest5:HIM'
                    },
                    {
                        label: '11 Cofres artesanos + Llaves', // 17
                        emoji: '',
                        value: 'chest11:HIM'
                    },
                    {
                        label: '28 Cofres artesanos + Llaves', // 18
                        emoji: '',
                        value: 'chest28:HIM'
                    },
                    {
                        label: '1X Capsulas Cosmicas', // 19
                        emoji: '',
                        value: 'caps1:HIM'
                    },
                    {
                        label: '3X Capsulas Cosmicas', // 20
                        emoji: '',
                        value: 'caps3:HIM'
                    },
                    {
                        label: '9X Capsulas Cosmicas', // 21
                        emoji: '',
                        value: 'caps9:HIM'
                    },
                    {
                        label: 'Pase LoL', // 22
                        emoji: '',
                        value: 'pase:HIM'
                    },
                    {
                        label: 'Discord Nitro Ultimate', // 23
                        emoji: '',
                        value: 'nitro:HIM'
                    },
                    {
                        label: 'Capsula Prime Gaming', // 24
                        emoji: '',
                        value: 'prime:HIM'
                    },
                    {
                        label: 'Wild Cores', // 25
                        emoji: '',
                        value: 'wc:HIM'
                    },

                )
        );
        resolve(true);
    });
};
export class ShopMenuHandler extends InteractionHandler {
    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
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
                case "765": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `765` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "1530": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `1530` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "2295": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `2295` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "3060": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `3060` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "3825": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `3825` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "4590": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `4590` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "5355": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `5355` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "6120": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `6120` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "6885": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `6885` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "7650": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `7650` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "8415": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado el paquete de `8415` **RP**. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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



                case "skin1350": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado la `Skin de 1350 RP`. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                if (collected) {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                        const textOptions: TextOnImageOptions = {
                                            text: skin, // O el texto que desees poner en la imagen.
                                            fontSize: 100, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 1500, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(attachmentURL, textOptions);
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
                                                    value: `\`${selectedOption}\` RP`,
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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
                                        );

                                        await msg.edit({
                                            content: '',
                                            embeds: [AttachmentEmbed],
                                            components: [botone],
                                        });
                                        // Resto del código relacionado con el flujo de tu switch después de obtener la URL de la imagen con el texto dibujado.

                                    } catch (error) {
                                        Log.error('Error al dibujar texto en la imagen:', error);
                                    }
                                });

                            });

                        }
                    });

                }
                    break;

                case "skin1820": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado la `Skin de 1820 RP`. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                if (collected) {
                                    const NameEmbed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.user.username}`,
                                            iconURL: interaction.user.displayAvatarURL(),
                                        })
                                        .setDescription(
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                        const textOptions: TextOnImageOptions = {
                                            text: skin, // O el texto que desees poner en la imagen.
                                            fontSize: 30, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 1500, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(attachmentURL, textOptions);
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
                                                    value: `\`${selectedOption}\` RP`,
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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
                                        );

                                        await msg.edit({
                                            content: '',
                                            embeds: [AttachmentEmbed],
                                            components: [botone],
                                        });
                                        // Resto del código relacionado con el flujo de tu switch después de obtener la URL de la imagen con el texto dibujado.

                                    } catch (error) {
                                        Log.error('Error al dibujar texto en la imagen:', error);
                                    }
                                });

                            });

                        }
                    });

                }
                    break;

                case "skin3250": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado la `Skin de 3250 RP`. Ahora por favor escribe tu nombre de invocador."
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                            `Perfecto, tu nombre de invocador es \`${name}\` y la skin que deseas adquirir es \`${skin}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                        const textOptions: TextOnImageOptions = {
                                            text: skin, // O el texto que desees poner en la imagen.
                                            fontSize: 100, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 1500, // Posición y del texto en la imagen.
                                        };
                                        const localImagePath = await drawTextOnImage(attachmentURL, textOptions);
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
                                                    value: `\`${selectedOption}\` RP`,
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
                                        await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "chest1": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`1 Cofre de Maestro artesano + Llave\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.CofreArtesano}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "chest5": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`5 Cofres de Maestro artesano + Llaves\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.CofreArtesanoX5}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "chest11": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`11 Cofres de Maestro artesano + Llaves\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.cofreArtesanoX11}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "caps1": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`1 Capsula\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.Capsula}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "caps3": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`3 Capsulas\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.CapsulaX3}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "caps9": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`9 Capsulas\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.CapsulaX9}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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
                                    `Has seleccionado: \`Pase de League of Legends\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.Pase}\` COP. `
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de invocador es \`${name}\`. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518> o por **PayPal** <:paypal:1134763669855678546>.\nPuedes revisar los precios en: <#1133964283764555787>.`
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
                                                value: `\`${selectedOption}\` RP`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                case "nitro": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`Discord Nitro Ultimate\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.DiscordNitro}\` COP. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518>.`
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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
                                        name: "Producto",
                                        value: `\`${selectedOption}\` RP`,
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
                            await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `No`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                    break;

                case "prime": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`Capsula de Prime Gaming\`. Ahora por favor escribe tu nombre de invocador.\n Este tiene un precio de: \`${Prices.CapsulaPrimeGaming}\` COP. Ahora, envía el comprobante de pago como una imagen. ${Emojis.General.Success}\nRecuerda que puedes pagar por **Nequi** <:nequi:1134763235522924596>, **Bancolombia** <:bancolombia:1134763479925010518>`
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [],
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
                                        name: "Producto",
                                        value: `\`${selectedOption}\` RP`,
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
                            await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `No`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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

                    break;

                case "wc": {

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Has seleccionado: \`Wild Cores\`. Este tiene un precio de: \`${Prices.Pase}\` COP. Ahora por favor escribe tu nombre de nombre de usuario para acceder a tu cuenta de LoL:Wild Rift.`
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
                            if (name.length > 16) {
                                await interaction.channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({
                                                name: `${Ahri.user.username}`,
                                                iconURL: Ahri.user.displayAvatarURL(),
                                            })
                                            .setColor(Colors.Error)
                                            .setDescription(
                                                `${Emojis.General.Error} El nombre de invocador no puede tener más de 16 caracteres. Inténtalo de nuevo.`
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
                                    `Perfecto, tu nombre de usuario es \`${name}\`. Ahora, envía la contraseña de tu cuenta de Wild Rift. ${Emojis.General.Success}`
                                )
                                .setColor(Colors.Success);

                            await interaction.channel.send({
                                embeds: [NameEmbed],
                            });

                            const passwordCollector = new MessageCollector(interaction.channel, {
                                filter: (msg) => msg.author.id === interaction.user.id,
                                max: 1,
                                time: 120000,
                            });

                            let password = "";
                            passwordCollector.on("collect", (message) => {
                                password = message.content;
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
                                                name: "Nombre de Usuario",
                                                value: `\`${name}\``,
                                                inline: true,
                                            },
                                            {
                                                name: "Contraseña",
                                                value: `\`${password}\``,
                                                inline: true,
                                            },
                                            {
                                                name: "Producto",
                                                value: `\`${selectedOption}\` WC`,
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
                                    await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${name}/${password}`, `${selectedOption}`, `${shortURL}`, `${UniqueID}`]
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