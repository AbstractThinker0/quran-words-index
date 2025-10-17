import * as fs from 'fs';
import * as path from 'path';

interface FullEntry {
  word: string;
  prefixes: string[];
  bound_prefix: string;
  unprefixed: string;
  type: string;
  extracted_root: string;
  extraction_method: string;
  suffix: string;
}

interface MinimalEntry {
  word: string;
  prefixes: string[];
  bound_prefix: string;
  unprefixed: string;
  extracted_root: string;
  suffix: string;
}

function generateMinimalIndex(): void {
  const inputPath = path.join(__dirname, '../data/quran-words-index.json');
  const outputPath = path.join(__dirname, '../data/quran-words-index-minimal.json');

  try {
    // Read the full index
    const fullIndexData = fs.readFileSync(inputPath, 'utf-8');
    const fullIndex: Record<string, FullEntry> = JSON.parse(fullIndexData);

    // Create minimal index
    const minimalIndex: Record<string, MinimalEntry> = {};

    for (const [key, entry] of Object.entries(fullIndex)) {
      minimalIndex[key] = {
        word: entry.word,
        prefixes: entry.prefixes,
        bound_prefix: entry.bound_prefix,
        unprefixed: entry.unprefixed,
        extracted_root: entry.extracted_root,
        suffix: entry.suffix,
      };
    }

    // Write minimal index
    fs.writeFileSync(outputPath, JSON.stringify(minimalIndex, null, 2), 'utf-8');
    console.log(`✓ Minimal index generated successfully: ${outputPath}`);
    console.log(`✓ Removed fields: 'type' and 'extraction_method'`);
  } catch (error) {
    console.error('Error generating minimal index:', error);
    process.exit(1);
  }
}

generateMinimalIndex();
