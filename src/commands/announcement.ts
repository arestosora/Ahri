import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { Colors, TextChannel } from "discord.js";

export class DMCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: "announcement",
            description: "Send an announcement",
            fullCategory: ["cmd"],
            requiredClientPermissions: ["Administrator"],
            requiredUserPermissions: ["Administrator"],
        });
    }

    public override registerApplicationCommands(
        registry: ChatInputCommand.Registry
    ) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("announcement")
                .setDescription("Send an announcement")
                .addStringOption((option) => option.setName("title").setDescription("Titulo que va a llevar el anuncio").setRequired(true))
                .addStringOption((option) => option.setName("body").setDescription("El contenido que va a llevar el anuncio").setRequired(true))
                .addStringOption((option) => option.setName("footer").setDescription("Subpie del anuncio").setRequired(true))
                .addNumberOption((option) => option.setName("color").setDescription("Color del embed").setRequired(true)
                    .addChoices(
                        { name: 'White', value: Colors.White },
                        { name: 'Aqua', value: Colors.Aqua },
                        { name: 'Green', value: Colors.Green },
                        { name: 'Blue', value: Colors.Blue },
                        { name: 'Yellow', value: Colors.Yellow },
                        { name: 'Purple', value: Colors.Purple },
                        { name: 'LuminousVividPink', value: Colors.LuminousVividPink },
                        { name: 'Fuchsia', value: Colors.Fuchsia },
                        { name: 'Gold', value: Colors.Gold },
                        { name: 'Orange', value: Colors.Orange },
                        { name: 'Red', value: Colors.Red },
                        { name: 'Navy', value: Colors.Navy },
                        { name: 'DarkGreen', value: Colors.DarkGreen },
                        { name: 'DarkBlue', value: Colors.DarkBlue },
                        { name: 'DarkPurple', value: Colors.DarkPurple },
                        { name: 'DarkVividPink', value: Colors.DarkVividPink },
                        { name: 'DarkRed', value: Colors.DarkRed },
                        { name: 'DarkGrey', value: Colors.DarkGrey },
                        { name: 'DarkerGrey', value: Colors.DarkerGrey },
                        { name: 'LightGrey', value: Colors.LightGrey },
                        { name: 'DarkNavy', value: Colors.DarkNavy },
                        { name: 'Blurple', value: Colors.Blurple },
                        { name: 'DarkButNotBlack', value: Colors.DarkButNotBlack },

                    ))
                .addChannelOption((option) => option.setRequired(true).setName("canal").setDescription("Canal a enviar"))
        );
    }

    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        const title = interaction.options.getString("title")
        const body = interaction.options.getString("body")
        const footer = interaction.options.getString("footer")
        const color = interaction.options.getNumber("color")
        const channel = interaction.options.getChannel("canal") as TextChannel

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(body)
            .setFooter({ text: footer, iconURL: `${interaction.client.application.iconURL}` })
            .setColor(color)
            .setTimestamp()

        await channel.send({
            content: '# Nuevo Anuncio @everyone!',
            embeds: [embed]
        })

        await interaction.reply({
            content: 'Send!',
            embeds: [embed],
            ephemeral: true
        })
    }
}

