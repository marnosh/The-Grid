import { SpaceItem, AmenityItem, SiteConfig, Enquiry, BlogPost } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'THE GRID',
  brandSubtitle: 'POWERED BY CASTILLO',
  phone: '9562868661',
  phoneFormatted: '+91 9562868661',
  whatsappNumber: '919562868661',
  whatsappMessageTemplate: "Hi, I'd like to know more about [SPACE_NAME] at THE GRID",
  email: 'thegridbycastillo@gmail.com',
  instagram: '@the__grid___',
  instagramUrl: 'https://www.instagram.com/the__grid___?igsi=eTV0NHk2ZncxZnd6',
  address: '2121, 1st Floor, Phase 2, Hilite Business Park, Calicut',
  floorNotice: 'THE GRID is on the 1st floor of Hilite Business Park, Phase 2 — no lift queues, no long stair climbs before your first meeting.',
  heroHeadline: 'Skip the stress. Skip Expensive rent. Just work.',
  heroPosterQuestion: 'Which One Would You Choose?',
  heroSubhead: "THE GRID gives Calicut's freelancers, startups and small teams a fully furnished workspace at Hilite Business Park — desks, cabins and virtual offices from ₹999/month.",
  whyCoworkingHeadline: 'Why coworking works',
  whyCoworkingPoints: [
    'Cost-effective and affordable',
    'Networking and collaboration opportunities',
    'Professional work environment, increased productivity',
    'Great for freelancers, startups and remote workers',
    'Saves time on office management',
  ],
  whyCoworkingDescriptions: [
    'Desks and cabins start at ₹3,500 and a virtual office at ₹999/month — a fraction of what a private office lease in Calicut would cost you.',
    'Shared desks and a common games & fun zone put you next to other founders and freelancers, not alone in a rented room.',
    "Fully furnished desks, air conditioning and high-speed WiFi mean you're not fixing office problems — you're just working.",
    'No lease, no deposit lock-in, no hiring an office manager — scale from a single hot desk to a 24-seater as your team grows.',
    'Pantry, parking, courier handling and a signed name board are already sorted — you skip the setup and start working from day one.',
  ],
  bannerText: '✨ Desks & Private Cabins available for immediate walk-in on 1st Floor, Hilite Business Park!',
  bannerEnabled: true,
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.376258079549!2d75.83350227583623!3d11.23377755060193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65a2979201a09%3A0x8673a5a7516d2ca8!2sHiLITE%20Business%20Park!5e0!3m2!1sen!2sin!4v1709600000000!5m2!1sen!2sin',
  promoPopup: {
    enabled: true,
    tag: 'FLOOR UPDATE · HILITE PHASE 2',
    headline: '4-SEATER CABIN JUST OPENED',
    description: 'Immediate move-in available on 1st Floor. Plug-and-play with dedicated AC & fiber WiFi.',
    ctaText: 'Ask for floor walkthrough',
    floorLocation: '1st Floor',
    whatsappMessage: 'Hi, I saw the 4-seater private cabin update at THE GRID Hilite Park. Is it available?',
  },
};

