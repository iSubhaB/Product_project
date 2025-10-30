import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import SubCategory from "./models/SubCategory.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";
import uploads from "../uploads"

dotenv.config();

const sampleCategories = [
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Sports",
    "Books",
    "Toys",
    "Beauty & Health",
    "Groceries",
    "Automotive",
    "Furniture",
];

const brandNames = [
    "Zenith",
    "NovaTech",
    "UrbanEdge",
    "AeroSport",
    "PixelPro",
    "VeloWear",
    "AromaCare",
    "TechLine",
    "FreshMart",
    "AutoPulse",
];

const adjectives = [
    "Smart",
    "Classic",
    "Premium",
    "Eco",
    "Modern",
    "Pro",
    "Compact",
    "Deluxe",
    "Digital",
    "Ultra",
];

const nouns = [
    "Watch",
    "Mixer",
    "Shoes",
    "Laptop",
    "Camera",
    "Jacket",
    "Bag",
    "Book",
    "Bottle",
    "Lamp",
    "Helmet",
    "Microwave",
    "Headphones",
    "Treadmill",
    "Speaker",
];


const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = () => Math.floor(Math.random() * 9000) + 100;
const randomRating = () => (Math.random() * 4 + 1).toFixed(1); 

const seedData = async () => {
    try {
        await connectDB();

        console.log("🧹 Clearing old data...");
        await Category.deleteMany();
        await SubCategory.deleteMany();
        await Product.deleteMany();

        console.log("🌱 Seeding categories...");
        const categories = await Category.insertMany(
            sampleCategories.map((name) => ({ name }))
        );

        console.log("🌱 Seeding subcategories...");
        const subCategories = [];
        for (const cat of categories) {
            for (let i = 1; i <= 3; i++) {
                subCategories.push({
                    name: `${randomItem(adjectives)} ${cat.name} ${i}`,
                    category: cat._id,
                });
            }
        }
        const createdSubs = await SubCategory.insertMany(subCategories);

        console.log("🌱 Seeding products...");
        const products = [];
        for (const sub of createdSubs) {
            for (let i = 1; i <= 10; i++) {
                const name = `${randomItem(adjectives)} ${randomItem(nouns)} ${i}`;
                const brand = randomItem(brandNames);
                const price = randomPrice();
                const rating = randomRating();

                products.push({
                    name,
                    brand,
                    description: `The ${name} by ${brand} is a ${randomItem(
                        adjectives
                    ).toLowerCase()} product from our ${sub.name} range.`,
                    price,
                    rating,
                    stock: Math.floor(Math.random() * 100) + 1,
                    category: sub.category,
                    subCategory: sub._id,
                    images: [ "../uploads/images (1).jfif" , "../uploads/images (2).jfif", "../uploads/images (3).jfif"],
                });
            }
        }

        await Product.insertMany(products);

        console.log(" Seeding completed successfully!");
        console.log(` Categories: ${categories.length}`);
        console.log(` Subcategories: ${createdSubs.length}`);
        console.log(` Products: ${products.length}`);

        process.exit(0);
    } catch (err) {
        console.error(" Seed error:", err);
        process.exit(1);
    }
};

seedData();
