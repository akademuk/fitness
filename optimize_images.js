const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'images');

const imagesToProcess = [
    { name: 'image-3.jpg', output: 'image-3-opt.webp', quality: 50 }
];

async function processImages() {
    for (const img of imagesToProcess) {
        const inputPath = path.join(imagesDir, img.name);
        const outputPath = path.join(imagesDir, img.output);

        if (!fs.existsSync(inputPath)) {
            console.log(`Image not found: ${img.name}`);
            continue;
        }

        try {
            let pipeline = sharp(inputPath);

            if (img.width) {
                pipeline = pipeline.resize({ width: img.width });
            }

            // Convert to WebP with specified quality
            pipeline = pipeline.webp({ quality: img.quality || 80 });

            await pipeline.toFile(outputPath);
            console.log(`Created ${outputPath}`);
        } catch (error) {
            console.error(`Error processing ${img.name}:`, error);
        }
    }
}processImages();