export const DEFAULT_SPACES: SpaceItem[] = [
  {
    id: 'space-hot-desk',
    name: 'Hot desk / co-working space',
    price: 'Starting from ₹3,500',
    unit: 'per month',
    badge: 'FLEXIBLE',
    seatsInfo: '1 Seat (Flexible / Dedicated)',
    description: "A single desk in THE GRID's shared floor at Hilite Business Park, Calicut — bring a laptop and you're set up in minutes.",
    features: [
      'High-speed WiFi',
      'Fully air-conditioned',
      'Coffee machine access',
      'Games & fun zone',
      'Accessible location',
    ],
    isAvailable: true,
    highlightTag: 'Instant Setup',
    iconType: 'desk',
    order: 1,
    imageUrl: 'https://i.postimg.cc/L8LVYHhb/file-00000000eea881f89cf02d346c35d8df.png',
    imageAlt: 'Hot desk coworking space at THE GRID, Hilite Business Park, Calicut',
  },
  {
    id: 'space-private-cabin',
    name: 'Private cabin (4 / 6 / 8 / 12 / 16 seater)',
    price: 'Starting from ₹3,500',
    unit: 'per seat / month',
    badge: 'MOST POPULAR',
    seatsInfo: '4, 6, 8, 12 or 16 Seater',
    description: 'Fully furnished private cabins for small teams who need a closed door and their own space, sized from 4 to 16 seats.',
    features: [
      'Fully furnished',
      'Fully air-conditioned',
      'High-speed WiFi',
      'Meeting room access',
      'Pantry & parking',
    ],
    isAvailable: true,
    highlightTag: 'Privacy & Focus',
    iconType: 'cabin',
    order: 2,
    imageUrl: 'https://i.postimg.cc/CLY8Pj1T/file-00000000810081f78c5c11097a9ecc9e.png',
    imageAlt: 'Private cabin workspace for teams at THE GRID, Hilite Business Park, Calicut',
  },
  {
    id: 'space-managed-office',
    name: 'Managed office space (up to 24 seaters)',
    price: 'Starting from ₹3,500',
    unit: 'per seat / month',
    badge: 'GROWING TEAMS',
    seatsInfo: 'Scalable up to 24 Seats',
    description: 'A fully furnished managed office for growing teams, available in 3, 4, 5 and 8-seater configurations and scalable up to 24 seats.',
    features: [
      'Fully furnished',
      'Free WiFi',
      'Meeting rooms',
      'Pantry',
      'Parking',
      'Games & fun zone',
    ],
    isAvailable: true,
    highlightTag: 'Zero Hassle',
    iconType: 'office',
    order: 3,
    imageUrl: 'https://i.postimg.cc/DzykBYVK/file-000000002c688207aab359367e133d65.png',
    imageAlt: 'Managed office space up to 24 seats at THE GRID, Hilite Business Park, Calicut',
  },
  {
    id: 'space-virtual-office',
    name: 'Virtual office',
    price: '₹999/month',
    unit: 'all-inclusive',
    badge: 'BEST VALUE',
    seatsInfo: 'Business Address & Compliances',
    description: 'A registered business address at Hilite Business Park for founders who need paperwork sorted without renting a desk.',
    features: [
      'Free MSME and GST registration',
      'Prime location address',
      'Business registration & office support',
      'Inward courier management',
      'Name board / signage',
      'Office assistance',
      'Workstation access',
      'LLP & Pvt Ltd registration',
    ],
    isAvailable: true,
    highlightTag: 'Diamond Badge ₹999',
    iconType: 'virtual',
    order: 4,
    imageUrl: 'https://i.postimg.cc/TPPFrLm5/file-00000000725882089b00296a80df7f78.png',
    imageAlt: 'Virtual office and conference setup at THE GRID, Hilite Business Park, Calicut',
  },
];

export const DEFAULT_AMENITIES: AmenityItem[] = [
  {
    id: 'amenity-furnished',
    title: 'Fully furnished',
    description: 'Desks, chairs and cabins ready to walk into',
    icon: 'sofa',
    enabled: true,
  },
  {
    id: 'amenity-ac',
    title: 'Fully air-conditioned',
    description: 'Every cabin and desk zone climate controlled',
    icon: 'snowflake',
    enabled: true,
  },
  {
    id: 'amenity-location',
    title: 'Accessible location',
    description: '1st floor, Hilite Business Park, Phase 2, Calicut',
    icon: 'map-pin',
    enabled: true,
  },
  {
    id: 'amenity-wifi',
    title: 'High-speed WiFi',
    description: 'No queuing for bandwidth, enterprise grade line',
    icon: 'wifi',
    enabled: true,
  },
  {
    id: 'amenity-games',
    title: 'Games & fun zone',
    description: "A break room that isn't just a corridor",
    icon: 'gamepad',
    enabled: true,
  },
  {
    id: 'amenity-coffee',
    title: 'Coffee machine',
    description: 'On tap, no separate charge for daily brew',
    icon: 'coffee',
    enabled: true,
  },
];

