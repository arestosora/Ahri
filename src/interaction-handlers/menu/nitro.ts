import { InteractionHandler, InteractionHandlerTypes  } from "@sapphire/framework";
import { StringSelectMenuInteraction, EmbedBuilder, MessageCollector, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from "discord.js";
import { Utils } from "../../utils/util";
const { Emojis, Colors, drawTextOnImage, IDGenerator, shortenURL, Prices } = Utils
import { Ahri } from "../..";
import { AhriLogger } from "../../structures/Logger";

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
                .setCustomId(`menu:nitro_a_${data?.join(",")}`)
                .setPlaceholder(
                    options.disabled ? "Menú no disponible" : "Seleccione una opción"
                )
                .setDisabled(options.disabled)
                .setOptions(
                    {
                        label: "Nitro Boost.",
                        emoji: "1153438711732781086", // 2
                        value: "Nitro:HIM",
                    }
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

            selectedOption = selectedOption.replace(":HIM", user).replace("ME", interaction.user.id);
            let args: any[] = selectedOption.split(/:+/g);

            for (let i = 0; i < args.length; i++) {
                args[i] = [...args[i].split(/&+/g)];
            }

            const opcion = args[0][0];

            switch (opcion) {
                case "Nitro": {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${Ahri.user.username}`, iconURL: Ahri.user.displayAvatarURL() })
                                .setColor(Colors.Success)
                                .setDescription(`${Emojis.General.Success} ¡Envia por favor el comprobante de pago!`)
                        ],
                        components: []
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
                                        name: "Nombre",
                                        value: `\`${interaction.user.displayName}\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Producto",
                                        value: `\`Nitro Boost\``,
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
                            await module2.build(botone, { disabled: false, author: interaction.user.id }, [`${interaction.user.id}`, `${interaction.user.username}`, `Nitro`, `${shortURL}`, `${UniqueID}`,`mc`]
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