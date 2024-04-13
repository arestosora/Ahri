import { InteractionHandler, InteractionHandlerTypes, LoaderPieceContext, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, Emoji, TextChannel, User } from 'discord.js';
import { ActionRowBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Utils } from '../../../utils/util';
const { Colors, Emojis, Prices } = Utils;
import { Database } from "../../../structures/Database";

interface optionsObject {
    disabled: boolean | undefined,
    author: string | undefined
}

interface cuentas {
    id: number;
    Nickname: string;
    Username: string;
    Password: string;
    RPDisponibles: number;
    Nota: string;
    Estado: string;
    createdAt: Date;
    updatedAt: Date;
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

        async function asignarRPs(RP_Pedido: number, cuentas: cuentas[], i = 0, RPsAsignados = 0, cuentasAsignadas = []) {
            if (i >= cuentas.length || RPsAsignados >= RP_Pedido) {
                return cuentasAsignadas;
            }

        
            const cuenta = cuentas[i];
            const RPsDisponibles = cuenta.RPDisponibles;
            const RPsAsignar = Math.min(RPsDisponibles, RP_Pedido - RPsAsignados);
        


            if (RPsDisponibles >= RPsAsignar) {
                cuentasAsignadas.push({
                    Nickname: cuenta.Nickname,
                    Username: cuenta.Username,
                    Password: cuenta.Password,
                    RPsAsignados: RPsAsignar
                });

        
                const newRPDisponibles = RPsDisponibles - RPsAsignar;
                let newEstado = cuenta.Estado;
        
                if (newRPDisponibles < 125) {
                    newEstado = 'No Disponible';
                }
        
                const tableName = dataArray[5]; // Valor en la posición 5 del array
        
                const tableMapping = {
                    "co": Database.cuentasCombo,
                    "ca": Database.cuentasBanco,
                    "rp": Database.cuentas,
                    "sk": Database.cuentasBanco,
                    "tf": Database.cuentasBanco
                };

                if (tableMapping[tableName]) {
                    await tableMapping[tableName].update({
                        where: { Username: cuenta.Username },
                        data: { RPDisponibles: newRPDisponibles, Estado: newEstado },
                    });
                } else {
                    // Manejo de error si el valor en dataArray[5] no coincide con ninguna tabla
                    console.error(`Tabla no encontrada para ${tableName}`);
                }

                RPsAsignados += RPsAsignar;
            }

            return asignarRPs(RP_Pedido, cuentas, i + 1, RPsAsignados, cuentasAsignadas);
        }
        
        



