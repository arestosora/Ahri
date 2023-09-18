import dotenv from "dotenv";

dotenv.config();

export class BotData {
    private static readonly instance = new BotData();
    private readonly botToken: string;
    private constructor() {
        const { TOKEN } = process.env;

        if (!TOKEN) {
            throw new Error("Bot token is not defined in the environment variables.");
        }

        this.botToken = TOKEN;

    }

    public static getInstance(): BotData {
        return BotData.instance;
    }

    get getToken(): string {
        return this.botToken;
    }

}