const mongoose = require("mongoose");

// Define the schema for items
const ItemSchema = new mongoose.Schema({
    name: String,
    id: Number,
    image: String,
    price: Number,
    description: String
});

// Create a model from the schema
const ItemModel = mongoose.model('Item', ItemSchema);

// Array of item data
const itemsData = [
    {
        name: 'Cash',
        image: '/public/pictures/Cash.png',
        price: 10,
        description: '10 coins',
        id: 1
    },
    {
        name: 'Cash2',
        image: '/public/pictures/Cash2.png',
        price: 50,
        description: '50 coins',
        id:2
    },
    {
        name: 'Catching Net',
        image: '/public/pictures/CatchingNet.png',
        price: 100,
        description: '100 coins',
        id:3
    },
    {
        name: 'Cat Head',
        image: '/public/pictures/CatHead.png',
        price: 250,
        description: '250 coins',
        id: 4
    },
    {
        name: 'CD',
        image: '/public/pictures/CD.png',
        price: 500,
        description: '500 coins',
        id: 5
    },
    {
        name: 'Chest Treasure',
        image: '/public/pictures/ChestTreasure.png',
        price: 600,
        description: '600 coins',
        id: 6
    },
    {
        name: 'Chili',
        image: '/public/pictures/Chili.png',
        price: 700,
        description: '700 coins',
        id: 7
    },
    {
        name: 'Coin',
        image: '/public/pictures/Coin.png',
        price: 800,
        description: '800 coins',
        id: 8
    },
    {
        name: 'Coin2',
        image: '/public/pictures/Coin2.png',
        price: 900,
        description: '900 coins',
        id: 9
    },
    {
        name: 'Gamepad',
        image: '/public/pictures/Gamepad.png',
        price: 1000,
        description: '1,000 coins',
        id: 10
    },
    {
        name: 'Gamepad2',
        image: '/public/pictures/Gamepad2.png',
        price: 5000,
        description: '5,000 coins',
        id: 11
    },
    {
        name: 'Key',
        image: '/public/pictures/Key.png',
        price: 10000,
        description: '10,000 coins',
        id: 12
    },
    {
        name: 'Luggage',
        image: '/public/pictures/Luggage.png',
        price: 20000,
        description: '20,000 coins',
        id: 13
    },
    {
        name: 'Necklace',
        image: '/public/pictures/Necklace.png',
        price: 50000,
        description: '50,000 coins',
        id: 14
    },
    {
        name: 'Trophy',
        image: '/public/pictures/Trophy.png',
        price: 100000,
        description: '100,000 coins',
        id: 15
    }
];

// Function to save items to the database
const saveItems = async () => {
    for (const itemData of itemsData) {
        try {
            // Check if the item already exists in the database
            const existingItem = await ItemModel.findOne({ name: itemData.name });
            if (existingItem) {
                console.log(`Item "${itemData.name}" already exists in the database. Skipping...`);
                continue; // Skip saving the item if it already exists
            }

            // If the item doesn't exist, create and save it
            const newItem = new ItemModel(itemData);
            await newItem.save();
            console.log(`Item "${itemData.name}" saved successfully.`);
        } catch (error) {
            console.error(`Error saving item "${itemData.name}":`, error);
        }
    }
};


// Call the function to save items
saveItems();

// Export the ItemModel to be used in other files
module.exports = ItemModel;
