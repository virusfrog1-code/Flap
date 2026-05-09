import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const assetDir = path.join(root, "public", "assets", "caiwing-nfa-v3");
const metadataDir = path.join(root, "public", "metadata", "caiwing-nfa-v3");

const cdnAssetBase = "https://cdn.jsdelivr.net/gh/virusfrog1-code/Flap@main/public/assets/caiwing-nfa-v3";
const externalUrl = "https://v0-vite-wine.vercel.app/";

const rarities = [
  { name: "Genesis", colorA: "#f6d365", colorB: "#20e8ff" },
  { name: "Mythic", colorA: "#b96cff", colorB: "#42f5ff" },
  { name: "Legend", colorA: "#ff5edb", colorB: "#ffe073" },
  { name: "Epic", colorA: "#597cff", colorB: "#8fffd5" },
  { name: "Rare", colorA: "#2bd7ff", colorB: "#c59cff" },
  { name: "Prime", colorA: "#ffb14a", colorB: "#43f79f" },
  { name: "Signal", colorA: "#66f5ff", colorB: "#2f62ff" },
  { name: "Vault", colorA: "#ffe28a", colorB: "#9c70ff" },
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

function signalFor(tokenId) {
  return (6.0 + ((tokenId * 17) % 41) / 10).toFixed(1);
}

function dnaFor(tokenId) {
  return `CW-${pad(tokenId)}-${((tokenId * 7919 + tokenId * tokenId * 97) % 999999).toString().padStart(6, "0")}`;
}

function esc(value) {
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
  const radius = 214 + ((tokenId * 7) % 44);
  const dashA = 9 + (tokenId % 7);
  const dashB = 22 + (tokenId % 11);
  const curveShift = tokenId % 38;
  const speedA = 10 + (tokenId % 9);
  const speedB = 5 + (tokenId % 5);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720" role="img" aria-label="财翼 NFA #${pad(tokenId)}">
  <defs>
    <clipPath id="clip"><rect width="720" height="720" rx="28" ry="28"/></clipPath>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${rarity.colorA}"/>
      <stop offset="48%" stop-color="${rarity.colorB}"/>
      <stop offset="100%" stop-color="#05070e"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="58%">
      <stop offset="0%" stop-color="${rarity.colorB}" stop-opacity="0.10"/>
      <stop offset="58%" stop-color="${rarity.colorA}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      @keyframes rotateA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes rotateB { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes pulse { 0%,100% { opacity:.38; transform: scale(.985); } 50% { opacity:.82; transform: scale(1.018); } }
      @keyframes sweep { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -260; } }
      .center { transform-origin: 360px 360px; }
      .ringA { animation: rotateA ${speedA}s linear infinite, sweep ${speedB}s linear infinite; }
      .ringB { animation: rotateB ${speedA + 6}s linear infinite; }
      .pulse { animation: pulse ${4 + (tokenId % 4)}s ease-in-out infinite; transform-origin: 360px 360px; }
      .label { font-family: Inter, Arial, sans-serif; letter-spacing: 0; }
    </style>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="720" height="720" fill="#030611"/>
    <image href="./base.jpg" x="0" y="0" width="720" height="720" preserveAspectRatio="xMidYMid slice"/>
    <rect class="pulse" width="720" height="720" fill="url(#halo)"/>
    <path d="M62 ${172 + curveShift} C152 ${88 + curveShift}, 232 ${168 - curveShift}, 316 ${252 + curveShift / 2}" fill="none" stroke="${rarity.colorB}" stroke-width="5" stroke-linecap="round" opacity="0.72" filter="url(#glow)">
      <animate attributeName="stroke-dasharray" values="18 180;80 120;18 180" dur="${5 + (tokenId % 4)}s" repeatCount="indefinite"/>
    </path>
    <path d="M658 ${172 + curveShift} C568 ${88 + curveShift}, 488 ${168 - curveShift}, 404 ${252 + curveShift / 2}" fill="none" stroke="${rarity.colorA}" stroke-width="5" stroke-linecap="round" opacity="0.72" filter="url(#glow)">
      <animate attributeName="stroke-dasharray" values="80 120;18 180;80 120" dur="${5 + (tokenId % 4)}s" repeatCount="indefinite"/>
    </path>
    <circle class="center ringA" cx="360" cy="360" r="${radius}" fill="none" stroke="${rarity.colorB}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${dashA} ${dashB}" opacity="0.76" filter="url(#glow)"/>
    <circle class="center ringB" cx="360" cy="360" r="${radius + 31}" fill="none" stroke="${rarity.colorA}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${dashB} ${dashB * 1.8}" opacity="0.62"/>
    <rect x="7" y="7" width="706" height="706" rx="24" fill="none" stroke="url(#frame)" stroke-width="5"/>
    <rect x="28" y="22" width="96" height="30" rx="15" fill="#070914" fill-opacity="0.82" stroke="${rarity.colorA}" stroke-opacity="0.56"/>
    <text class="label" x="45" y="43" fill="#ffffff" font-size="16" font-weight="900">#${pad(tokenId)}</text>
    <rect x="546" y="22" width="142" height="30" rx="15" fill="#070914" fill-opacity="0.82" stroke="${rarity.colorB}" stroke-opacity="0.66"/>
    <text class="label" x="564" y="43" fill="${rarity.colorB}" font-size="13" font-weight="900">${esc(rarity.name)}</text>
    <rect x="36" y="620" width="648" height="66" rx="18" fill="#030611" fill-opacity="0.78" stroke="${rarity.colorA}" stroke-opacity="0.35"/>
    <text class="label" x="56" y="648" fill="#ffffff" font-size="18" font-weight="900">财翼 NFA</text>
    <text class="label" x="56" y="671" fill="${rarity.colorB}" font-size="13" font-weight="800">${esc(wing)} / ${esc(orbit)} / Signal ${signal}</text>
    <text class="label" x="506" y="648" fill="${rarity.colorA}" font-size="12" font-weight="900">${esc(tier)}</text>
    <text class="label" x="506" y="671" fill="#cbd6f7" font-size="11">${esc(state)} · ${esc(dna)}</text>
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
      "财翼 NFA is a Flap-minted dynamic NFT access pass for holder VPN, Clash import, marketplace orders, vault analytics, and AI Agent utilities. This v3 artwork keeps the original clear CaiWing visual and adds deterministic animated traits for each token.",
    image,
    animation_url: image,
    external_url: externalUrl,
    background_color: "05070E",
    attributes: [
      { trait_type: "Collection", value: "财翼 NFA" },
      { trait_type: "Max Supply", value: 666 },
      { trait_type: "Mint Cost", value: "66 财翼 test / 666,666 财翼 production" },
      { trait_type: "Buy Tax", value: "1% test / 2% production" },
      { trait_type: "Sell Tax", value: "1% test / 4% production" },
      { trait_type: "Rarity", value: rarity.name },
      { trait_type: "Wing Spectrum", value: wing },
      { trait_type: "Signal Strength", value: signal },
      { trait_type: "Orbit Class", value: orbit },
      { trait_type: "Utility Tier", value: tier },
      { trait_type: "Evolution State", value: state },
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
      imageMode: "per-token animated SVG with shared clear base.jpg",
      baseImage: `${cdnAssetBase}/base.jpg`,
      note: "Use this v3 directory for the next Flap external JSON metadata test. v2 is deprecated because embedded GIF-in-SVG can render blurry in Flap.",
    },
    null,
    2,
  ),
);

console.log(`Generated ${assetDir}`);
console.log(`Generated ${metadataDir}`);
