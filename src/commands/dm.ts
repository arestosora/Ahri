import { ChatInputCommand, Command } from "@sapphire/framework";

export class DMCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: "dm",
            description: "send mass dm",
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
                .setName("dm")
                .setDescription("Send mass dm")
                .addStringOption((option) => option
                    .setName("message")
                    .setDescription("The message you want to send")
                    .setRequired(true)));
    }

    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
        const message = interaction.options.getString("message");
        const guild = interaction.guild;
        if (!guild) return interaction.reply("This command can only be used in a guild/server.");

        const members = guild.members.cache.filter(member => !member.user.bot); 
        const totalMembers = members.size;
        const estimatedTime = totalMembers * 2000; // 2 seconds delay per member

        await interaction.reply({
            content: `Sending... Estimated time: \`${msToTime(estimatedTime)}\` <a:loading:1134703438480036010>`
        });

        try {
            const delay = 2000; // 2 seconds delay between each message
            let index = 0;
            for (const member of members.values()) {
                try {
                    await member.send(message);
                } catch (error) {
                    console.error(`Failed to send message to ${member.user.tag}: ${error}`);
                }
                // Introduce a delay between each message
                if (index < totalMembers - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                index++;
            }
            return interaction.editReply("Message sent to all members of the server.");
        } catch (error) {
            console.error("Failed to fetch members:", error);
            await interaction.editReply("Failed to fetch members of the server.");
        }
    }
}

// Function to convert milliseconds to a readable time format
function msToTime(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hoursString = (hours < 10) ? "0" + hours : hours;
    const minutesString = (minutes < 10) ? "0" + minutes : minutes;
    const secondsString = (seconds < 10) ? "0" + seconds : seconds;

    return hoursString + ":" + minutesString + ":" + secondsString;
}
