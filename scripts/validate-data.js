const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "_data");

const categories = require(path.join(DATA_DIR, "categories.json"));
const locations = require(path.join(DATA_DIR, "locations.json"));
const subtypes = require(path.join(DATA_DIR, "subtypes.json"));

const businessesDir = path.join(DATA_DIR, "businesses");

const categoryIds = new Set(categories.map(c => c.id));
const locationIds = new Set(locations.map(l => l.id));

const businessFiles = fs
  .readdirSync(businessesDir)
  .filter(file => file.endsWith(".json"));

const slugs = new Set();

let errors = [];

for (const file of businessFiles) {

  const business = require(path.join(businessesDir, file));

  const requiredFields = [
    "id",
    "slug",
    "name",
    "category",
    "location",
    "contact"
  ];

  for (const field of requiredFields) {

    if (!business[field]) {
      errors.push(
        `${file}: missing required field '${field}'`
      );
    }

  }

  if (business.slug) {

    if (slugs.has(business.slug)) {

      errors.push(
        `${file}: duplicate slug '${business.slug}'`
      );

    }

    slugs.add(business.slug);

  }

  if (
    business.category &&
    !categoryIds.has(business.category)
  ) {

    errors.push(
      `${file}: invalid category '${business.category}'`
    );

  }

  if (business.location) {

    const locationFields = [
      "country",
      "state",
      "city",
      "area"
    ];

    for (const locField of locationFields) {

      const value = business.location[locField];

      if (!value) {

        errors.push(
          `${file}: missing location.${locField}`
        );

        continue;

      }

      if (!locationIds.has(value)) {

        errors.push(
          `${file}: invalid location '${value}'`
        );

      }

    }

  }

  if (
    business.subtypes &&
    Array.isArray(business.subtypes)
  ) {

    const allowedSubtypes =
      subtypes[business.category] || [];

    const allowedIds = new Set(
      allowedSubtypes.map(s => s.id)
    );

    for (const subtype of business.subtypes) {

      if (!allowedIds.has(subtype)) {

        errors.push(
          `${file}: invalid subtype '${subtype}'`
        );

      }

    }

  }

}
