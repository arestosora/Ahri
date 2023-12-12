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
    disabled: boolean | undefined,
    author: string | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
    return new Promise(resolve => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`g:e_a_${data?.join(",")}`)
                .setLabel("Entregado")
                .setDisabled(options?.disabled)
                .setStyle(ButtonStyle.Primary)
        );
        resolve(true)
    })
};
export class ButtonHandler extends InteractionHandler {

  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
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
        Log.info(dataArray)
        const user = await this.container.client.users.fetch(dataArray[0]) as User
        const cuentasusadas = await Database.pedidos.findUnique({
            where: {
                Referencia: dataArray[4]
            }
        })
        const embed = new EmbedBuilder()
            .setDescription(`Pedido de \`${user.username}\` aceptado por \`${interaction.user.username}\` y entregado ${Emojis.General.Success}`)
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setColor(Colors.Success)
            .setThumbnail(user.displayAvatarURL())
            .addFields([
                {
                    name: 'Name', value: `\`${dataArray[1]}\``, inline: true
                },
                {
                    name: 'Product', value: `\`${dataArray[2]}\``, inline: true
                },
                {
                    name: 'Comp', value: `[Click aquí](${dataArray[3]})`, inline: true
                },
                {
                    name: 'Cuentas', value: `\`${cuentasusadas.Cuentas_Asignadas.length > 0 ? cuentasusadas.Cuentas_Asignadas : 'No hay cuentas asignadas a este pedido'}\``, inline: true
                }
            ])

            .setFooter({
                text: `UserID: ${dataArray[0]} ・ Ref: ${dataArray[4]}`
            })
            .setTimestamp()
        const logChannel = await this.container.client.channels.fetch(Utils.Channels.Staff.Pedidos_Logs) as TextChannel
        Log.info(user.username)


        await interaction.message.delete().then(async () => {
            await logChannel.send({
                embeds: [embed],
                content: `Pedido entregado ${Emojis.General.Success}`
            })
        })

        await Database.pedidos.update({
            where: {
                Referencia: dataArray[4]
            }, data: {
                Estado: 'Entregado'
            }
        })

        try {
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Tu pedido ha sido entregado correctamente ${Emojis.General.Success}.\n**¡Gracias por comprar con nosotros!** ${Emojis.Misc.Love}.\nNos ayudaría mucho si pudieras dejarnos tu referencia en: <#1135618534400077906> :heart:`)
                        .setColor(Colors.Success)
                        .setTimestamp()
                        .setAuthor({
                            name: Ahri.user.username,
                            iconURL: Ahri.user.displayAvatarURL()
                        })
                ]
            })
            Log.info(`Mensaje enviado a ${user.username} (${user.id})`)

        } catch (error) {
            Log.error(`Error al enviar mensaje a ${user.username} (${user.id}) \n ${error}`)
        }

        const rptotal = await Database.pedidos.findMany({
            where: {
                GuildID: '1133932007236309072',
            },
        });

        let sumOfNumbers = 0;

        rptotal.forEach((pedido) => {
            const parsedNumber = parseInt(pedido.Pedido);
            if (!isNaN(parsedNumber)) {
                sumOfNumbers += parsedNumber;
            }
        });

        const formattedSum = formatNumber(sumOfNumbers);

        const entregados = await this.container.client.channels.fetch(Channels.Entregados) as VoiceChannel
        const rpentregado = await this.container.client.channels.fetch(Channels.RPTotal) as VoiceChannel
        const entregadoslogsUsers = await this.container.client.channels.fetch(Channels.EntegadosLogs) as TextChannel
        const entregadosStaff = await this.container.client.channels.fetch(Channels.Staff.Pedidos_Logs) as TextChannel


        const contador = await Database.pedidos.findMany({
            where: {
                Estado: 'Entregado'
            }
        })

        await entregadoslogsUsers.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Se ha entregado el pedido de: \`${dataArray[1]}\` éxitosamente. ${Emojis.General.Success}`)
                    .setColor(Colors.Success)
            ]
        }).catch(() => { }).then(async () => {
            await entregadosStaff.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Se ha entregado el pedido de: \`${dataArray[1]}\` éxitosamente. ${Emojis.General.Success}`)
                        .setColor(Colors.Success)
                ]
            })
        })

        await entregados.setName(`Entregados: ${contador.length}`).catch(() => { })
        await rpentregado.setName(`RP Entregado: ${formattedSum}`).catch(() => { })
    }
}