export type BirthdayTheme = 'pink' | 'lavender' | 'sunshine';
export interface BirthdayConfig {
  recipientName: string;
  recipientAge: string;
  senderName: string;
  theme: BirthdayTheme;
  introGreeting: string;
  introMessage: string;
  birthdayMessage: string;
  surpriseMessage: string;
  photos: string[];
  musicUrl: string;
}

export const birthdayConfig: BirthdayConfig = {
  recipientName: 'Birthday Girl', recipientAge: '', senderName: '', theme: 'pink',
  introGreeting: 'Hiii,',
  introMessage: 'Someone made a little something, just to celebrate you.',
  birthdayMessage: `Happy Birthday!\n\nI hope today reminds you of just how special you are.\n\nMay this new chapter bring you beautiful memories, genuine laughter, unexpected blessings, and all the little things your heart has been wishing for.\n\nYou deserve a year filled with reasons to smile. I hope this little surprise makes your day a little brighter.\n\nHave the most beautiful birthday!`,
  surpriseMessage: 'The world is a little brighter with you in it. Here’s to a year full of lovely little moments.',
  photos: [], musicUrl: '',
};

export function normalizeConfig(value: unknown): BirthdayConfig {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const string = (key: keyof BirthdayConfig, fallback: string, max: number) => typeof input[key] === 'string' ? (input[key] as string).slice(0, max) : fallback;
  const theme = input.theme === 'lavender' || input.theme === 'sunshine' ? input.theme : 'pink';
  const photos = Array.isArray(input.photos) ? input.photos.filter((p): p is string => typeof p === 'string' && /^data:image\/(jpeg|png|webp);base64,/i.test(p) && p.length < 100000).slice(0, 3) : [];
  const rawMusic = string('musicUrl', '', 2000);
  let musicUrl = '';
  try { const url = new URL(rawMusic); if (url.protocol === 'https:' || url.protocol === 'http:') musicUrl = url.href; } catch { /* Empty or invalid URLs are ignored. */ }
  return { recipientName: string('recipientName', birthdayConfig.recipientName, 80), recipientAge: string('recipientAge', '', 3), senderName: string('senderName', '', 80), theme, introGreeting: string('introGreeting', birthdayConfig.introGreeting, 80), introMessage: string('introMessage', birthdayConfig.introMessage, 300), birthdayMessage: string('birthdayMessage', birthdayConfig.birthdayMessage, 4000), surpriseMessage: string('surpriseMessage', birthdayConfig.surpriseMessage, 500), photos, musicUrl };
}

export function encodeConfig(config: BirthdayConfig): string {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = ''; bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeConfig(payload: string): BirthdayConfig {
  if (payload.length > 400000) throw new Error('This surprise link is too large.');
  const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return normalizeConfig(JSON.parse(new TextDecoder().decode(bytes)));
}