        switch (dataArray[5]) {
            case "co": {
                const Pedido = 2295;

                const cuentas = await Database.cuentasCombo.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                const cuentasAsignadas = await asignarRPs(Pedido, cuentas);

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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados || 'N/A'}\``,
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
                break;
            case "wc": {
                const custompedido = dataArray[2];
                const Pedido = parseInt(custompedido);

                const cuentas = await Database.cuentas.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                const cuentasAsignadas = await asignarRPs(Pedido, cuentas);

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
                  WHERE UserID = ${dataArray[1]}`
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados || 'N/A'}\``,
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
                        embeds: [new EmbedBuilder()
                            .setDescription(`Tu pedido de \`WildCores\` ha sido aceptado ${Emojis.General.Success}.  ${Emojis.Misc.Love}`)
                            .setColor(Colors.Info)
                            .setFooter({
                                text: `Referencia: ${dataArray[4]}`
                            })
                            .setTimestamp()
                        ]
                    });
                });
            }
                break;
            case "rp": {
                const custompedido = dataArray[2];
                const Pedido = parseInt(custompedido);

                const cuentas = await Database.cuentas.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                const cuentasAsignadas = await asignarRPs(Pedido, cuentas);

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
                  WHERE UserID = ${dataArray[1]}`
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados || 'N/A'}\``,
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
                                .setDescription(`Tu pedido ha sido aceptado ${Emojis.General.Success}. Por favor envía una solicitud de amistad a las siguientes cuentas en **League of Legends:**\n > \`${nicknamesAsignados}\`. ${Emojis.General.Info}\n**Nota:** Recibirás una confirmación en este chat una vez se haya entregado tu pedido. ${Emojis.Misc.Love}`)
                                .setColor(Colors.Info)
                                .setFooter({
                                    text: `Referencia: ${dataArray[4]}`
                                })
                                .setTimestamp()
                        ]
                    });
                });
            }
                break;
            case "ca": {


                const Pedido = 2295

                const cuentas = await Database.cuentasBanco.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                if (cuentas.length === 0) {
                    return interaction.reply({
                        content: "No hay suficientes cuentas disponibles para este pedido.",
                        ephemeral: true
                    });
                }

                const cuentasAsignadas = [];


                for (const cuenta of cuentas) {
                    const asignacionExitosa = await asignarRPs(Pedido, [cuenta]);

                    if (asignacionExitosa) {
                        cuentasAsignadas.push(cuenta);
                    }
                }


                if (cuentasAsignadas.length === 0) {
                    return interaction.reply({
                        content: "No se pudo asignar ninguna cuenta para este pedido.",
                        ephemeral: true
                    });
                }
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
                  WHERE UserID = ${dataArray[1]}`
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`||`,
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
                await user.createDM().then(async dm => {
                    return dm.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Tu pedido ha sido aceptado ${Emojis.General.Success}. Por favor envía una solicitud de amistad a las siguientes cuentas en **League of Legends:**\n > \`${nicknamesAsignados}\`. ${Emojis.General.Info}\n**Nota:** Recibirás una confirmación en este chat una vez se haya entregado tu pedido. ${Emojis.Misc.Love}`)
                                .setColor(Colors.Info)
                                .setFooter({
                                    text: `Referencia: ${dataArray[4]}`
                                })
                                .setTimestamp()
                        ]
                    });
                });
            }
                break;
            case "mc": {
                const custompedido = dataArray[2];
                const Pedido = parseInt(custompedido);

                const cuentas = await Database.cuentas.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                const cuentasAsignadas = await asignarRPs(Pedido, cuentas);

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
                  WHERE UserID = ${dataArray[1]}`
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`|| \n**RP Asignado:** \`${cuenta.RPsAsignados || 'N/A'}\``,
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
                                .setDescription(`Tu pedido ha sido aceptado correctamente ${Emojis.General.Success}.`)
                                .setColor(Colors.Info)
                                .setFooter({
                                    text: `Referencia: ${dataArray[4]}`
                                })
                                .setTimestamp()
                        ]
                    });
                });
            }
                break;
            case "sk": {

                const custompedido = dataArray[2];
                const Pedido = parseInt(custompedido);

                const cuentas = await Database.cuentasBanco.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                if (cuentas.length === 0) {
                    return interaction.reply({
                        content: "No hay suficientes cuentas disponibles para este pedido.",
                        ephemeral: true
                    });
                }

                const cuentasAsignadas = [];

                for (const cuenta of cuentas) {
                    const asignacionExitosa = await asignarRPs(Pedido, [cuenta]);


                    if (asignacionExitosa) {
                        cuentasAsignadas.push(cuenta);
                    }
                }

                if (cuentasAsignadas.length === 0) {
                    return interaction.reply({
                        content: "No se pudo asignar ninguna cuenta para este pedido.",
                        ephemeral: true
                    });
                }
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
                  WHERE UserID = ${dataArray[1]}`
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
                            value: `\`Skin ${dataArray[2]} RP\``,
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`||`,
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
                                .setDescription(`Tu pedido ha sido aceptado ${Emojis.General.Success}. Por favor envía una solicitud de amistad a las siguientes cuentas en **League of Legends:**\n > \`${nicknamesAsignados}\`. ${Emojis.General.Info}\n**Nota:** Recibirás una confirmación en este chat una vez se haya entregado tu pedido. ${Emojis.Misc.Love}`)

                                .setColor(Colors.Info)
                                .setFooter({
                                    text: `Referencia: ${dataArray[4]}`
                                })
                                .setTimestamp()
                        ]
                    });
                });
            }
                break;
            case "tf": {

                const Pedido = 2295

                const cuentas = await Database.cuentasBanco.findMany({
                    where: {
                        Estado: 'Disponible'
                    },
                    orderBy: {
                        RPDisponibles: 'asc'
                    }
                });

                if (cuentas.length === 0) {
                    return interaction.reply({
                        content: "No hay suficientes cuentas disponibles para este pedido.",
                        ephemeral: true
                    });
                }

                const cuentasAsignadas = [];

                for (const cuenta of cuentas) {
                    const asignacionExitosa = await asignarRPs(Pedido, [cuenta]);

                    if (asignacionExitosa) {
                        cuentasAsignadas.push(cuenta);
                    }
                }

                if (cuentasAsignadas.length === 0) {
                    return interaction.reply({
                        content: "No se pudo asignar ninguna cuenta para este pedido.",
                        ephemeral: true
                    });
                }
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
                      WHERE UserID = ${dataArray[1]}`
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
                            value: `\`TFT ${dataArray[2]}\``,
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
                            value: `**Nickname:** \`${cuenta.Nickname || 'N/A'}\`, \n**Username:** \`${cuenta.Username || 'N/A'}\`, \n**Password:** ||\`${cuenta.Password || 'N/A'}\`||`,
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
                                .setDescription(`Tu pedido ha sido aceptado ${Emojis.General.Success}. Por favor envía una solicitud de amistad a las siguientes cuentas en **League of Legends:**\n > \`${nicknamesAsignados}\`. ${Emojis.General.Info}\n**Nota:** Recibirás una confirmación en este chat una vez se haya entregado tu pedido. ${Emojis.Misc.Love}`)

                                .setColor(Colors.Info)
                                .setFooter({
                                    text: `Referencia: ${dataArray[4]}`
                                })
                                .setTimestamp()
                        ]
                    });
                });
            }
                break;
        }
    }
}