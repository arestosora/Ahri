import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, type ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Utils } from '../../utils/util';
const { Emojis, Colors } = Utils
import { Database } from '../../structures/Database';

export class ButtonHandler extends InteractionHandler {
    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'shop:pedido') return this.none();

        return this.some();
    }

    private async PedidosActivados(interaction: ButtonInteraction) {
        const Guild = await Database.config.findUnique({
            where: {
                GuildID: interaction.guild.id
            }
        });

        if (Guild.Pedidos_Enabled === false) {
            return interaction.reply({
                content: `Los pedidos están desactivados en este momento. ${Emojis.General.Error}`,
                ephemeral: true
            })
        }
    }

    public async run(interaction: ButtonInteraction) {

        if (await this.PedidosActivados(interaction)) return;
        const Embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setDescription(
                `Bienvenid@ al sistema de pedidos de **Riot Poins** de **${interaction.guild.name}** ${Emojis.Misc.Love}.\nSoy \`${interaction.client.user.username}\`! \n**Estaré encargada de atenderte el día de hoy.**\nPrimeramente quiero que escojas que producto quieres comprar. ${Emojis.General.Info}`
            )
            .setColor(Colors.Info)

        const row = new ActionRowBuilder<StringSelectMenuBuilder>
        const options = await import('../menus/shop');
        await options.build(row, { disabled: false, author: interaction.user.id }, [])

        try {
            await interaction.user.send({
                embeds: [Embed],
                components: [row],

            })
        } catch (error) {
            return interaction.reply({
                content: `No he podido comunicarme contigo. **¡Por favor revisa si tienes tus mensajes privados desactivados!**. ${Emojis.General.Error}`,
            })
        }

        return interaction.reply({
            content: `Revisa tus mensajes privados. ${Emojis.General.Success}`,
            ephemeral: true,
        })
    }
}