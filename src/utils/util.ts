import dotenv from "dotenv";
import crypto from "crypto";
import TinyURL from "tinyurl";
import path from "path";
import fs from "fs";
import { Colors as DiscordColors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { Image, createCanvas, Canvas } from "canvas";
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
        CofreArtesano: parseInt(process.env.COFRES1),
        CofreArtesanoX5: parseInt(process.env.COFRES5),
        cofreArtesanoX11: parseInt(process.env.COFRES11),
        CofreArtesanoX28: parseInt(process.env.COFRES28),
        Capsula: parseInt(process.env.CAPSULA),
        CapsulaX3: parseInt(process.env.CAPSULA3),
        CapsulaX9: parseInt(process.env.CAPSULA9),
        Pase: parseInt(process.env.PASE),
        DiscordNitro: parseInt(process.env.NITRO),
        CapsulaPrimeGaming: parseInt(process.env.CAPSULAPRIME),
        WildCores: parseInt(process.env.WC)
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

    public static async drawTextOnImage(backgroundImage: Image, options: TextOnImageOptions, imageToDraw: Image): Promise<string> {
        const { text, fontSize, fontColor } = options;
    
        // Crea un canvas con las dimensiones del fondo (1280x720).
        const canvas = createCanvas(1280, 720);
        const ctx = canvas.getContext('2d');
    
        // Dibuja la imagen de fondo en el canvas.
        ctx.drawImage(backgroundImage, 0, 0, 1280, 720);
    
        // Calcula las dimensiones de la imagen para que quepa dentro del fondo (1280x720).
        const maxWidth = 1280;
        const maxHeight = 720;
        const aspectRatio = imageToDraw.width / imageToDraw.height;
    
        let newWidth = maxWidth;
        let newHeight = maxWidth / aspectRatio;
    
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = maxHeight * aspectRatio;
        }
    
        // Calcula las coordenadas para centrar la imagen dentro del fondo.
        const imageX = (1280 - newWidth) / 2;
        const imageY = (720 - newHeight) / 2;
    
        // Dibuja la imagen adicional (imageToDraw) en el canvas, haciendo que quepa dentro de 1280x720.
        ctx.drawImage(imageToDraw, imageX, imageY, newWidth, newHeight);
    
        // Establece las propiedades de estilo del texto.
        ctx.fillStyle = fontColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
    
        // Calcula las coordenadas para centrar el texto en el canvas.
        const textX = 1280 / 2;
        const textY = 500;
    
        // Dibuja el texto en el centro del canvas, delante de la imagen.
        ctx.fillText(text, textX, textY);
    
        // Genera un nombre de archivo único para la imagen con el texto dibujado.
        const filename = `${Date.now()}.png`;
    
        // Guarda el canvas en un archivo en la carpeta local.
        const outputPath = path.join(__dirname, './output', filename);
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
