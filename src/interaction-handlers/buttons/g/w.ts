import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { EmbedBuilder, TextChannel, User, VoiceChannel } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { AhriLogger } from '../../../structures/Logger';
import { Ahri } from '../../..';
import { Database } from '../../../structures/Database';
import { Utils } from '../../../utils/util';
const Log = new AhriLogger()
const { Colors, Emojis, Channels, formatNumber } = Utils


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
      new ButtonBuilder()
        .setCustomId(`g:w_a_${data?.join(",")}`)
        .setLabel("Demorado")
        .setDisabled(options?.disabled)
        .setStyle(ButtonStyle.Secondary)
    );
    resolve(true);
  });
};
export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
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
    const dataArray = interaction.customId.split(/\_+/g)[2].split(/\,+/g);
    const user = await this.container.client.users.fetch(dataArray[0]);

    const botone = new ActionRowBuilder<ButtonBuilder>();
    const module1 = await import("./e");
    await module1.build(
      botone,
      { disabled: false, author: dataArray[1] },
      dataArray
    );

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `Pedido de \`${user.username}\` aceptado por \`${interaction.user.username}\` y en demora... ${Emojis.Misc.Loading}`
          )
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(Colors.Info)
          .setThumbnail(user.displayAvatarURL())
          .addFields([
            {
              name: "Name",
              value: `\`${dataArray[1]}\``,
              inline: true,
            },
            {
              name: 'Product', value: `\`${dataArray[2]}\``, inline: true
            },
            {
              name: "Comp",
              value: `[Click aquí](${dataArray[3]})`,
              inline: true,
            },
          ])
          .setFooter({
            text: `UserID: ${dataArray[0]} ・ Ref: ${dataArray[4]}`,
          })
          .setTimestamp(),
      ],
      components: [botone],
      content: `Pedido en demora... ${Emojis.Misc.Loading}`,
    });

    await Database.pedidos.update({
      where: {
        Referencia: dataArray[4]
      }, data: {
        Estado: 'Demorado'
      }
    })

    try {
      await user.createDM().then(async (dm) => {
        return dm.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Al parecer tu pedido se tardará un poco más de lo esperado en ser entregado ${Emojis.General.Success}.\n**¡Por favor ten paciencia!** pronto se entregará a tu cuenta ${Emojis.Misc.Love}`
              )
              .setColor(Colors.Info)
              .setTimestamp()
              .setAuthor({
                name: Ahri.user.username,
                iconURL: Ahri.user.displayAvatarURL(),
              }),
          ],
        });
      });
    } catch (error) {
      Log.error(error);
    }
  }
}