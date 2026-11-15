# A Little Birthday Surprise 🎀

**A tiny website. A big smile. A little bit of magic.**

A playful, personalized birthday experience made to celebrate someone special. Open a birthday cake, make a wish, read a heartfelt letter, and unwrap one last surprise.

## What's inside

- A five-part interactive birthday experience with a cake, letter, gift, and replayable finale.
- A creator studio for personalizing names, messages, an optional age, photos, and music.
- Three themes: Pink Coquette, Dreamy Lavender, and Sunshine.
- A live preview, browser-local drafts, JSON import and export, and shareable configuration links.
- Responsive layouts, keyboard navigation, and reduced-motion support.

## Getting started

You'll need [Node.js](https://nodejs.org/) and npm installed.

```bash
npm install
npm run dev
```

Open the local address printed in the terminal. To open the creator studio, add `?create` to the address, for example `http://localhost:5173/?create`.

To create a production build:

```bash
npm run build
npm run preview
```

## Create a surprise

1. Open the creator studio and personalize the details, messages, and theme.
2. Try the live preview and add optional photos or a direct audio file URL.
3. Save a draft in your browser or export a JSON backup.
4. Choose **Make a surprise link** and share the generated link once the site is hosted.

A link generated on `localhost` only works on your own device. The app must be hosted at an accessible address before a recipient can open a link on another device.

## How links and drafts work

Surprise links contain the birthday configuration in the URL; anyone with the link can read its contents. Photos are resized and included in the link rather than uploaded to a hosting service. Some apps and browsers may not accept long links, so you may need to remove photos or shorten messages. Drafts are stored only in the current browser and can be lost when browser data is cleared; export a JSON backup if you want a separate copy.

Music requires a publicly accessible direct audio file URL. Playback is optional and controlled by the recipient; links to streaming pages may not work.

## Built with

React, TypeScript, Vite, CSS, and [Lucide](https://lucide.dev/) icons. No account or database is required.
