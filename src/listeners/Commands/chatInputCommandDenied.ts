import { Events, Listener, type ChatInputCommandDeniedPayload, type UserError } from '@sapphire/framework';

export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
  public async run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (Reflect.get(Object(context), 'silent')) return;
    if (Reflect.get(Object(context), 'remaining')) {
      return interaction.reply({
        content: `¡Más lento!\nDebes esperar \`${Math.floor(Reflect.get(Object(context), 'remaining')/1000)}\` segundo${Math.floor(Reflect.get(Object(context), 'remaining')/1000)>1?"s":""} antes de poder volver a usar un comando.`,
        allowedMentions: { users: [interaction.user.id], roles: [] },
        ephemeral: true
      });
    }

    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content,
        embeds: [],
        components: [],
        allowedMentions: { users: [interaction.user.id], roles: [] }
      });
    }

    return interaction.reply({
      content,
      embeds: [],
      components: [],
      allowedMentions: { users: [interaction.user.id], roles: [] },
      ephemeral: true
    });
  }
}