/**
 * Build Script - Convert Markdown Entries to JSON
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * BUILD_PROTOCOL: Transform knowledge into accessible format
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NOTE: For Vercel deployment, data files are pre-built and committed.
 * This script is for local development only.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GLOSSARY_DIR = path.resolve(__dirname, '../../omega_pedia/ΩPedia/07_GLOSSARY');
const OUTPUT_DIR = path.resolve(__dirname, '../client/public/data');
const ENTRIES_FILE = path.join(OUTPUT_DIR, 'entries.json');
const SEARCH_INDEX_FILE = path.join(OUTPUT_DIR, 'search-index.json');

// Check if data files already exist (for Vercel deployment)
if (fs.existsSync(ENTRIES_FILE) && fs.existsSync(SEARCH_INDEX_FILE)) {
  console.log('✅ Data files already exist, skipping build');
  console.log('   (Pre-built data is used for deployment)');
  process.exit(0);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse a Markdown file and extract structured data
 */
function parseMarkdownEntry(filePath, filename) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Extract title from first line (# Title)
  let title = '';
  let entryId = '';
  let lead = '';
  let definition = '';
  let fullContent = content;
  
  // Parse the file
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Get title from first heading
    if (line.startsWith('# ') && !title) {
      title = line.substring(2).trim();
    }
    
    // Get Entry ID
    if (line.startsWith('**Entry ID:**')) {
      entryId = line.replace('**Entry ID:**', '').trim();
    }
    
    // Get Lead section
    if (line === '## Lead') {
      // Collect lines until next section
      let j = i + 1;
      const leadLines = [];
      while (j < lines.length && !lines[j].startsWith('## ')) {
        leadLines.push(lines[j]);
        j++;
      }
      lead = leadLines.join('\n').trim();
    }
    
    // Get Definition section
    if (line === '## Definition') {
      let j = i + 1;
      const defLines = [];
      while (j < lines.length && !lines[j].startsWith('## ')) {
        defLines.push(lines[j]);
        j++;
      }
      definition = defLines.join('\n').trim();
    }
  }
  
  // Generate slug from filename
  const slug = filename
    .replace('.md', '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Determine category based on filename pattern
  let category = 'general';
  if (filename.match(/^\d+_/)) {
    category = 'numbered';
  } else if (filename.includes('_COSMIC')) {
    category = 'cosmic';
  } else if (filename === filename.toUpperCase().replace('.md', '') + '.md') {
    category = 'concept';
  }
  
  // Extract excerpt (first meaningful paragraph)
  const excerpt = lead || definition || content.split('\n').slice(0, 5).join(' ').substring(0, 300);
  
  return {
    id: slug,
    entryId: entryId || slug,
    title: title || filename.replace('.md', '').replace(/_/g, ' '),
    slug,
    category,
    excerpt: excerpt.substring(0, 500),
    content: fullContent,
    filename,
    lastModified: fs.statSync(filePath).mtime.toISOString()
  };
}

/**
 * Build search index for fast client-side search
 */
function buildSearchIndex(entries) {
  return entries.map(entry => ({
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.excerpt,
    category: entry.category,
    // Create searchable text (lowercase for matching)
    searchText: `${entry.title} ${entry.excerpt} ${entry.content}`
      .toLowerCase()
      .substring(0, 2000) // Limit size for performance
  }));
}

/**
 * Main build function
 */
async function build() {
  console.log('🔮 Building ΩPedia entries...');
  console.log(`📂 Source: ${GLOSSARY_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  
  // Check if source directory exists
  if (!fs.existsSync(GLOSSARY_DIR)) {
    console.error('❌ Glossary directory not found:', GLOSSARY_DIR);
    console.log('   This is expected in Vercel deployment.');
    console.log('   Please ensure data files are pre-built and committed.');
    process.exit(1);
  }
  
  // Get all markdown files
  const files = fs.readdirSync(GLOSSARY_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'));
  
  console.log(`📄 Found ${files.length} entries`);
  
  // Parse all entries
  const entries = [];
  const errors = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(GLOSSARY_DIR, file);
      const entry = parseMarkdownEntry(filePath, file);
      entries.push(entry);
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  }
  
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} files had parsing errors`);
  }
  
  // Sort entries by title
  entries.sort((a, b) => a.title.localeCompare(b.title));
  
  // Build search index
  const searchIndex = buildSearchIndex(entries);
  
  // Write entries file (full data)
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
  console.log(`✅ Wrote ${entries.length} entries to entries.json`);
  
  // Write search index (lightweight for fast loading)
  fs.writeFileSync(SEARCH_INDEX_FILE, JSON.stringify(searchIndex));
  console.log(`✅ Wrote search index to search-index.json`);
  
  // Generate statistics
  const stats = {
    totalEntries: entries.length,
    categories: {},
    buildTime: new Date().toISOString()
  };
  
  entries.forEach(e => {
    stats.categories[e.category] = (stats.categories[e.category] || 0) + 1;
  });
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stats.json'),
    JSON.stringify(stats, null, 2)
  );
  
  console.log('\n📊 Build Statistics:');
  console.log(`   Total entries: ${stats.totalEntries}`);
  Object.entries(stats.categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
  
  console.log('\n🎉 Build complete!');
}

build().catch(console.error);
