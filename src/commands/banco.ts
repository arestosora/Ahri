import { ChatInputCommand, Command } from "@sapphire/framework";
import { Database } from "../structures/Database";
import { Utils } from "../utils/util";
const { Emojis } = Utils;


export class BancoCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "bancoup",
            fullCategory: ["cmd"],
            requiredClientPermissions: ["Administrator"],
            requiredUserPermissions: ["Administrator"],
        });
    }

    public override registerApplicationCommands(
        registry: ChatInputCommand.Registry
    ) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName("bancoup").setDescription("Recarga las cuentas banco"),
            {
                idHints: [""],
            }
        );
    }

    public override async chatInputRun(interaction: ChatInputCommand.Interaction) {

        const banco = await Database.cuentasBanco.findMany();

        for (const cuenta of banco) {
            await Database.cuentasBanco.updateMany({
                where: {
                    id: cuenta.id
                },
                data: {
                    RPDisponibles: {
                        increment: 3825
                    },
                    Estado: 'Disponible'
                }
            });
        }

        await interaction.reply({
            content: `Cuentas banco recargadas. ${Utils.Emojis.General.Success}`,
            ephemeral: true
        });
    }
}