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
                .setCustomId(`menu:skin_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Skin épica 1350 RP",
                        emoji: "1149419858241532049", // 1
                        value: "epica:HIM",
                    },
                    {
                        label: "Skin Legendaria 1820 RP",
                        emoji: "1149420773275095222", // 2
                        value: "legendaria:HIM",
                    },
                    {
                        label: "Skin Definitiva 3250 RP",
                        emoji: "1149420803151122503", // 3
                        value: "definitiva:HIM",
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
        // if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
        if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && id == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1].split(/\.+/g)[0]) {
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
                case "epica": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado la `Skin Epica de 1350 RP`. Ahora por favor escribe tu nombre de invocador."
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
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 500, // Posición y del texto en la imagen.
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

                case "legendaria": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Has seleccionado la `Skin Legendaria de 1820 RP`. Ahora por favor escribe tu nombre de invocador."
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
                                            fontSize: 50, // El tamaño de la fuente.
                                            fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                            x: 500, // Posición x del texto en la imagen.
                                            y: 500, // Posición y del texto en la imagen.
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

                    case "definitiva": {
                        await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: this.container.client.user.username,
                                        iconURL: this.container.client.user.displayAvatarURL(),
                                    })
                                    .setDescription(
                                        "Has seleccionado la `Skin Definitiva de 3250 RP`. Ahora por favor escribe tu nombre de invocador."
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
                                                fontSize: 50, // El tamaño de la fuente.
                                                fontColor: 'red', // El color del texto (puede ser un valor CSS válido como 'red', '#FF0000', etc.).
                                                x: 500, // Posición x del texto en la imagen.
                                                y: 500, // Posición y del texto en la imagen.
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