export const INITIAL_SAMPLE_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    name: 'Rahul K. Nair',
    phone: '9847123456',
    email: 'rahul.tech@gmail.com',
    spaceType: 'Private cabin (4 / 6 / 8 / 12 seater)',
    seatsNeeded: '6 seats',
    message: 'We are a 6-member tech team looking for immediate move-in from next Monday. Need to check cabin availability.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'new',
    notes: 'Called once, requested floor walkthrough at 3 PM.',
  },
  {
    id: 'enq-102',
    name: 'Ananya S.',
    phone: '9446098765',
    email: 'ananya.design@outlook.com',
    spaceType: 'Hot desk / co-working space',
    seatsNeeded: '1 seat',
    message: 'Freelance UI designer. Need a quiet desk with fast WiFi and coffee access for 3 months.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'contacted',
    notes: 'Sent WhatsApp details with desk plan.',
  },
  {
    id: 'enq-103',
    name: 'Faisal Mohammed',
    phone: '9995112233',
    email: 'faisal@calicutventures.in',
    spaceType: 'Virtual office',
    seatsNeeded: 'Virtual',
    message: 'Need GST and Pvt Ltd company registration address at Hilite Business Park Phase 2.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'booked',
    notes: 'Agreement signed, onboarded for ₹999/mo plan.',
  },
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Hilite Business Park Phase 2 is Calicut’s Leading Hub for Startups and Tech Teams',
    slug: 'why-hilite-business-park-calicut-coworking',
    excerpt: 'Discover why innovative founders, IT agencies, and creative freelancers are moving from traditional leased offices to Hilite Business Park Phase 2 in Calicut.',
    coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'Modern office interior at Hilite Business Park Calicut',
    author: 'THE GRID Editorial',
    category: 'Calicut Business',
    tags: ['Coworking', 'Calicut', 'Hilite Park', 'Startups'],
    publishedAt: '2026-09-15',
    readTime: '4 min read',
    isPublished: true,
    metaTitle: 'Why Hilite Business Park Phase 2 is Calicut’s Leading Tech Hub | THE GRID',
    metaDescription: 'Explore the benefits of setting up your startup or remote team at Hilite Business Park Phase 2, Calicut. Zero setup friction and prime connectivity at THE GRID.',
    content: `Calicut's commercial landscape is undergoing a decisive shift. For decades, businesses in the Malabar region operated out of standalone commercial buildings scattered across Mavoor Road, Bank Road, and Palayam. Today, the center of gravity for tech enterprises, creative agencies, and high-growth ventures has firmly relocated to **Hilite Business Park Phase 2**.

### The Advantage of Prime Location
Positioned directly on the Calicut Bypass, Hilite Business Park offers unmatched connectivity. Teams avoid inner-city traffic while remaining just minutes away from major transport arteries, Calicut Cyberpark, and the Government Cyberpark.

Clients visiting from Kochi, Bangalore, or the Calicut International Airport can access the facility without navigating congested city corridors.

### 1st Floor Accessibility: Skip the Lift Queues
One recurring pain point in high-rise corporate towers is elevator waiting times, particularly during morning rush hours and post-lunch intervals. 

**THE GRID** is situated on the **1st Floor of Phase 2**, enabling immediate walk-in accessibility. Whether you are stepping out for a coffee break or welcoming high-value clients, you never lose 15 minutes waiting for an elevator bank.

### Premium Amenities Without Capital Expenditure
Setting up a private 10-member office in Calicut typically demands significant initial capital:
- Long commercial lease deposits (6-10 months rent)
- Expensive interior fit-outs, air conditioning units, and modular workstations
- Recurring utility bills, cleaning staff, and high-speed enterprise fiber broadband contracts

At THE GRID, everything is operational from Day 1. With workstations starting at ₹3,500/month and private furnished cabins, founders protect their seed capital and focus entirely on product velocity and customer acquisition.`,
  },
  {
    id: 'blog-2',
    title: 'How Virtual Office Registration at ₹999/mo Saves Calicut Businesses Thousands in Overhead',
    slug: 'virtual-office-calicut-999-guide',
    excerpt: 'A comprehensive guide to obtaining a prestigious Hilite Business Park corporate address, GST compliance, and MCA company registration for just ₹999 per month.',
    coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'Corporate business architecture for virtual office registration in Calicut',
    author: 'Castillo Compliance Team',
    category: 'Business Setup',
    tags: ['Virtual Office', 'GST Registration', 'Pvt Ltd', 'Calicut'],
    publishedAt: '2026-09-10',
    readTime: '5 min read',
    isPublished: true,
    metaTitle: 'Virtual Office in Calicut for ₹999/mo | GST & Company Registration at THE GRID',
    metaDescription: 'Get a prime business address at Hilite Business Park Phase 2, Calicut for GST, LLP, and Pvt Ltd registration with mail handling for only ₹999/month.',
    content: `Whether you run an e-commerce brand, a remote software consultancy, or an international import-export venture, having a credible commercial address is essential for trust, regulatory compliance, and banking relationships.

However, paying ₹30,000 to ₹50,000 per month for a physical office you rarely occupy makes no financial sense. That is where **THE GRID’s Virtual Office plan at ₹999/month** comes in.

### What is Included in the ₹999/Month Virtual Office Package?
1. **Prestigious Hilite Business Park Address**: Display a reputable Phase 2 Hilite Business Park address on your website, invoices, letterheads, and Google Business Profile.
2. **GST Registration Documentation**: Full NOC (No Objection Certificate), rent agreement, and utility bill documentation accepted by the GST department and tax authorities.
3. **Company Registration (ROC / MCA)**: Suitable for Private Limited (Pvt Ltd), Limited Liability Partnership (LLP), Sole Proprietorship, and Partnership deeds.
4. **Physical Name Board & Inward Courier Handling**: Your business name displayed on the official directory board, with incoming mail safely received and recorded by on-site staff.
5. **On-Demand Desk & Meeting Room Access**: When you need to meet a client or hold an annual board review, book air-conditioned meeting spaces right on the 1st Floor.

### Who Benefits Most?
- **Remote Founders**: Tech entrepreneurs whose entire engineering team works from home.
- **Outstation Companies**: Kochi, Bangalore, or Mumbai firms requiring a formal branch presence in Malabar.
- **Freelancers & Consultants**: Professionals who want to protect their residential privacy and establish corporate credibility.

Setting up takes less than 48 hours once KYC documents are verified.`,
  },
  {
    id: 'blog-3',
    title: 'Hot Desk vs Private Cabin: Which Coworking Plan Fits Your Workstyle at THE GRID?',
    slug: 'hot-desk-vs-private-cabin-guide',
    excerpt: 'Comparing shared hot desks, dedicated team suites, and private cabins at Hilite Business Park to help you select the ideal workspace for your productivity.',
    coverImageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'Hot desk and collaborative open space at THE GRID',
    author: 'Community Manager',
    category: 'Workspace Guide',
    tags: ['Coworking', 'Productivity', 'Hot Desk', 'Private Cabin'],
    publishedAt: '2026-09-02',
    readTime: '3 min read',
    isPublished: true,
    metaTitle: 'Hot Desk vs Private Cabin: Which Workspace Should You Choose? | THE GRID',
    metaDescription: 'Find out whether a flexible hot desk or a lockable private cabin at THE GRID Hilite Business Park Phase 2 fits your workflow and budget.',
    content: `Choosing the right workspace configuration directly affects your daily focus, team dynamics, and monthly operating expenses. At **THE GRID**, we have engineered flexible spaces catering to solo operators as well as growing tech departments.

### When to Choose a Hot Desk (Starting ₹3,500/month)
- **Solo Freelancers & Developers**: If you need an ergonomic seat, high-speed fiber internet, and cold brew coffee without being tied to a single spot.
- **Networkers**: Sitting in the open coworking floor naturally connects you with graphic designers, full-stack engineers, and marketing specialists.
- **Flexible Timers**: Drop in, plug into the power strip, crush your sprint tasks, and unwind in the games & lounge area.

### When to Choose a Private Cabin (4, 6, 8, 12 or 16 Seater)
- **Teams with Daily Syncs & Client Calls**: If your team conducts multiple video conferences, handles sensitive client data, or needs confidential discussions.
- **Customized Branding & Lockable Storage**: Keep your monitors, whiteboards, and equipment safely locked overnight behind sound-insulated glass partitions.
- **Cost Efficiency for Small Teams**: Sized precisely for 4 to 16 members, giving your team the prestige of a private headquarters at Hilite Park at a fraction of traditional leasing rates.

### Experience Both Before Deciding
You don't have to guess. Walk in to **1st Floor, Phase 2, Hilite Business Park** between 9 AM and 7 PM for a personalized tour of both options.`,
  },
];
