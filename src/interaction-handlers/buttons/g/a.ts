import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, TextChannel } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Ahri } from '../../..';
import { Utils } from '../../../utils/util';
const { Colors, Emojis, Channels } = Utils

interface optionsObject {
  disabled: boolean | undefined,
  author: string | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
  return new Promise(resolve => {
    actionRowBuilder.addComponents(
      new ButtonBuilder()
        .setCustomId(`g:a_a_${data?.join(",")}`)
        .setLabel("Confirmar Pedido")
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Success)
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
     if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
  //  if (cat == __dirname.split(/\\+/g)[__dirname.split(/\\+/g).length - 1] && id == __filename.split(/\\+/g)[__filename.split(/\\+/g).length - 1].split(/\.+/g)[0]) {
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
    console.table(dataArray)
    const confirmed = new EmbedBuilder()
      .setDescription(`Tu pedido ha sido enviado a revisión, recibirás una confirmación en este chat en breves. ${Emojis.General.Info}`)
      .setColor(Colors.Success)

    await interaction.update({ embeds: [confirmed], components: [] })

    const botone = new ActionRowBuilder<ButtonBuilder>
    const module1 = await import('./aa')
    const module2 = await import('./ca')
    await module1.build(botone, { disabled: false, author: interaction.user.id }, dataArray)
    await module2.build(botone, { disabled: false, author: interaction.user.id }, dataArray)

    switch (dataArray[5]) {
      // wildcores
      case "wc": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\``, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "wc") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Wild_Cores_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;
      //riot points
      case "rp": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\` RP`, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "rp") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Riot_Points_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;
      // skins
      case "sk": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`Skin ${dataArray[2]}\` RP`, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "sk") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Skins_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;
      // Miscelanea
      case "mc": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\``, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "mc") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Misc_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;
      // Cofres y Capsulas
      case "ca": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\``, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "ca") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Artesanias_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;

      case "co": {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(Colors.Info)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields([
            {
              name: 'Name', value: `\`${dataArray[1]}\``, inline: true
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\``, inline: true
            },
            {
              name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
            }
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]}`
          })
          .setTimestamp()

        if (dataArray[5] === "co") {
          const channel = Ahri.channels.cache.get(Channels.Staff.Combos_Channel) as TextChannel
          return channel.send({
            components: [botone],
            embeds: [embed],
            content: '@here'
          })
        }
      }
        break;
    }
  }
}