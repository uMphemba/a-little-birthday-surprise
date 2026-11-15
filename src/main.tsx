import React from 'react';
import { createRoot } from 'react-dom/client';
import { birthdayConfig, decodeConfig } from './config';
import { BirthdayCreator } from './creator';
import { BirthdayExperience } from './experience';
import './style.css';
const params = new URLSearchParams(window.location.search);
let recipientConfig = birthdayConfig;
let invalidLink = false;
if (params.has('surprise')) { try { recipientConfig = decodeConfig(params.get('surprise') || ''); } catch { invalidLink = true; } }
createRoot(document.getElementById('root')!).render(<React.StrictMode>{params.has('create') && !params.has('surprise') ? <BirthdayCreator /> : invalidLink ? <div className="link-error"><h1>Oops, this surprise link couldn’t be opened.</h1><p>Ask the sender for a fresh link.</p></div> : <BirthdayExperience config={recipientConfig}/>}</React.StrictMode>);




