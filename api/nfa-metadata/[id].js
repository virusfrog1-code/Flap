import { absoluteBaseUrl, metadataFor, parseTokenId } from "../_caiwing.js";

export default function handler(req, res) {
  const tokenId = parseTokenId(req.query.id);
  if (!tokenId) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Invalid token id" }));
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400");
  res.end(JSON.stringify(metadataFor(tokenId, absoluteBaseUrl(req)), null, 2));
}
