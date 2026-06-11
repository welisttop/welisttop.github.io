const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const hotels = [];

fs.createReadStream("data/hotels.csv")
  .pipe(csv())
  .on("data", row => hotels.push(row))
  .on("end", () => {

    hotels.forEach(hotel => {

      const dir = path.join("b", hotel.slug);

      fs.mkdirSync(dir, {
        recursive: true
      });

      const html = `
---
layout: hotel
title: ${hotel.name}
hotel_name: ${hotel.name}
hotel_type: ${hotel.type_id}
address: ${hotel.address}
phone: ${hotel.phone}
lat: ${hotel.lat}
lng: ${hotel.lng}
---
`;

      fs.writeFileSync(
        path.join(dir, "index.md"),
        html
      );

    });

    console.log(
      `Generated ${hotels.length} hotel pages`
    );

  });
