import { ChatInputCommand, Command } from "@sapphire/framework";
import { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, TextChannel } from "discord.js";
import { Utils } from "../utils/util";
import { Ahri } from "..";
const { Colors, Channels } = Utils


export class PurchaseCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "menu",
      fullCategory: ["shop"],
      requiredClientPermissions: ["SendMessages"],
      requiredUserPermissions: ["Administrator"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder.setName("menu").setDescription("Muestra el menú de la tienda."),
      {
        idHints: [""],
      }
    );
  }

  public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
    const embed = new EmbedBuilder()
      .setTitle("¡Bienvenido a nuestra tienda en Discord! ")
      .setThumbnail(interaction.client.user.displayAvatarURL({ extension: "jpg" }))
      .setFooter({
        text: "Se cumplen términos y condiciones.",
        iconURL: Ahri.user.displayAvatarURL(),
      })
      .setFields([
        {
          name: "‎",
          value:
            "Si deseas realizar un pedido, simplemente haz clic en el botón de abajo y estaré encantada de atenderte. <a:purp_verified:1135277348829282334> ¡Gracias por elegirnos y esperamos brindarte una excelente experiencia de compra! <a:aestheticheart:1135277052023554188>",
        },
        {
          name: "‎",
          value:
            "Si tienes alguna pregunta o necesitas asistencia, no dudes en mencionar a uno de nuestros moderadores o enviar un mensaje en el canal de soporte. <a:blueflame:1135277150874902561> Estamos aquí para garantizar que tu experiencia de compra sea lo más placentera posible.",
        },
        {
          name: "‎",
          value:
            "¡Esperamos con ansias servirte y proporcionarte los mejores productos y servicios! ¡Haz clic en el botón y comencemos! <a:spin:1135277874350403605>",
        },
      ])
      .setColor(Colors.Info);

    const row = new ActionRowBuilder<ButtonBuilder>({
      components: [
        new ButtonBuilder({
          label: "Realizar Pedido",
          style: ButtonStyle.Success,
          customId: "shop:pedido",
          emoji: "1134181246029807637",
        }),

        new ButtonBuilder({
          label: "Precios",
          style: ButtonStyle.Primary,
          customId: "shop:precios",
          emoji: "1135058349621252106",
        }),
        new ButtonBuilder({
          label: "Combos de Inaguración",
          style: ButtonStyle.Secondary,
          customId: "shop:combos",
          emoji: "1135684868701949962",
        })
      ],
    });

    const canal = this.container.client.channels.cache.get(Channels.Menu) as TextChannel

    await canal.send({
      embeds: [embed],
      components: [row]
    })

    return interaction.reply({
      content: "¡Menú enviado!",
      ephemeral: true,
    });
  }
}