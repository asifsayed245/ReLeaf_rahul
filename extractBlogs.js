import fs from 'fs';
import path from 'path';

const stepsDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\88e753e1-28b7-4ae1-9a4a-c50ef08d600b\\.system_generated\\steps';
const files = [
  { step: 538, slug: 'healing-beyond-rehab', title: 'Healing Beyond Rehab: The Rise of Holistic, Community-Based Recovery in India', excerpt: 'Explore holistic, community-based recovery in India—beyond rehab—focusing on emotional healing, support networks, and sustainable addiction recovery.', date: 'May 10, 2024', category: 'Recovery' },
  { step: 539, slug: 'addiction-isnt-just-about-the-substance', title: 'Addiction Isn’t Just About the Substance — It’s About What’s Going On Inside', excerpt: 'In India, conversations around addiction are finally evolving. We’re starting to move past shame and stigma to look at what’s really going on underneath.', date: 'April 20, 2024', category: 'Understanding' },
  { step: 540, slug: 'top-5-challenges-of-staying-sober-in-mumbai', title: 'Top 5 Challenges of Staying Sober in Mumbai and How to Overcome Them', excerpt: 'Mumbai is a city of extremes. It’s loud, fast, and intensely social. Navigating sobriety here brings unique challenges.', date: 'April 5, 2024', category: 'Practical' },
  { step: 541, slug: 'why-sobriety-coaching-is-the-best-alternative-to-rehab-in-mumbai', title: 'Why Sobriety Coaching is the Best Alternative to Rehab in Mumbai', excerpt: 'Rehab works for some, but many people are finding sobriety coaching to be a more effective, personalized alternative.', date: 'March 15, 2024', category: 'Recovery' },
  { step: 542, slug: 'finding-freedom-how-rahul-seth-helped-me-break-free-from-addiction', title: 'Finding Freedom: How Rahul Seth Helped Me Break Free from Addiction', excerpt: 'My name is Layla Al-Mansouri, and I want to share my story in the hope that it might inspire someone else who feels lost as I once did.', date: 'February 28, 2024', category: 'Stories' },
  { step: 543, slug: 'how-rahul-seth-helped-me-find-myself-again', title: 'How Rahul Seth Helped Me Find Myself Again', excerpt: 'My name is Emma Bennett, and when I look back at my life a year ago, it feels like I’m recalling the story of someone else entirely.', date: 'February 10, 2024', category: 'Stories' }
];

let tsCode = `export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
`;

for (const file of files) {
  const filePath = path.join(stepsDir, file.step.toString(), 'content.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Try to extract content between the second "Let's Talk" link and the "← Previous Post" or similar footer
  // The header links end around line 280-290. We can just split by "[Let's Talk](https://wa.me/919820281442)" and take the last part.
  const parts = content.split("[Let's Talk](https://wa.me/919820281442)");
  let bodyContent = parts[parts.length - 1].trim();
  
  // Remove the footer. Usually starts with "[← Previous Post]" or "### [" or "With compassionate guidance"
  bodyContent = bodyContent.split("[← Previous Post]")[0];
  bodyContent = bodyContent.split("### [Why Sobriety")[0];
  bodyContent = bodyContent.split("### [Top 5 Challenges")[0];
  bodyContent = bodyContent.split("With compassionate guidance")[0];
  bodyContent = bodyContent.split("## Recent Posts")[0];
  bodyContent = bodyContent.trim();
  
  // Calculate read time
  const words = bodyContent.split(/\\s+/).length;
  const readTime = Math.ceil(words / 200) + ' min read';

  // Format as a JS string
  tsCode += `  {
    slug: ${JSON.stringify(file.slug)},
    title: ${JSON.stringify(file.title)},
    excerpt: ${JSON.stringify(file.excerpt)},
    date: ${JSON.stringify(file.date)},
    readTime: ${JSON.stringify(readTime)},
    category: ${JSON.stringify(file.category)},
    content: ${JSON.stringify(bodyContent)}
  },
`;
}

tsCode += `];
`;

fs.writeFileSync('src/data/blogs.ts', tsCode);
console.log('Successfully generated src/data/blogs.ts');
