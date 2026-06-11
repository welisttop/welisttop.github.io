const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const categories = require(path.join(ROOT, "_data", "categories.json"));
const locations = require(path.join(ROOT, "_data", "locations.json"));

const businessesDir = path.join(
  ROOT,
  "_data",
  "businesses"
);

const businessFiles = fs
  .readdirSync(businessesDir)
  .filter(file => file.endsWith(".json"));

const businesses = businessFiles.map(file =>
  require(path.join(businessesDir, file))
);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
