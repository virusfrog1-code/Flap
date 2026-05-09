import path from "node:path";
import sharp from "sharp";
import { overlayFor, parseTokenId } from "../_caiwing.js";

const SOURCE_GIF = path.join(process.cwd(), "public", "assets", "caiwing-flap-cover-dynamic-noborder-320-lite.gif");

export default async function handler(req, res) {
  const tokenId = parseTokenId(req.query.id);
  if (!tokenId) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Invalid token id" }));
    return;
  }

  try {
    const gif = await sharp(SOURCE_GIF, { animated: true, limitInputPixels: false })
      .composite([{ input: overlayFor(tokenId), tile: true, gravity: "northwest" }])
      .gif({ colours: 96, effort: 10, dither: 0, loop: 0 })
      .toBuffer();

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.end(gif);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Failed to render NFT image" }));
  }
}
