import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, Emoji, TextChannel, User } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Utils } from '../../../utils/util';
const { Colors, Emojis, Prices } = Utils;
import { Database } from "../../../structures/Database";

interface optionsObject {
    disabled: boolean | undefined,
    author: string | undefined
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject, data: String[] | undefined) => {
    return new Promise(resolve => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`g:aa_a_${data?.join(",")}`)
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
        const user = await this.container.client.users.fetch(dataArray[0]) as User

        const botone = new ActionRowBuilder<ButtonBuilder>
        const module1 = await import('./e')
        const module2 = await import('./w')
        await module1.build(botone, { disabled: false, author: interaction.user.id }, dataArray)
        await module2.build(botone, { disabled: false, author: interaction.user.id }, dataArray)

        async function asignarRPs(_RP_Pedido: number, cuentas: string | any[]) {
            const custompedido = dataArray[2].toLowerCase();
            if (custompedido === "nitro" || custompedido.endsWith("wc")) {
                return [''];
            }
            console.log(custompedido);

            const customPrefixes = ["cofre", "capsula", "skin", "pase"];
            const customPrefixMap = {
                "skin3250": 3250,
                "skin1350": 1350,
                "skin1820": 1820,
                "cofre1": 250,
                "cofre5": 250 * 5,
                "cofre11": 250 * 11,
                "pase": 1650,
                "capsula1": 750,
                "capsula3": 750 * 3,
                "capsula9": 750 * 9,
                "capsula11": 750 * 11,
            };

            let RP_Pedido_Modificado = parseInt(custompedido);

            if (customPrefixes.some(prefix => custompedido.startsWith(prefix))) {
                const RPsAsignar = customPrefixMap[custompedido];

                if (!RPsAsignar) {
                    return [];
                }

                const cuentasBanco = await Database.cuentas_Banco.findMany({
                    where: {
                        Estado: 'Disponible'
                    }
                });

                let cuentasAsignadas = [];
                let RPsAsignados = 0;

                for (const cuenta of cuentasBanco) {
                    if (RPsAsignados >= RP_Pedido_Modificado) {
                        break;
                    }

                    if (cuenta.RPDisponibles >= RPsAsignar) {
                        cuentasAsignadas.push({
                            Nickname: cuenta.Nickname,
                            Username: cuenta.Username,
                            Password: cuenta.Password,
                            RPsAsignados: RPsAsignar
                        });

                        const newRPDisponibles = cuenta.RPDisponibles - RPsAsignar;
                        let newEstado = cuenta.Estado;

                        if (newRPDisponibles === 0) {
                            newEstado = 'No Disponible';
                        }

                        await Database.cuentas_Banco.update({
                            where: { Username: cuenta.Username },
                            data: {
                                RPDisponibles: newRPDisponibles,
                                Estado: newEstado,
                            },
                        });

                        RPsAsignados += RPsAsignar;
                    }
                }

                if (RPsAsignados < RP_Pedido_Modificado) {
                    return [];
                }

                return cuentasAsignadas;
            } else {
                let cuentasAsignadas = [];
                let RPsAsignados = 0;
                let i = 0;

                while (RPsAsignados < RP_Pedido_Modificado && i < cuentas.length) {
                    const cuenta = cuentas[i];
                    const RPsDisponibles = cuenta.RPDisponibles;
                    const RPsAsignar = Math.min(RPsDisponibles, RP_Pedido_Modificado - RPsAsignados);

                    if (RPsDisponibles >= RPsAsignar) {
                        cuentasAsignadas.push({
                            Nickname: cuenta.Nickname,
                            Username: cuenta.Username,
                            Password: cuenta.Password,
                            RPsAsignados: RPsAsignar
                        });

                        const newRPDisponibles = RPsDisponibles - RPsAsignar;
                        let newEstado = cuenta.Estado;

                        if (newRPDisponibles === 0) {
                            newEstado = 'No Disponible';
                        }

                        await Database.cuentas.update({
                            where: { Username: cuenta.Username },
                            data: { RPDisponibles: newRPDisponibles, Estado: newEstado },
                        });

                        RPsAsignados += RPsAsignar;
                    }

                    i++;
                }

                return cuentasAsignadas;
            }
        }



        const custompedido = dataArray[2];
        const RP_Pedido = parseInt(custompedido);

        const cuentas = await Database.cuentas.findMany({
            where: {
                Estado: 'Disponible'
            },
            orderBy: {
                RPDisponibles: 'asc'
            }
        });

        const cuentasAsignadas = await asignarRPs(RP_Pedido, cuentas);

        if (cuentasAsignadas.length === 0) {
            return interaction.reply({
                content: "No hay suficientes cuentas disponibles para este pedido.",
                ephemeral: true
            });
        };

        const nicknamesAsignados = cuentasAsignadas.map(cuenta => cuenta.Nickname).join(', ');

        await Database.pedidos.create({
            data: {
                Referencia: dataArray[4],
                SN: dataArray[1],
                UserID: dataArray[0],
                Pedido: `${dataArray[2]}`,
                Cuentas_Asignadas: nicknamesAsignados,
                Comprobante: `${dataArray[3]}`,
            }
        })

        const usuario = await Database.users.findUnique({
            where: {
                UserID: dataArray[0]
            }
        })

        if (!usuario) {
            await Database.users.create({
                data: {
                    UserID: dataArray[0]
                }
            })
        } else {
            await Database.$queryRaw`UPDATE Users
          SET Pedidos = Pedidos + 1,
              updatedAt = NOW(3)
          WHERE UserID = ${dataArray[0]}`
        }

        const embed = new EmbedBuilder()
            .setDescription(`Pedido de \`${user.username}\` aceptado por \`${interaction.user.username}\` ${Emojis.General.Success}`)
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setColor(Colors.Info)
            .setThumbnail(user.displayAvatarURL())
            .addFields([
                {
                    name: 'Name',
                    value: `\`${dataArray[1]}\``,
                    inline: true
                },
                {
                    name: 'Product',
                    value: `\`${dataArray[2]}\``,
                    inline: true
                },
                {
                    name: 'Comp',
                    value: `[Click aquí](${dataArray[3]})`,
                    inline: true
                }
            ])
            .setFooter({
                text: `UserID: ${dataArray[0]} ・ Ref: ${dataArray[4]}`
            });

        if (cuentasAsignadas && cuentasAsignadas.length > 0) {
            cuentasAsignadas.forEach((cuenta, index) => {
                embed.addFields({
                    name: `Cuenta Asignada ${index + 1}`,
                    value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A' }\`, \n**Password:** ||\`${cuenta.Password || 'N/A'  }\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados || 'N/A'  }\``,
                    inline: true
                });
            });
        } else {
            embed.addFields({
                name: `Cuenta Asignada`,
                value: cuentasAsignadas === undefined ? "N/A" : "No hay cuentas asignadas para este pedido.",
                inline: true
            });
        }



        await interaction.update({
            components: [botone],
            embeds: [embed],
            content: `Pedido por entregar ${Emojis.Misc.Loading}`
        });

        await user.createDM().then(async dm => {
            return dm.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Tu pedido ha sido aceptado ${Emojis.General.Success}. Por favor envía una solicitud de amistad a las siguientes cuentas en **League of Legends:** \`${nicknamesAsignados}\`. ${Emojis.General.Info}\n**Nota:** Recibirás una confirmación en este chat una vez se haya entregado tu pedido. ${Emojis.Misc.Love}`)
                        .setColor(Colors.Info)
                        .setFooter({
                            text: `Referencia: ${dataArray[4]}`
                        })
                        .setTimestamp()
                ]
            });
        });
    }
}