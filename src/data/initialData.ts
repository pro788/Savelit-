import { SavedItem, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_default_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@saveit.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'cloud_pro',
};

export const INITIAL_ITEMS: SavedItem[] = [
  {
    id: 'item_1',
    type: 'link',
    title: 'How Deep Work Shapes Modern Creative Breakthroughs',
    content: 'https://themindfuldev.blog/deep-work-creative-habits',
    description: 'A comprehensive study on why uninterrupted flow state is the superpower of modern knowledge workers and software engineers.',
    domain: 'themindfuldev.blog',
    favicon: 'https://www.google.com/s2/favicons?domain=themindfuldev.blog&sz=64',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    tags: ['Productivity', 'Focus', 'Reading'],
    isPinned: true,
    isArchived: false,
    isPrivate: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    estimatedReadTimeMinutes: 4,
    articleBody: `In our hyper-connected world, distraction has become the ambient background noise of life. Constant notifications, context switching, and fragmented attention prevent our minds from engaging in prolonged synthesis.

Cal Newport defines "Deep Work" as professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.

Here are three foundational pillars to cultivate this daily:

1. The Monastic Rule of Scheduling
Block two uninterrupted 90-minute sessions early in your workday before checking email or Slack. Treat these appointments with yourself as non-negotiable executive meetings.

2. Ritualize the Starting Friction
The hardest part is overcoming the first four minutes of cognitive resistance. Set up an unambiguous physical cue: clear the desk, put headphones on, and open only a single text window.

3. Rest as an Active Craft
Deep work requires proportional deep recovery. Walking outdoors without a phone allows the subconscious mind to integrate complex patterns while preventing mental burnout.

When you reclaim control over your attention, you regain control over what you build.`,
  },
  {
    id: 'item_2',
    type: 'note',
    title: 'Weekend Travel Packlist: Nordic Cabin',
    content: `• Wool thermal base layers & merino socks\n• Water filter bottle & electrolyte packets\n• Fujifilm X-T5 with 27mm pancake lens\n• Kindles with 3 offline downloaded sci-fi novels\n• Portable power bank (20,000 mAh)\n• Aeropress travel coffee maker & hand grinder`,
    description: 'Quick packing checklist for the upcoming mountain trip.',
    tags: ['Travel', 'Checklist', 'Personal'],
    isPinned: true,
    isArchived: false,
    isPrivate: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 18,
  },
  {
    id: 'item_3',
    type: 'image',
    title: 'Mid-Century Modern Interior Palette',
    content: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80',
    description: 'Inspiration for the living room renovation: warm walnut wood, olive velvet accents, and brushed brass fixtures.',
    imageCaption: 'Clean lines, organic textures, natural diffused afternoon light.',
    tags: ['Design', 'Interior', 'Inspiration'],
    isPinned: false,
    isArchived: false,
    isPrivate: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'item_4',
    type: 'link',
    title: 'Understanding React 19 Compiler and Server Actions',
    content: 'https://react.dev/blog/react-19-architecture',
    description: 'Deep dive into automatic memoization, optimistic UI updates, and resource preloading in React modern web ecosystem.',
    domain: 'react.dev',
    favicon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    tags: ['Tech', 'React', 'Code'],
    isPinned: false,
    isArchived: false,
    isPrivate: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    estimatedReadTimeMinutes: 6,
    articleBody: `React 19 marks one of the most substantial leaps in front-end ergonomics since hooks were introduced in 2018.

Key Innovations:
• The React Compiler automatically optimizes re-renders by understanding dependency graphs at compile time, reducing the need for manual useMemo and useCallback.
• Actions streamline asynchronous transitions, giving native support for pending states and optimistic rollbacks without heavy boilerplate.
• Server Components bridge the gap between instant page loads and reactive client components.

By shifting complexity into build-time tooling, developers spend more time designing responsive user experiences and less time profiling subtle render loops.`,
  },
  {
    id: 'item_5',
    type: 'note',
    title: 'Secret Recovery Keys & Vault Access [Private]',
    content: `Backup passphrases and door entry codes:\n- Front Gate: #8821\n- Storage Locker B-14: 9042\n- Server SSH Seed: orchid-velvet-mountain-ember-drift`,
    description: 'Sensitive personal credentials protected inside the private vault.',
    tags: ['Private', 'Security', 'Vault'],
    isPinned: false,
    isArchived: false,
    isPrivate: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'item_6',
    type: 'link',
    title: 'The 15-Minute Artisan Sourdough Technique',
    content: 'https://bakingjournal.org/artisan-sourdough-guide',
    description: 'No-knead Dutch oven baking method that produces bakery-quality blistered crust and open crumb structure.',
    domain: 'bakingjournal.org',
    favicon: 'https://www.google.com/s2/favicons?domain=bakingjournal.org&sz=64',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    tags: ['Recipes', 'Food', 'Cooking'],
    isPinned: false,
    isArchived: true, // In archive
    isPrivate: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    estimatedReadTimeMinutes: 3,
    articleBody: `The secret to extraordinary sourdough isn't grueling kneading; it's patient enzymatic activity and high hydration baked in a superheated cast iron Dutch oven.

Ingredients:
• 450g Unbleached bread flour
• 50g Whole rye flour
• 375g Filtered room-temperature water (75% hydration)
• 100g Active sourdough starter
• 10g Fine sea salt

Mix until a shaggy dough forms, cover for 45 minutes, perform four sets of stretch-and-folds over 2 hours, and allow cold overnight retardation in the refrigerator. Bake at 230°C (450°F) for 20 minutes covered with ice cubes for steam, then 20 minutes uncovered for mahogany coloration.`,
  },
];
