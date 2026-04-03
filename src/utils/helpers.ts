import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterLetters(str: string, lettersToRemove: string[] = []) {
  lettersToRemove.forEach((letter) => {
    str = str.replaceAll(letter, "");
  });
  return str;
}

export const getFlags = (flag: number): string[] => {
  const flags: string[] = [];

  // In the order they appear on profiles
  if (flag & 1) flags.push("Discord_Employee"); // 1 << 0
  if (flag & 262144) flags.push("Discord_Certified_Moderator"); // 1 << 18
  if (flag & 2) flags.push("Partnered_Server_Owner"); // 1 << 1
  if (flag & 4) flags.push("HypeSquad_Events"); // 1 << 2
  if (flag & 64) flags.push("House_Bravery"); // 1 << 6
  if (flag & 128) flags.push("House_Brilliance"); // 1 << 7
  if (flag & 256) flags.push("House_Balance"); // 1 << 8
  if (flag & 8) flags.push("Bug_Hunter_Level_1"); // 1 << 3
  if (flag & 16384) flags.push("Bug_Hunter_Level_2"); // 1 << 14
  if (flag & 4194304) flags.push("Active_Developer"); // 1 << 22
  if (flag & 131072) flags.push("Early_Verified_Bot_Developer"); // 1 << 17
  if (flag & 512) flags.push("Early_Supporter"); // 1 << 9

  return flags;
};

export const elapsedTime = (timestamp: number): string => {
  const startTime = timestamp;
  const endTime = Number(new Date());
  let difference = (endTime - startTime) / 1000;

  // we only calculate them, but we don't display them.
  // this fixes a bug in the Discord API that does not send the correct timestamp to presence.
  const daysDifference = Math.floor(difference / 60 / 60 / 24);
  difference -= daysDifference * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 60 / 60);
  difference -= hoursDifference * 60 * 60;

  const minutesDifference = Math.floor(difference / 60);
  difference -= minutesDifference * 60;

  const secondsDifference = Math.floor(difference);

  return `${
    hoursDifference >= 1 ? ("0" + hoursDifference).slice(-2) + ":" : ""
  }${("0" + minutesDifference).slice(-2)}:${("0" + secondsDifference).slice(
    -2
  )}`;
};

export const ImageSize = {
  USER_AVATAR: 96,
  USER_DECORATION: 64,
  SERVER_TAG: 32,
  BADGE: 24,
  EMOJI: 32,
  ACTIVITY_LARGE: 128,
  ACTIVITY_SMALL: 32,
};

// Color manipulation functions
export function hexToHsl(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function adjustTextColor(textColor: string, theme: string, adjustment: number): string {
  const [h, s, l] = hexToHsl(textColor);
  let newL = l;
  
  if (theme === 'light') {
    // Darken for light theme
    newL = Math.max(0, l - adjustment);
  } else {
    // Lighten for dark theme
    newL = Math.min(100, l + adjustment);
  }
  
  return hslToHex(h, s, newL);
}
