// Script to download product images
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
    { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', name: 'burger-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80', name: 'pizza-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', name: 'cola-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', name: 'cake-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80', name: 'burger-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=500&q=80', name: 'coffee-1.jpg' },
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, 'public', 'images', 'products', filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            console.error(`❌ Error downloading ${filename}:`, err.message);
            reject(err);
        });
    });
};

const downloadAll = async () => {
    console.log('🚀 Starting image downloads...\n');

    for (const image of images) {
        try {
            await downloadImage(image.url, image.name);
        } catch (error) {
            console.error(`Failed to download ${image.name}`);
        }
    }

    console.log('\n✨ All images downloaded successfully!');
    console.log('📁 Images saved in: public/images/products/');
};

downloadAll();
