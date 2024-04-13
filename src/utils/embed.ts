import { EmbedBuilder, Colors } from "discord.js"

export const AhriEmbedStringSelectMenu = (user: string, icon: string, pack: string) => {
    return new EmbedBuilder()
        .setAuthor({
            name: user,
            iconURL: icon,
        })
        .setDescription(
            `Has seleccionado el paquete de \`${pack}\` **RP**. Ahora por favor escribe tu \`RiotID\` con su respectivo \`#\`, por ejemplo \`Ahri#RPHub\`.`
        )
        .setColor(Colors.Green);
}
