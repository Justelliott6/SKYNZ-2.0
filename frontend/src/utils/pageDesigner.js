// Deterministic, local-first prototype designer. No external AI API or secret required.
// Returns proposed edits only; the creator reviews and saves them.
export function proposePageDesign(instruction, current) {
  const prompt = instruction.trim();
  if (!prompt) return { changes: {}, explanation: 'Enter a design instruction first.' };
  const lower = prompt.toLowerCase();
  const supported = ['youtube', 'spotify', 'twitch', 'instagram', 'tiktok', 'discord', 'patreon', 'twitter', 'facebook', 'soundcloud', 'website'];
  const mentioned = supported.filter(platform => lower.includes(platform));
  const platforms = Array.from(new Set([...(current.platforms || []), ...mentioned]));
  const changes = { platforms };
  const description = [];
  if (/country|southern|rock|rap|hip.hop|metal|pop|electronic|gospel|jazz|blues/i.test(prompt)) {
    const genres = ['country', 'southern', 'rock', 'rap', 'hip-hop', 'metal', 'pop', 'electronic', 'gospel', 'jazz', 'blues'].filter(x => lower.includes(x));
    description.push('Music and creator content featuring ' + genres.join(', ') + '.');
  }
  if (/live|stream/i.test(prompt)) description.push('Join the live stream and chat with the community.');
  if (/support|donat|fan|merch/i.test(prompt)) description.push('Support the creator using the links on this page.');
  if (description.length && !current.description?.trim()) changes.description = description.join(' ');
  if (!current.title?.trim()) {
    changes.title = /music|song|artist|band|country|rock|rap/i.test(prompt) ? 'My Music Stage' : 'My Creator Stage';
  }
  return {
    changes,
    explanation: [
      mentioned.length ? 'Added ' + mentioned.join(', ') + ' to your selected platforms.' : 'Kept your existing platform selection.',
      description.length ? 'Suggested a description where one was blank.' : 'Kept your existing description.',
      'Add real links, review the result, then save. This is an offline rules-based assistant, not a connected AI model.'
    ].join(' ')
  };
}
