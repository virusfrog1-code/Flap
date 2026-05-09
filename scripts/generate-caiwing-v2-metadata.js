import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const assetDir = path.join(root, "public", "assets", "caiwing-nfa-v2");
const metadataDir = path.join(root, "public", "metadata", "caiwing-nfa-v2");

const baseGifUrl = "https://cdn.jsdelivr.net/gh/virusfrog1-code/Flap@a558b6a/public/assets/logo1.gif";
const cdnAssetBase = "https://cdn.jsdelivr.net/gh/virusfrog1-code/Flap@main/public/assets/caiwing-nfa-v2";
const externalUrl = "https://v0-vite-wine.vercel.app/";

const rarities = [
  { name: "Genesis", colorA: "#f8d66a", colorB: "#5df7ff", weight: 1 },
  { name: "Mythic", colorA: "#b85cff", colorB: "#23e7ff", weight: 2 },
  { name: "Legend", colorA: "#ff7ad9", colorB: "#f8d66a", weight: 3 },
  { name: "Epic", colorA: "#5d7cff", colorB: "#8fffcb", weight: 4 },
  { name: "Rare", colorA: "#28d7ff", colorB: "#b18cff", weight: 5 },
  { name: "Prime", colorA: "#ffb347", colorB: "#36f5a2", weight: 6 },
  { name: "Signal", colorA: "#66f2ff", colorB: "#315dff", weight: 7 },
  { name: "Vault", colorA: "#ffe38c", colorB: "#9b6cff", weight: 8 },
];

const wings = ["Cosmic Cyan", "Photon Gold", "Blue Violet", "Aurora Blue", "Plasma Pink", "Ion Azure", "Solar Violet", "Nebula Mint"];
const orbits = ["Lunar Relay", "Deep Space", "Mars Arc", "Saturn Ring", "Nebula Gate", "Comet Line", "Signal Belt", "Outer Rim"];
const tiers = ["VPN Prime", "AI Plus", "Vault Yield", "Market Maker", "Clash Pass", "Agent Core", "Dividend Gate", "Utility Max"];
const states = ["Awake", "Evolving", "Vaulted", "Boosted", "Imported", "Cooling", "Orbiting", "Claimable"];

function pick(list, tokenId, salt) {
  return list[(tokenId * 37 + salt * 53) % list.length];
}

function rarityFor(tokenId) {
  if (tokenId === 1) return rarities[0];
  return rarities[(tokenId * 29 + 11) % rarities.length];
}

function pad(tokenId) {
  return String(tokenId).padStart(3, "0");
}

function dnaFor(tokenId) {
  return `CW-${pad(tokenId)}-${((tokenId * 7919 + tokenId * tokenId * 97) % 999999).toString().padStart(6, "0")}`;
}

