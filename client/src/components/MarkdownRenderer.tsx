/**
 * MarkdownRenderer - Render Markdown content with styling
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * RENDER_PROTOCOL: Transform knowledge into visual form
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const htmlContent = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div 
      className={`markdown-content prose max-w-none ${isDark ? 'prose-invert' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

/**
 * Simple Markdown parser
 */
function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (```...```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="heading-6">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="heading-5">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="heading-4">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="heading-3">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="heading-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="heading-1">$1</h1>');

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote class="blockquote">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="divider" />');

  // Tables
  html = parseTable(html);

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link">$1</a>');

  // LaTeX/Math (simple display)
  html = html.replace(/\$\$([^$]+)\$\$/g, '<div class="math-block">$1</div>');
  html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>');

  // Unordered lists
  html = html.replace(/^\*\s+(.+)$/gm, '<li class="list-item">$1</li>');
  html = html.replace(/^-\s+(.+)$/gm, '<li class="list-item">$1</li>');
  
  // Wrap consecutive list items
  html = html.replace(/(<li class="list-item">.*<\/li>\n?)+/g, (match) => {
    return `<ul class="list">${match}</ul>`;
  });

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ordered-item">$1</li>');
  html = html.replace(/(<li class="ordered-item">.*<\/li>\n?)+/g, (match) => {
    return `<ol class="ordered-list">${match}</ol>`;
  });

  // Paragraphs (lines that aren't already wrapped)
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return line;
    return `<p class="paragraph">${line}</p>`;
  });
  html = processedLines.join('\n');

  // Clean up empty paragraphs
  html = html.replace(/<p class="paragraph"><\/p>/g, '');

  return html;
}

/**
 * Parse Markdown tables
 */
function parseTable(html: string): string {
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  
  return html.replace(tableRegex, (_, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter((h: string) => h.trim());
    const rows = bodyRows.trim().split('\n').map((row: string) => 
      row.split('|').filter((c: string) => c.trim())
    );

    const headerHtml = headers.map((h: string) => 
      `<th class="table-header">${h.trim()}</th>`
    ).join('');

    const bodyHtml = rows.map((row: string[]) => 
      `<tr class="table-row">${row.map((cell: string) => 
        `<td class="table-cell">${cell.trim()}</td>`
      ).join('')}</tr>`
    ).join('');

    return `<table class="table">
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${bodyHtml}</tbody>
    </table>`;
  });
}

export default MarkdownRenderer;
