const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const hotels = [];

fs.createReadStream("data/hotels.csv")
  .pipe(csv())
  .on("data", row => hotels.push(row))
  .on("end", () => {

    // Clear existing b directory
    const bDir = path.join(__dirname, "..", "b");
    if (fs.existsSync(bDir)) {
      fs.rmSync(bDir, { recursive: true, force: true });
    }
    fs.mkdirSync(bDir, { recursive: true });

    hotels.forEach(hotel => {
      // Create subdirectory for each hotel
      const hotelDir = path.join(bDir, hotel.slug);
      fs.mkdirSync(hotelDir, { recursive: true });

      // Generate index.md with proper front matter
      const content = `---
layout: hotel
title: ${hotel.name}
hotel_name: ${hotel.name}
hotel_type_id: ${hotel.type_id}
address: ${hotel.address}
phone: ${hotel.phone}
lat: ${hotel.lat}
lng: ${hotel.lng}
location_id: ${hotel.location_id}
sublocation_id: ${hotel.sublocation_id || ''}
priority: ${hotel.priority || 0}
---

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">{{ page.hotel_name }}</h1>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 class="font-semibold text-lg mb-2">Location</h2>
          <p class="text-gray-600">{{ page.address }}</p>
        </div>
        
        <div>
          <h2 class="font-semibold text-lg mb-2">Contact</h2>
          <p class="text-gray-600">
            <a href="tel:{{ page.phone }}" class="text-blue-600 hover:underline">
              {{ page.phone }}
            </a>
          </p>
        </div>
      </div>
      
      <div class="border-t pt-6">
        <button onclick="window.location.href='https://maps.google.com/?q={{ page.lat }},{{ page.lng }}'" 
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          View on Google Maps
        </button>
      </div>
    </div>
  </div>
</div>
`;

      fs.writeFileSync(path.join(hotelDir, "index.md"), content);
    });

    console.log(`Generated ${hotels.length} hotel pages in /b/ directory`);
  });
