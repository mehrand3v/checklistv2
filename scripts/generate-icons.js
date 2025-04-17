import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [192, 512];
const sourceIcon = path.resolve('public/icon.png');
const outputDir = path.resolve('public');

// Create a basic icon if it doesn't exist
async function createBasicIcon() {
  const size = 512;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#4f46e5"/>
      <circle cx="50%" cy="50%" r="40%" fill="white"/>
      <circle cx="50%" cy="50%" r="35%" fill="#4f46e5"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .toFile(sourceIcon);
}

async function generateIcons() {
  try {
    // Create source icon if it doesn't exist
    if (!fs.existsSync(sourceIcon)) {
      console.log('Creating source icon...');
      await createBasicIcon();
    }

    // Generate icons for each size
    for (const size of sizes) {
      const filename = `pwa-${size}x${size}.png`;
      const outputPath = path.join(outputDir, filename);

      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(outputPath);

      console.log(`Generated ${filename}`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 