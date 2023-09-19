import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, Emoji, TextChannel, User } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Utils } from '../../../utils/util';
const { Colors, Emojis } = Utils;
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
        //  if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
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
        const user = await this.container.client.users.fetch(dataArray[0]) as User

        const botone = new ActionRowBuilder<ButtonBuilder>
        const module1 = await import('./e')
        const module2 = await import('./w')
        await module1.build(botone, { disabled: false, author: interaction.user.id }, dataArray)
        await module2.build(botone, { disabled: false, author: interaction.user.id }, dataArray)

        async function asignarRPs(RP_Pedido, cuentas) {
            const custompedido = dataArray[2].toLowerCase();
            const customPrefixes = ["custom", "orb", "skin"];
            let RP_Pedido_Modificado = custompedido.startsWith("custom") ? 2295 : parseInt(custompedido);

            if (customPrefixes.some(prefix => custompedido.startsWith(prefix))) {
                if (custompedido === "skin3250" || custompedido === "skin1350" || custompedido === "skin1820") {
                    const cuentasBanco = await Database.cuentas_Banco.findMany({
                        where: {
                            Estado: 'Disponible'
                        }
                    });

                    const cuenta = cuentasBanco[0];
                    if (cuenta) {
                        let RPsAsignar = 0;

                        if (custompedido === "skin3250") {
                            RPsAsignar = 3250;
                        } else if (custompedido === "skin1350") {
                            RPsAsignar = 1350;
                        } else if (custompedido === "skin1820") {
                            RPsAsignar = 1820;
                        }

                        if (cuenta.RPDisponibles >= RPsAsignar) {
                            const cuentasAsignadas = [{
                                Nickname: cuenta.Nickname,
                                Username: cuenta.Username,
                                Password: cuenta.Password,
                                RPsAsignados: RPsAsignar
                            }];

                            await Database.cuentas_Banco.update({
                                where: { Username: cuenta.Username },
                                data: {
                                    RPDisponibles: cuenta.RPDisponibles - RPsAsignar,
                                    Estado: cuenta.RPDisponibles - RPsAsignar <= RPsAsignar ? 'No Disponible' : cuenta.Estado,
                                },
                            });

                            return cuentasAsignadas;
                        } else {
                            return [];
                        }
                    }
                } else {
                    const cuentasCombos = await Database.cuentas_Combos.findMany({
                        where: {
                            Estado: 'Disponible'
                        }
                    });

                    const cuenta = cuentasCombos[0];
                    if (cuenta) {
                        const RPsAsignar = 2295;

                        if (cuenta.RPDisponibles >= RPsAsignar) {
                            const cuentasAsignadas = [{
                                Nickname: cuenta.Nickname,
                                Username: cuenta.Username,
                                Password: cuenta.Password,
                                RPsAsignados: RPsAsignar
                            }];

                            await Database.cuentas_Combos.update({
                                where: { Username: cuenta.Username },
                                data: { RPDisponibles: 0, Estado: 'No Disponible' },
                            });

                            return cuentasAsignadas;
                        } else {
                            return [];
                        }
                    }
                }
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

                        await Database.cuentas.update({
                            where: { Username: cuenta.Username },
                            data: { RPDisponibles: RPsDisponibles - RPsAsignar },
                        });

                        if (RPsDisponibles - RPsAsignar === 0) {
                            await Database.cuentas.update({
                                where: { Username: cuenta.Username },
                                data: { Estado: 'No Disponible' },
                            });
                        }

                        RPsAsignados += RPsAsignar;
                    }

                    i++;
                }

                if (cuentasAsignadas.length > 0) {
                    console.table(cuentasAsignadas);
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

        if (cuentasAsignadas.length === 0) return;

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
                    name: 'Summoner Name',
                    value: `\`${dataArray[1]}\``,
                    inline: true
                },
                {
                    name: 'Producto',
                    value: `\`${dataArray[2]}\` RP`,
                    inline: true
                },
                {
                    name: 'Comprobante',
                    value: `[Click aquí](${dataArray[3]})`,
                    inline: true
                }
            ])
            .setFooter({
                text: `UserID: ${dataArray[0]} ・ Referencia: ${dataArray[4]}`
            });

        // Crear un field por cada cuenta asignada
        cuentasAsignadas.forEach((cuenta, index) => {
            embed.addFields({
                name: `Cuenta Asignada ${index + 1}`,
                value: `**Nickname:** \`${cuenta.Nickname}\`, \n**Username:** \`${cuenta.Username}\`, \n**Password:** ||\`${cuenta.Password}\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados}\``,
                inline: true
            });
        });

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