function signalFor(tokenId) {
  return (6.0 + ((tokenId * 17) % 41) / 10).toFixed(1);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svgFor(tokenId) {
  const rarity = rarityFor(tokenId);
  const wing = pick(wings, tokenId, 1);
  const orbit = pick(orbits, tokenId, 2);
  const tier = pick(tiers, tokenId, 3);
  const state = pick(states, tokenId, 4);
  const signal = signalFor(tokenId);
  const dna = dnaFor(tokenId);
  const hue = (tokenId * 47) % 360;
  const ring = 330 + ((tokenId * 19) % 110);
  const dash = 8 + (tokenId % 9);
  const offset = (tokenId * 13) % 100;
  const accentA = rarity.colorA;
  const accentB = rarity.colorB;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="财翼 NFA #${pad(tokenId)}">
  <defs>
    <clipPath id="rounded">
      <rect width="1024" height="1024" rx="64" ry="64"/>
    </clipPath>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accentA}"/>
      <stop offset="52%" stop-color="${accentB}"/>
      <stop offset="100%" stop-color="#070914"/>
    </linearGradient>
    <radialGradient id="pulse" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${accentA}" stop-opacity="0.22"/>
      <stop offset="52%" stop-color="${accentB}" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      @keyframes rotateRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes breathe { 0%, 100% { opacity: .46; transform: scale(.985); } 50% { opacity: .92; transform: scale(1.018); } }
      @keyframes scan { 0% { stroke-dashoffset: ${offset}; } 100% { stroke-dashoffset: ${offset - 260}; } }
      .base { filter: saturate(1.16) hue-rotate(${hue}deg); }
      .ring { transform-origin: 512px 512px; animation: rotateRing ${18 + (tokenId % 11)}s linear infinite; }
      .breath { transform-origin: 512px 512px; animation: breathe ${4 + (tokenId % 5)}s ease-in-out infinite; }
      .scan { animation: scan ${5 + (tokenId % 4)}s linear infinite; }
      .label { font-family: Inter, Arial, sans-serif; letter-spacing: 0; }
    </style>
  </defs>
  <g clip-path="url(#rounded)">
    <rect width="1024" height="1024" fill="#040711"/>
    <image class="base" href="${baseGifUrl}" x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid slice"/>
    <rect width="1024" height="1024" fill="url(#pulse)" class="breath"/>
    <circle class="ring scan" cx="512" cy="512" r="${ring}" fill="none" stroke="${accentB}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${dash} ${dash * 3}" opacity="0.78" filter="url(#glow)"/>
    <circle class="ring" cx="512" cy="512" r="${ring + 38}" fill="none" stroke="${accentA}" stroke-width="3" stroke-dasharray="${dash * 2} ${dash * 5}" opacity="0.5"/>
    <path d="M92 214 C236 ${120 + (tokenId % 80)}, 302 ${280 + (tokenId % 90)}, 454 356" fill="none" stroke="${accentB}" stroke-width="${7 + (tokenId % 4)}" stroke-linecap="round" opacity="0.58" filter="url(#glow)"/>
    <path d="M932 214 C788 ${120 + ((tokenId * 3) % 80)}, 722 ${280 + ((tokenId * 5) % 90)}, 570 356" fill="none" stroke="${accentA}" stroke-width="${7 + ((tokenId + 2) % 4)}" stroke-linecap="round" opacity="0.58" filter="url(#glow)"/>
    <rect x="20" y="20" width="984" height="984" rx="54" fill="none" stroke="url(#frame)" stroke-width="10" opacity="0.86"/>
    <rect x="54" y="52" width="196" height="62" rx="31" fill="#050816" fill-opacity="0.74" stroke="${accentA}" stroke-opacity="0.72"/>
    <text class="label" x="80" y="92" fill="#ffffff" font-size="30" font-weight="800">#${pad(tokenId)}</text>
    <rect x="746" y="52" width="224" height="62" rx="31" fill="#050816" fill-opacity="0.74" stroke="${accentB}" stroke-opacity="0.72"/>
    <text class="label" x="774" y="92" fill="${accentB}" font-size="24" font-weight="800">${escapeXml(rarity.name)}</text>
    <rect x="64" y="870" width="896" height="98" rx="30" fill="#030611" fill-opacity="0.72" stroke="${accentA}" stroke-opacity="0.45"/>
    <text class="label" x="94" y="914" fill="#ffffff" font-size="30" font-weight="900">财翼 NFA</text>
    <text class="label" x="94" y="946" fill="${accentB}" font-size="22" font-weight="700">${escapeXml(wing)} / ${escapeXml(orbit)} / Signal ${signal}</text>
    <text class="label" x="710" y="914" fill="${accentA}" font-size="20" font-weight="800">${escapeXml(tier)}</text>
    <text class="label" x="710" y="946" fill="#b9c6e8" font-size="18">${escapeXml(state)} · ${escapeXml(dna)}</text>
  </g>
</svg>
`;
}

function metadataFor(tokenId) {
  const rarity = rarityFor(tokenId);
  const wing = pick(wings, tokenId, 1);
  const orbit = pick(orbits, tokenId, 2);
  const tier = pick(tiers, tokenId, 3);
  const state = pick(states, tokenId, 4);
  const signal = signalFor(tokenId);
  const dna = dnaFor(tokenId);
  const image = `${cdnAssetBase}/${tokenId}.svg`;

  return {
    name: `财翼 NFA #${pad(tokenId)}`,
    description:
      "财翼 NFA is a Flap-minted dynamic NFT access pass for holder VPN, Clash import, marketplace orders, vault analytics, and AI Agent tools. Each token uses a deterministic visual seed so all 666 NFTs have distinct animated artwork.",
    image,
    animation_url: image,
    external_url: externalUrl,
    background_color: "05070E",
    attributes: [
      { trait_type: "Collection", value: "财翼 NFA" },
      { trait_type: "Max Supply", value: 666 },
      { trait_type: "Mint Cost", value: "666 财翼 test / 666,666 财翼 production" },
      { trait_type: "Buy Tax", value: "1% test / 2% production" },
      { trait_type: "Sell Tax", value: "1% test / 4% production" },
      { trait_type: "Rarity", value: rarity.name },
      { trait_type: "Wing Spectrum", value: wing },
      { trait_type: "Signal Strength", value: signal },
      { trait_type: "Orbit Class", value: orbit },
      { trait_type: "Utility Tier", value: tier },
      { trait_type: "Evolution State", value: state },
      { trait_type: "Visual Seed", value: (tokenId * 47) % 360 },
      { trait_type: "DNA", value: dna },
    ],
  };
}

fs.mkdirSync(assetDir, { recursive: true });
fs.mkdirSync(metadataDir, { recursive: true });

for (let tokenId = 1; tokenId <= 666; tokenId += 1) {
  fs.writeFileSync(path.join(assetDir, `${tokenId}.svg`), svgFor(tokenId));
  fs.writeFileSync(path.join(metadataDir, `${tokenId}.json`), JSON.stringify(metadataFor(tokenId), null, 2));
}

fs.writeFileSync(
  path.join(metadataDir, "README.json"),
  JSON.stringify(
    {
      collection: "财翼 NFA",
      maxSupply: 666,
      imageMode: "per-token animated SVG wrapper",
      baseGif: baseGifUrl,
      note: "Use the numbered metadata directory in Flap external JSON metadata mode. Do not use shared.json for production.",
    },
    null,
    2,
  ),
);

console.log(`Generated ${assetDir}`);
console.log(`Generated ${metadataDir}`);
