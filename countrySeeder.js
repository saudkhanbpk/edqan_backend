import fs from 'fs';
import mongoose from 'mongoose';
import Country from './api/data-access-layer/models/country.model.js';
import City from './api/data-access-layer/models/city.model.js';

const filePath = './countries+cities.json';

async function readJSONFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    throw error;
  }
}


async function example() {
  try {
    const jsonData = await readJSONFile(filePath);
    for (let i = 0; i < jsonData.length; i++) {
      const country = new Country({
        nameEn: jsonData[i].name,
        nameAr: jsonData[i].name,
        order: i+1,
      });
      await country.save();
      for (let j = 0; j < jsonData[i].cities.length; j++) {
        const city = new City({
          nameEn: jsonData[i].cities[j].name,
          nameAr: jsonData[i].cities[j].name,
          country: country._id,
          order: j+1,
        });
        await city.save();
      }      
    }

  } catch (error) {
    // Handle any errors
  }
}

example();


// make function  to delete all cities where createdAt is today 

// async function deleteCities() {
//   try {
//     const data = await Country.deleteMany({createdAt: {$gte: new Date().setHours(0,0,0,0)}});
//   } catch (error) {
//     console.error('Error while reading or parsing JSON file:', error);
//     throw error;
//   }
// }

// deleteCities();



