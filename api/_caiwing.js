const RARITIES = [
  { name: "Genesis", color: "#f8d66a" },
  { name: "Mythic", color: "#b96cff" },
  { name: "Legend", color: "#ff5edb" },
  { name: "Epic", color: "#43f79f" },
  { name: "Rare", color: "#20e8ff" },
  { name: "Prime", color: "#ffb14a" },
  { name: "Signal", color: "#5d7cff" },
  { name: "Vault", color: "#ffe28a" },
];

const WINGS = ["Cosmic Cyan", "Photon Gold", "Blue Violet", "Aurora Blue", "Plasma Pink", "Ion Azure", "Solar Violet", "Nebula Mint"];
const ORBITS = ["Lunar Relay", "Deep Space", "Mars Arc", "Saturn Ring", "Nebula Gate", "Comet Line", "Signal Belt", "Outer Rim"];
const TIERS = ["VPN Prime", "AI Plus", "Vault Yield", "Market Maker", "Clash Pass", "Agent Core", "Dividend Gate", "Utility Max"];
const STATES = ["Awake", "Evolving", "Vaulted", "Boosted", "Imported", "Cooling", "Orbiting", "Claimable"];

export function parseTokenId(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const match = String(raw || "").match(/\d+/);
  const tokenId = match ? Number(match[0]) : NaN;
  if (!Number.isInteger(tokenId) || tokenId < 1 || tokenId > 666) {
    return null;
  }
  return tokenId;
}

export function absoluteBaseUrl(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "v0-vite-wine.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

function pick(list, tokenId, salt) {
  return list[(tokenId * 37 + salt * 53) % list.length];
}

function rarityFor(tokenId) {
  if (tokenId === 1) return RARITIES[0];
  return RARITIES[(tokenId * 29 + 11) % RARITIES.length];
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

export function overlayFor(tokenId) {
  const rarity = rarityFor(tokenId);
  const color = rarity.color;
  const dashA = 5 + (tokenId % 6);
  const dashB = 8 + (tokenId % 7);
  const curveA = 276 + (tokenId % 18);
  const curveB = 310 - (tokenId % 16);
  const curveC = 292 + (tokenId % 14);
  const curveD = 272 + (tokenId % 22);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="6" y="6" width="308" height="308" rx="10" fill="none" stroke="${color}" stroke-width="2" opacity="0.72"/>
    <rect x="12" y="12" width="58" height="20" rx="10" fill="#05070f" opacity="0.74" stroke="${color}" stroke-width="1"/>
    <text x="23" y="26" font-family="Arial,sans-serif" font-size="10" font-weight="800" fill="#ffffff">#${pad(tokenId)}</text>
    <circle cx="294" cy="26" r="11" fill="#05070f" opacity="0.74" stroke="${color}" stroke-width="1"/>
    <path d="M289 26h10M294 21v10" stroke="${color}" stroke-width="1.6" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M24 294 C80 ${curveA}, 122 ${curveB}, 176 ${curveC} S250 ${curveD}, 296 294"
      fill="none" stroke="${color}" stroke-width="2" opacity="0.6" stroke-linecap="round"
      stroke-dasharray="${dashA} ${dashB}" filter="url(#glow)"/>
  </svg>`);
}

export function metadataFor(tokenId, baseUrl) {
  const rarity = rarityFor(tokenId);
  const image = `${baseUrl}/api/nfa-image/${tokenId}.gif`;
  return {
    name: `财翼 NFA #${pad(tokenId)}`,
    description:
      "财翼 NFA is a Flap-minted dynamic NFT access pass for holder VPN, Clash import, marketplace orders, vault analytics, and AI Agent utilities. This final series keeps the approved CaiWing animated artwork and adds deterministic token-level identity marks so all 666 NFTs are non-repeating.",
    image,
    animation_url: image,
    external_url: baseUrl,
    background_color: "05070E",
    attributes: [
      { trait_type: "Collection", value: "财翼 NFA" },
      { trait_type: "Artwork Base", value: "Approved CaiWing animated GIF" },
      { trait_type: "Max Supply", value: 666 },
      { trait_type: "Mint Cost", value: "66 财翼 test / 666,666 财翼 production" },
      { trait_type: "Buy Tax", value: "1% test / 2% production" },
      { trait_type: "Sell Tax", value: "1% test / 4% production" },
      { trait_type: "Rarity", value: rarity.name },
      { trait_type: "Wing Spectrum", value: pick(WINGS, tokenId, 1) },
      { trait_type: "Signal Strength", value: signalFor(tokenId) },
      { trait_type: "Orbit Class", value: pick(ORBITS, tokenId, 2) },
      { trait_type: "Utility Tier", value: pick(TIERS, tokenId, 3) },
      { trait_type: "Evolution State", value: pick(STATES, tokenId, 4) },
      { trait_type: "DNA", value: dnaFor(tokenId) },
    ],
  };
}
