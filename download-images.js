const https = require('https');
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Sample product images to download
const sampleImages = [
    {
        url: 'https://store.leibal.com/cdn/shop/files/pk24-side-natural.jpg?crop=center&height=2048&v=1685311498&width=2048',
        filename: 'pk24-leather.jpg'
    },
    {
        url: 'https://store.leibal.com/cdn/shop/files/pk24-wicker-black-2.jpg?crop=center&height=2048&v=1685310872&width=2048',
        filename: 'pk24-wicker.jpg'
    },
    {
        url: 'https://store.leibal.com/cdn/shop/files/obj-05-2.jpg?crop=center&height=2048&v=1713210368&width=2048',
        filename: 'obj-05-chair.jpg'
    }
];

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imagesDir, filename);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve();
                });
            } else {
                console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
                resolve(); // Continue with other downloads
            }
        }).on('error', (err) => {
            console.log(`❌ Error downloading ${filename}: ${err.message}`);
            resolve(); // Continue with other downloads
        });
    });
}

async function downloadAllImages() {
    console.log('🔄 Starting image downloads...');
    
    for (const image of sampleImages) {
        await downloadImage(image.url, image.filename);
    }
    
    console.log('✅ Download process completed!');
}

downloadAllImages(); 