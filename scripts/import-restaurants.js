/**
 * Script to import restaurants from JSON file to mockData.ts
 * 
 * Usage:
 * 1. Create or edit data/restaurants-data.json with your restaurant data
 * 2. Run: node scripts/import-restaurants.js
 */

const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, '../data/restaurants-data.json');
const OUTPUT_FILE = path.join(__dirname, '../lib/mockData.ts');

// Read JSON file
let restaurantsData = [];
if (fs.existsSync(JSON_FILE)) {
  const jsonContent = fs.readFileSync(JSON_FILE, 'utf8');
  restaurantsData = JSON.parse(jsonContent);
} else {
  console.log(`⚠️  ${JSON_FILE} not found. Creating template...`);
  // Create template file
  const template = [
    {
      name: "Example Restaurant",
      description: "A great restaurant",
      address: "123 Main St, Toronto, ON M1A 1A1",
      latitude: 43.6532,
      longitude: -79.3832,
      tags: ["Italian", "Pizza"],
      priceRange: 2,
      averageRating: 4.5,
      reviewCount: 100,
      isOpen: true
    }
  ];
  fs.writeFileSync(JSON_FILE, JSON.stringify(template, null, 2));
  console.log(`✅ Template created at ${JSON_FILE}`);
  console.log('Please edit the JSON file and run the script again.');
  process.exit(0);
}

// Generate TypeScript code
const generateRestaurantCode = (restaurant, index) => {
  const id = restaurant.id || String(index + 1);
  return `  {
    id: '${id}',
    name: '${restaurant.name.replace(/'/g, "\\'")}',
    description: '${(restaurant.description || '').replace(/'/g, "\\'")}',
    location: {
      address: '${restaurant.address.replace(/'/g, "\\'")}',
      latitude: ${restaurant.latitude},
      longitude: ${restaurant.longitude},
    },
    tags: [${restaurant.tags.map(tag => `'${tag.replace(/'/g, "\\'")}'`).join(', ')}],
    priceRange: ${restaurant.priceRange},
    averageRating: ${restaurant.averageRating},
    reviewCount: ${restaurant.reviewCount},
    images: [],
    isOpen: ${restaurant.isOpen !== undefined ? restaurant.isOpen : true},
  }`;
};

const restaurantCode = restaurantsData.map((r, i) => generateRestaurantCode(r, i)).join(',\n');

// Read existing mockData.ts to preserve reviews
const existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
const reviewsMatch = existingContent.match(/export const mockReviews: Review\[\] = \[[\s\S]*?\]/);
const reviewsCode = reviewsMatch ? reviewsMatch[0] : 'export const mockReviews: Review[] = []';

// Generate new content
const newContent = `// Restaurant data imported from JSON
import type { Restaurant, Review } from '@/types'

export const mockRestaurants: Restaurant[] = [
${restaurantCode}
]

${reviewsCode}
`;

fs.writeFileSync(OUTPUT_FILE, newContent, 'utf8');
console.log(`✅ Successfully imported ${restaurantsData.length} restaurants to ${OUTPUT_FILE}`);

