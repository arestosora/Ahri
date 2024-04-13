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
                .setCustomId(`menu:shop_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Riot Points",
                        emoji: "1153831080906985662", // 1
                        value: "RP:HIM",
                    },
                    {
                        label: "Skins League of Legends",
                        emoji: "1149420803151122503", // 1
                        value: "skins:HIM",
                    },
                    {
                        label: "Artesanía Hextech",
                        emoji: "1136127811078332578", // 1
                        value: "artesania:HIM",
                    },
                    {
                        label: "Capsulas",
                        emoji: "1149426772765581442", // 1
                        value: "capsulas:HIM",
                    },
                    {
                        label: "Teamfight Tactics",
                        emoji: "1222595790170488832", // 1
                        value: "tft:HIM",
                    },
                    {
                        label: "TFT Coins",
                        emoji: "1222595790170488832", // 1
                        value: "tftc:HIM",
                    },
                    {
                        label: "Combos",
                        emoji: "📦", // 1
                        value: "combos:HIM",
                    },
                    {
                        label: "Wild Cores LoL: Wild Rift",
                        emoji: "1149424355353313420", // 1
                        value: "wc:HIM",
                    },
                    {
                        label: "Discord Nitro Boost",
                        emoji: "1153438711732781086", // 1
                        value: "nitro:HIM",
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
            const data = interaction.customId.split(/_+/g)[interaction.customId.split(/_+/g).length - 1].split(/,+/g);
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
                case "RP": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./rp');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Riot Points\` por favor selecciona la cantidad que deseas adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }

                    break;

                case "skins": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./skin');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Skins de League of Legends\` por favor selecciona que tipo de Skin deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }

                    break;

                case "artesania": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./chest');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Artesanía de League of Legends\` por favor selecciona que tipo de artesanía deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }

                    break;

                case "capsulas": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./cap');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Artesanía de League of Legends\` por favor selecciona que tipo de artesanía deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }

                    break;

                case "nitro": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./nitro');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Discord Nitro Ultimate\` por favor selecciona que tipo de Nitro deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }

                    break;

                case "wc": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./wc');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`LoL: Wild Rift Wild Cores\` por favor selecciona que cantidad de Wild Cores deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }
                    break;
                case "combos": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./comb');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado el producto \`Combos League of Legends\` por favor selecciona el combo que deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }
                    break;
                case "tft": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./tft');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado la opcion de \`Teamfight Tactics\` por favor selecciona el combo que deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
                    });
                }
                    break;
                case "tftc": {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>
                    const menu = await import('./tftc');
                    await menu.build(row, { disabled: false, author: interaction.user.id }, [])
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: this.container.client.user.username,
                                    iconURL: this.container.client.user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "Parece que has seleccionado la opcion de \`Teamfight Tactics\` por favor selecciona el combo que deseas Adquirir."
                                )
                                .setColor(Colors.Success),
                        ],
                        components: [row],
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