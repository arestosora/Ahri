import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Utils } from '../../../utils/util';
import { Ahri } from "../../..";

const { Colors, Emojis, Channels } = Utils

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`g:ca_a_${data?.join(",")}`)
        .setLabel("Cancelar Pedido")
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Danger)
    );
    resolve(true)
  })
};
export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    });
  }

  public override async parse(interaction: ButtonInteraction) {
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

  public async run(interaction: ButtonInteraction) {
    const dataArray = interaction.customId.split(/\_+/g)[2].split(/\,+/g)
    const user = await this.container.client.users.fetch(dataArray[0])
    const cancelembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(`${Emojis.General.Error} Pedido de \`${user.username}\` ha sido cancelado por \`${interaction.user.username}\``)
      .setColor(Colors.Error)
      .setThumbnail(user.displayAvatarURL())
      .addFields([
        {
          name: 'Summoner Name', value: `\`${dataArray[1]}\``, inline: true
        },
        {
          name: 'Producto', value: `\`${dataArray[2]}\` RP`, inline: true
        },
        {
          name: 'Comprobante', value: `[Click aquí](${dataArray[3]})`, inline: true
        }
      ])
      .setFooter({
        text: `UserID: ${dataArray[0]} ・ Referencia: ${dataArray[4]}`
      })
      .setTimestamp()
    await interaction.update({ embeds: [cancelembed], components: [], content: `Pedido rechazado ${Emojis.General.Error}` })


    const dm = await user.createDM()
    const embed = new EmbedBuilder()
      .setAuthor({
        name: Ahri.user.username,
        iconURL: Ahri.user.displayAvatarURL()
      })
      .setDescription(`${Emojis.General.Error} Tu pedido ha sido rechazado. Te recomiendo verificar la información y volver a intentarlo.\nSi el problema persiste puedes comunicarte con los administradores en: <#1133932007886422152>`)
      .setColor(Colors.Error)
      .setTimestamp()

    await dm.send({ embeds: [embed] }).catch(() => { })

  }
}