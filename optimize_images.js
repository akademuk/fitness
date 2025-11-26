const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'images');

const imagesToProcess = [
    { name: 'image-2.webp', width: 600 },
    { name: 'image-4.webp', width: 400 },
    { name: 'image-1.webp', quality: 80 },
    { name: 'image-3.webp', quality: 80 }
];

async function processImages() {
    for (const img of imagesToProcess) {
        const inputPath = path.join(imagesDir, img.name);
        const outputPath = path.join(imagesDir, img.name.replace('.webp', '-opt.webp'));

        if (!fs.existsSync(inputPath)) {
            console.log(`Image not found: ${img.name}`);
            continue;
        }

        try {
            let pipeline = sharp(inputPath);

            if (img.width) {
                pipeline = pipeline.resize({ width: img.width });
            }

            if (img.quality) {
                pipeline = pipeline.webp({ quality: img.quality });
            }

            await pipeline.toFile(outputPath);
            console.log(`Created ${outputPath}`);
        } catch (error) {
            console.error(`Error processing ${img.name}:`, error);
        }
    }
}processImages();
