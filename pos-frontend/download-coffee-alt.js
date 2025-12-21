// Download alternative coffee image
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, 'public', 'images', 'products', filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            // Follow redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, (redirected) => {
                    redirected.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log(`✅ Downloaded: ${filename}`);
                        resolve();
                    });
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve();
                });
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            console.error(`❌ Error downloading ${filename}:`, err.message);
            reject(err);
        });
    });
};

console.log('🚀 Downloading coffee image (alternative URL)...\n');
// Try different coffee image
downloadImage('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', 'coffee-1.jpg')
    .then(() => console.log('\n✨ Coffee image downloaded successfully!'))
    .catch(() => console.error('Failed to download coffee image'));
