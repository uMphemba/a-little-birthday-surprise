export interface BirthdayConfig {
  recipientName: string;
  senderName?: string;
  introMessage: string;
  birthdayMessage: string;
  surpriseMessage: string;
}

// Personalize the experience here until the creator is introduced in Phase 2.
export const birthdayConfig: BirthdayConfig = {
  recipientName: 'Birthday Girl',
  introMessage: 'Someone made a little something, just to celebrate you.',
  birthdayMessage: `Happy Birthday!\n\nI hope today reminds you of just how special you are.\n\nMay this new chapter bring you beautiful memories, genuine laughter, unexpected blessings, and all the little things your heart has been wishing for.\n\nYou deserve a year filled with reasons to smile. I hope this little surprise makes your day a little brighter.\n\nHave the most beautiful birthday!`,
  surpriseMessage: 'The world is a little brighter with you in it. Here’s to a year full of lovely little moments.',
};
