import { ChatInputCommand, Command } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";
import { Utils } from "../utils/util";
import { Database } from "../structures/Database";
const { Colors, ButtonPages } = Utils;

export class PurchaseCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "view",
      fullCategory: ["cmd"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["Administrator"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder.setName("view").setDescription("Ver los pedidos."),
      {
        idHints: [""],
      }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {

    const pedidos = await Database.pedidos.findMany({
      where: {
        Estado: 'Pendiente'
      }
    });

    // Verificar si hay resultados
    if (pedidos.length === 0) {
      await interaction.reply({
        content: "No hay pedidos pendientes.",
        ephemeral: true // Hace que la respuesta solo sea visible para el usuario que ejecutó el comando
      });
      return;
    }

    const groupedPedidos = this.groupPedidos(pedidos, 4);

    const embeds: EmbedBuilder[] = []; // Creamos un array para almacenar los Embeds

    for (const group of groupedPedidos) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Info)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setFields([
          {
            name: `**Pedidos pendientes:**`,
            value: `\n${group.map((p) => `・**Ref:** \`${p.Referencia}\` ・**Usuario:** <@${p.UserID}>\n **Summoner:** ${p.SN}・\n**Producto:** \`${p.Pedido}\` RP\n・**Comprobante:** [Link](${p.Comprobante})\n・**Estado:** ${p.Estado}, **Cuentas Asignadas:** $${p.Cuentas_Asignadas}`).join('\n\n')}`,
            inline: true
          }
        ]);

      embeds.push(embed); // Agregamos el Embed al array de Embeds
    }

    // Llamamos a ButtonPages con el array de Embeds
    ButtonPages(interaction, embeds);
  }

  private groupPedidos(pedidos: any[], groupSize: number) {
    const groupedPedidos: any[] = [];
    for (let i = 0; i < pedidos.length; i += groupSize) {
      const group = pedidos.slice(i, i + groupSize);
      groupedPedidos.push(group);
    }
    return groupedPedidos;
  }
}