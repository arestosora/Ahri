import dotenv from "dotenv";
import crypto from "crypto";
import TinyURL from "tinyurl";
import path from "path";
import fs from "fs";
import { Colors as DiscordColors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { loadImage, createCanvas } from "canvas";
dotenv.config();



export interface TextOnImageOptions {
    text: string;
    fontSize: number;
    fontColor: string;
    x: number;
    y: number;
}

export class Utils {
    public static readonly Emojis = {
        General: {
            Success: process.env.SUCCESS_EMOJI,
            Error: process.env.ERROR_EMOJI,
            Warning: process.env.WARNING_EMOJI,
            Info: process.env.INFO_EMOJI,
        },
        Misc: {
            Love: process.env.LOVE_EMOJI,
            Loading: process.env.LOADING_EMOJI,
        }
    };

    public static readonly Colors = {
        Main: DiscordColors.White,
        Error: DiscordColors.Red,
        Warn: DiscordColors.Yellow,
        Info: DiscordColors.Fuchsia,
        Success: DiscordColors.Green,
    };

    public static readonly Channels = {
        Pedidos: process.env.PEDIDOS_CHANNEL,
        EntegadosLogs: process.env.ENTREGADOS_CHANNEL,
        Menu: process.env.MENU_CHANNEL,
        Entregados: process.env.ENTREGADOS_VOICE_CHANNEL,
        RPTotal: process.env.RPTOTAL_VOICE_CHANNEL,
    };

    public static readonly API = {
        CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        CloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    };

    public static readonly Prices = {
        CofreArtesano: process.env.COFRES1,
        CofreArtesanoX5: process.env.COFRES5,
        cofreArtesanoX11: process.env.COFRES11,
        CofreArtesanoX28: process.env.COFRES28,
        Capsula: process.env.CAPSULA,
        CapsulaX3: process.env.CAPSULA3,
        CapsulaX9: process.env.CAPSULA9,
        Pase: process.env.PASE,
        DiscordNitro: process.env.NITRO,
        CapsulaPrimeGaming: process.env.CAPSULAPRIME,
        WildCores: process.env.WC
    }

    public static async ButtonPages(interaction: any, pages: any[], time: number = 6000) {
        try {
            if (!interaction) throw new Error("No interaction provided");
            if (!pages) throw new Error("No pages provided");
            if (!Array.isArray(pages)) throw new Error("Pages must be an array");

            if (typeof time != "number") throw new Error("Time must be a number");
            if (time < 30000) throw new Error("Time must be greater than 30 seconds");

            await interaction.deferReply();

            if (pages.length === 1) {
                const page = await interaction.editReply({ embeds: pages, components: [] });
                return page;
            }

            const prev = new ButtonBuilder()
                .setCustomId("prev")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⬅️")
                .setDisabled(true);

            const home = new ButtonBuilder()
                .setCustomId("home")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🏠")
                .setDisabled(true);

            const next = new ButtonBuilder()
                .setCustomId("next")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("➡️");

            const buttonRow = new ActionRowBuilder().addComponents(prev, home, next);
            let index = 0;

            const currentPage = await interaction.editReply({
                embeds: [pages[index]],
                components: [buttonRow],
                fetchReply: true
            })

            const collector = currentPage.createMessageComponentCollector({

                ComponentType: ComponentType.Button,
                time,
            });

            collector.on("collect", async (i: any) => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({
                        content: "No has podido interactuar con este menu.",
                        ephemeral: true,
                    });
                }

                await i.deferUpdate();

                if (i.customId === "next") {
                    if (index + 1 === pages.length) {
                        index = 0;
                    } else {
                        index++;
                    }
                } else if (i.customId === "prev") {
                    if (index === 0) {
                        index = pages.length - 1;
                    } else {
                        index--;
                    }
                } else if (i.customId === "home") {
                    index = 0;
                };

                if (index === 0) prev.setDisabled(true);
                else prev.setDisabled(false);

                if (index === 0) home.setDisabled(true);
                else home.setDisabled(false);

                if (index === pages.length - 1) next.setDisabled(true);
                else next.setDisabled(false);

                await currentPage.edit({
                    embeds: [pages[index]],
                    components: [buttonRow],
                });

                collector.resetTimer();
            });

            collector.on("end", async () => {
                await currentPage.edit({
                    components: [],
                    embeds: [pages[index]],
                });
            });

            return currentPage;
        } catch (error) {

        }

    }

    public static async IDGenerator(length = 5) {
        const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const idArray = new Uint8Array(length);
        const randomValues = crypto.randomFillSync(idArray);

        let result = "";
        const charsetLength = charset.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % charsetLength;
            result += charset.charAt(randomIndex);
        }

        return result;
    }

    public static formatNumber(number: number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(2) + "M";
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + "K";
        } else {
            return number.toString();
        }
    }

    public static shortenURL(url: string) {
        return new Promise((resolve, reject) => {
            TinyURL.shorten(url, (res) => {
                if (res.startsWith('Error:')) {
                    reject(new Error(res));
                } else {
                    resolve(res);
                }
            });
        });
    }

    public static async drawTextOnImage(imageURL: string, options: TextOnImageOptions): Promise<string> {
        const { text, fontSize, fontColor, x, y } = options;

        // Carga la imagen desde la URL.
        const image = await loadImage(imageURL);

        // Establece el tamaño del canvas para que coincida con el de la imagen.
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Dibuja la imagen en el canvas.
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Establece las propiedades de estilo del texto.
        ctx.fillStyle = fontColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';

        // Dibuja el texto en el canvas.
        ctx.fillText(text, x, y);

        // Genera un nombre de archivo único para la imagen con el texto dibujado.
        const filename = `${Date.now()}.png`;

        // Guarda el canvas en un archivo en la carpeta local.
        const outputPath = path.join(__dirname, '../../output', filename);
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        return new Promise<string>((resolve, reject) => {
            out.on('finish', () => {
                resolve(outputPath); // Devuelve la ruta del archivo guardado localmente.
            });
            out.on('error', (error) => {
                reject(error);
            });
        });
    }

}
