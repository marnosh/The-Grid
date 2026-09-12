export interface SpaceItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  badge?: string;
  description: string;
  features: string[];
  isAvailable: boolean;
  highlightTag?: string;
  seatsInfo?: string;
  iconType: 'desk' | 'cabin' | 'office' | 'virtual';
  order: number;
  imageUrl?: string;
  imageAlt?: string;
}

export interface AmenityItem {
  id: string;
  title: string;
  description: string;
  icon: 'sofa' | 'snowflake' | 'map-pin' | 'wifi' | 'gamepad' | 'coffee';
  enabled: boolean;
}

export interface PromoPopupConfig {
  enabled: boolean;
  tag: string;
  headline: string;
  description: string;
  ctaText: string;
  floorLocation: string;
  whatsappMessage: string;
}

export interface SiteConfig {
  brandName: string;
  brandSubtitle: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  address: string;
  floorNotice: string;
  heroHeadline: string;
  heroPosterQuestion: string;
  heroSubhead: string;
  whyCoworkingHeadline: string;
  whyCoworkingPoints: string[];
  whyCoworkingDescriptions?: string[];
  bannerText: string;
  bannerEnabled: boolean;
  googleMapsEmbedUrl: string;
  promoPopup: PromoPopupConfig;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  spaceType: string;
  seatsNeeded: string | number;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'booked' | 'cancelled';
  notes?: string;
}

export type AdminTab = 'spaces' | 'amenities' | 'content' | 'enquiries' | 'settings';
