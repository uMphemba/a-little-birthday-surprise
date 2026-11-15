import { useState, type ChangeEvent } from 'react';
import { Copy, Download, Eye, ImagePlus, RotateCcw, Save, X } from 'lucide-react';
import { birthdayConfig, encodeConfig, normalizeConfig, type BirthdayConfig, type BirthdayTheme } from './config';
import { BirthdayExperience } from './experience';
import { SparkleMark } from './SparkleMark';

const STORAGE_KEY = 'little-birthday-surprise-draft';
const MAX_LINK_LENGTH = 16000;
const themes: { id: BirthdayTheme; name: string; description: string }[] = [
  { id: 'pink', name: 'Pink coquette', description: 'Soft, sweet & lovely' },
  { id: 'lavender', name: 'Dreamy lavender', description: 'A little starlit magic' },
  { id: 'sunshine', name: 'Sunshine', description: 'Warm & joyful' },
];
function loadDraft(): BirthdayConfig {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? normalizeConfig(JSON.parse(saved)) : { ...birthdayConfig }; } catch { return { ...birthdayConfig }; }
}
function makeLink(config: BirthdayConfig) {
  const url = new URL(window.location.href); url.search = ''; url.hash = ''; url.searchParams.set('surprise', encodeConfig(normalizeConfig(config))); return url.href;
}
function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { reject(new Error('Please choose a JPG, PNG, or WebP image.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this photo.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not open this photo.'));
      image.onload = () => {
        const scale = Math.min(1, 320 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d'); if (!context) { reject(new Error('Could not process this photo.')); return; }
        context.fillStyle = '#fffaf3'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.55));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
export function BirthdayCreator() {
  const [config, setConfig] = useState<BirthdayConfig>(loadDraft);
  const [message, setMessage] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [link, setLink] = useState('');
  const update = <K extends keyof BirthdayConfig>(key: K, value: BirthdayConfig[K]) => { setConfig(current => ({ ...current, [key]: value })); setLink(''); setMessage(''); };
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); setMessage('Your draft is saved in this browser.'); } catch { setMessage('Your browser could not save this draft. Try removing a photo or exporting it.'); } };
  const reset = () => { setConfig({ ...birthdayConfig }); setLink(''); setPreviewKey(n => n + 1); try { localStorage.removeItem(STORAGE_KEY); } catch { /* The form still resets. */ } setMessage('Defaults restored.'); };
  const exportConfig = () => { const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'birthday-surprise.json'; a.click(); URL.revokeObjectURL(url); setMessage('Configuration exported to your device.'); };
  const createLink = () => { const url = makeLink(config); if (url.length > MAX_LINK_LENGTH) { setLink(''); setMessage('This link is too long to share reliably. Remove a photo or shorten your message, then try again.'); return; } setLink(url); setMessage('Your link is ready. Anyone with it can read the content.'); };
  const copy = async () => { try { await navigator.clipboard.writeText(link); setMessage('Link copied!'); } catch { setMessage('Select the link below and copy it manually.'); } };
  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []); event.target.value = '';
    if (files.length + config.photos.length > 3) { setMessage('You can add up to three photos.'); return; }
    try { const photos = await Promise.all(files.map(resizePhoto)); setConfig(current => ({ ...current, photos: [...current.photos, ...photos].slice(0, 3) })); setLink(''); setMessage('Photos added and resized for your link.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add the photos.'); }
  };
  const importConfig = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { if (file.size > 400000) throw new Error(); setConfig(normalizeConfig(JSON.parse(await file.text()))); setLink(''); setPreviewKey(n => n + 1); setMessage('Configuration imported.'); } catch { setMessage('That file could not be imported. Choose a birthday configuration JSON file.'); } };
  return <div className="creator"><header className="creator-header"><a href={window.location.pathname} className="brand"><SparkleMark className="brand-mark"/><span>a little birthday<br/><strong>surprise</strong></span></a><span className="creator-badge">THE CREATOR STUDIO &nbsp; ♡</span></header>
    <main className="creator-main"><div className="creator-intro"><div className="eyebrow">✦ &nbsp; MADE WITH SOMEONE IN MIND &nbsp; ✦</div><h1>Make their day <em>extra lovely.</em></h1><p>Gather your words, add a little magic, and make a surprise that feels like them.</p></div>
    <div className="creator-layout"><div className="editor"><section className="editor-card"><div className="section-heading"><span>01</span><div><h2>The little details</h2><p>Let’s make this feel personal.</p></div></div><div className="field-grid"><label>Recipient’s name<input maxLength={80} value={config.recipientName} onChange={e => update('recipientName', e.target.value)} placeholder="Birthday Girl" /></label><label>Age <small>optional</small><input type="number" min="1" max="999" value={config.recipientAge} onChange={e => update('recipientAge', e.target.value.slice(0,3))} placeholder="e.g. 25" /></label><label>From <small>optional</small><input maxLength={80} value={config.senderName} onChange={e => update('senderName', e.target.value)} placeholder="Your name" /></label><label>Intro greeting<input maxLength={80} value={config.introGreeting} onChange={e => update('introGreeting', e.target.value)} placeholder="Hiii," /></label></div><label>Intro message<textarea maxLength={300} rows={2} value={config.introMessage} onChange={e => update('introMessage', e.target.value)} /></label></section>
    <section className="editor-card"><div className="section-heading"><span>02</span><div><h2>Choose a mood</h2><p>Pick the palette that feels just right.</p></div></div><div className="theme-options">{themes.map(theme => <button type="button" key={theme.id} className={`theme-option swatch-${theme.id} ${config.theme === theme.id ? 'selected' : ''}`} onClick={() => update('theme', theme.id)} aria-pressed={config.theme === theme.id}><span className="swatch"><i/><i/><i/></span><strong>{theme.name}</strong><small>{theme.description}</small></button>)}</div></section>
    <section className="editor-card"><div className="section-heading"><span>03</span><div><h2>Words to keep</h2><p>The thoughtful part, straight from you.</p></div></div><label>Birthday letter<textarea maxLength={4000} rows={9} value={config.birthdayMessage} onChange={e => update('birthdayMessage', e.target.value)} /></label><label>Gift reveal message<textarea maxLength={500} rows={3} value={config.surpriseMessage} onChange={e => update('surpriseMessage', e.target.value)} /></label></section>
    <section className="editor-card"><div className="section-heading"><span>04</span><div><h2>Finishing touches</h2><p>Optional little extras for your surprise.</p></div></div><label>Photos <small>up to 3</small></label><div className="photo-editor">{config.photos.map((photo, i) => <div className="photo-thumb" key={i}><img src={photo} alt={`Selected photo ${i + 1}`}/><button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => update('photos', config.photos.filter((_, index) => i !== index))}><X size={14}/></button></div>)}{config.photos.length < 3 && <label className="upload-tile"><ImagePlus size={20}/><span>Add photos</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos}/></label>}</div><p className="field-help">Photos are resized and included in the link, not hosted. Large links may not work in every app; remove photos if the link is too long.</p><label>Music URL <small>optional</small><input type="url" maxLength={2000} value={config.musicUrl} onChange={e => update('musicUrl', e.target.value)} placeholder="https://example.com/song.mp3" /></label><p className="field-help">Use a publicly accessible direct audio file URL. The recipient chooses whether to play it; streaming page links may not work.</p></section>
    <section className="editor-card actions-card"><div className="section-heading"><span>05</span><div><h2>Ready to share?</h2><p>Save your work, or make a link for someone special.</p></div></div><div className="creator-actions"><button className="button" onClick={createLink}>Make a surprise link <span>♡</span></button><button className="action-button" onClick={save}><Save size={16}/> Save draft</button><button className="action-button" onClick={exportConfig}><Download size={16}/> Export</button><label className="action-button import-button">Import<input type="file" accept="application/json,.json" onChange={importConfig}/></label><button className="action-button" onClick={reset}><RotateCcw size={16}/> Reset</button></div>{message && <p className="status-message" role="status">{message}</p>}{link && <div className="link-box"><label htmlFor="share-link">Your surprise link</label><div><input id="share-link" readOnly value={link} onFocus={e => e.currentTarget.select()}/><button onClick={copy} aria-label="Copy surprise link"><Copy size={17}/></button></div><p>Share this link after the site is hosted. A localhost link only works on this device.</p></div>}<p className="field-help">Drafts stay in this browser and can be lost if browser data is cleared. Export a backup to keep a copy.</p></section></div>
    <aside className="preview-column"><div className="preview-heading"><div><div className="eyebrow">A PEEK AT THE MAGIC</div><h2>Live preview <span>✧</span></h2><p>Try the surprise as you create it.</p></div><button className="preview-reset" onClick={() => setPreviewKey(n => n + 1)}><Eye size={15}/> Restart</button></div><div className="preview-shell"><div className="preview-browser"><span/><span/><span/><div>YOUR LITTLE SURPRISE</div></div><div className="preview-content"><BirthdayExperience key={previewKey} config={config}/></div></div><p className="preview-caption">✦ &nbsp; YOUR WORDS, THEIR LITTLE MOMENT &nbsp; ✦</p></aside></div></main></div>;
}

