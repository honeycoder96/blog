export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  articleDate?: string;
  articleSection?: string;
  tags?: string[];
  image?: string;
}

export function generateSEOData(data: SEOData) {
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    author: data.author,
    articleDate: data.articleDate,
    articleSection: data.articleSection || 'Technology',
    tags: data.tags || [],
    image: data.image
  };
}

export function generateKeywords(tags: string[], title: string): string {
  const baseKeywords = [
    'programming',
    'software development',
    'web development',
    'technology',
    'coding',
    'tutorial'
  ];
  
  const allKeywords = [...baseKeywords, ...tags, ...title.toLowerCase().split(' ')];
  return [...new Set(allKeywords)].slice(0, 10).join(', ');
}

export function generateDescription(content: string, maxLength: number = 160): string {
  // Remove markdown and HTML tags
  const cleanContent = content
    .replace(/[#*`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3) + '...';
} 