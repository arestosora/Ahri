import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Partials, GatewayIntentBits, ActivityType } from "discord.js";

export class AhriClient extends SapphireClient {
    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
            ],

            failIfNotExists: false,
            shards: "auto",
            logger: {
                level: LogLevel.Info,
            },
            loadMessageCommandListeners: true,

            presence: {
                status: "dnd",
                activities: [
                    {
                        name: 'League of Legends',
                        type: ActivityType.Playing
                    }
                ]
            },
        });
    }
}