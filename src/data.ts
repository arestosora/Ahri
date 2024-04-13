import dotenv from "dotenv";
import { Credentials } from "./interfaces/credentials";
dotenv.config();

export class Settings {
    public static readonly Credentials: Credentials = {
        token: process.env.TOKEN
    }
}