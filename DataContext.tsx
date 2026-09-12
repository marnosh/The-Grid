import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpaceItem, AmenityItem, SiteConfig, Enquiry } from '../types';
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_SPACES,
  DEFAULT_AMENITIES,
  INITIAL_SAMPLE_ENQUIRIES,
} from '../data/defaultContent';

const STORAGE_KEYS = {
  CONFIG: 'thegrid_site_config_v2',
  SPACES: 'thegrid_spaces_v2',
  AMENITIES: 'thegrid_amenities_v2',
  ENQUIRIES: 'thegrid_enquiries_v2',
};

interface DataContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  spaces: SpaceItem[];
  addSpace: (space: Omit<SpaceItem, 'id' | 'order'>) => void;
  updateSpace: (id: string, updated: Partial<SpaceItem>) => void;
  deleteSpace: (id: string) => void;
  reorderSpaces: (spaces: SpaceItem[]) => void;
  amenities: AmenityItem[];
  updateAmenity: (id: string, updated: Partial<AmenityItem>) => void;
  addAmenity: (amenity: Omit<AmenityItem, 'id'>) => void;
  deleteAmenity: (id: string) => void;
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], notes?: string) => void;
  deleteEnquiry: (id: string) => void;
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
  isAdminView: boolean;
  setIsAdminView: (value: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.instagramUrl ||
          parsed.instagramUrl === 'https://instagram.com/the_grid__' ||
          parsed.instagram === '@the_grid__'
        ) {
          parsed.instagram = DEFAULT_SITE_CONFIG.instagram;
          parsed.instagramUrl = DEFAULT_SITE_CONFIG.instagramUrl;
        }
        if (
          !parsed.heroHeadline ||
          parsed.heroHeadline === 'Stress and expensive rent, or a coworking space that works for you?'
        ) {
          parsed.heroHeadline = DEFAULT_SITE_CONFIG.heroHeadline;
        }
        if (
          !parsed.whyCoworkingDescriptions ||
          parsed.whyCoworkingDescriptions.length === 0
        ) {
          parsed.whyCoworkingDescriptions = DEFAULT_SITE_CONFIG.whyCoworkingDescriptions;
        }
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          promoPopup: {
            ...DEFAULT_SITE_CONFIG.promoPopup,
            ...(parsed.promoPopup || {}),
          },
        };
      }
      return DEFAULT_SITE_CONFIG;
    } catch (e) {
      console.warn('Error reading config from localStorage', e);
      return DEFAULT_SITE_CONFIG;
    }
  });

  const [spaces, setSpaces] = useState<SpaceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPACES);
      if (saved) {
        const parsed: SpaceItem[] = JSON.parse(saved);
        return parsed.map((sp) => {
          const defaultSp = DEFAULT_SPACES.find(
            (d) => d.id === sp.id || d.name.toLowerCase() === sp.name.toLowerCase()
          );
          return {
            ...sp,
            imageUrl: sp.imageUrl || defaultSp?.imageUrl,
            imageAlt: sp.imageAlt || defaultSp?.imageAlt,
          };
        });
      }
      return DEFAULT_SPACES;
    } catch (e) {
      console.warn('Error reading spaces from localStorage', e);
      return DEFAULT_SPACES;
    }
  });

  const [amenities, setAmenities] = useState<AmenityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AMENITIES);
      return saved ? JSON.parse(saved) : DEFAULT_AMENITIES;
    } catch (e) {
      console.warn('Error reading amenities from localStorage', e);
      return DEFAULT_AMENITIES;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ENQUIRIES;
    } catch (e) {
      console.warn('Error reading enquiries from localStorage', e);
      return INITIAL_SAMPLE_ENQUIRIES;
    }
  });

  const [isAdminView, setIsAdminView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
    } catch (e) {
      console.error(e);
    }
  }, [spaces]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AMENITIES, JSON.stringify(amenities));
    } catch (e) {
      console.error(e);
    }
  }, [amenities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error(e);
    }
  }, [enquiries]);

  const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Site settings updated successfully');
  };

  const addSpace = (newSpace: Omit<SpaceItem, 'id' | 'order'>) => {
    const space: SpaceItem = {
      ...newSpace,
      id: `space-${Date.now()}`,
      order: spaces.length + 1,
    };
    setSpaces((prev) => [...prev, space]);
    showToast(`Added new space: "${space.name}"`);
  };

  const updateSpace = (id: string, updated: Partial<SpaceItem>) => {
    setSpaces((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('Space details updated');
  };

  const deleteSpace = (id: string) => {
    setSpaces((prev) => prev.filter((item) => item.id !== id));
    showToast('Space removed');
  };

  const reorderSpaces = (reordered: SpaceItem[]) => {
    setSpaces(reordered);
  };

  const updateAmenity = (id: string, updated: Partial<AmenityItem>) => {
    setAmenities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('Amenity updated');
  };

  const addAmenity = (newAmenity: Omit<AmenityItem, 'id'>) => {
    const amenity: AmenityItem = {
      ...newAmenity,
      id: `amenity-${Date.now()}`,
    };
    setAmenities((prev) => [...prev, amenity]);
    showToast('New amenity added');
  };

  const deleteAmenity = (id: string) => {
    setAmenities((prev) => prev.filter((item) => item.id !== id));
    showToast('Amenity deleted');
  };

  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    showToast('Enquiry received! The team will confirm availability today.');
    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status'], notes?: string) => {
    setEnquiries((prev) =>
      prev.map((enq) =>
        enq.id === id
          ? {
              ...enq,
              status,
              notes: notes !== undefined ? notes : enq.notes,
            }
          : enq
      )
    );
    showToast(`Enquiry marked as ${status}`);
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
    showToast('Enquiry deleted');
  };

  const resetToDefaults = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setSpaces(DEFAULT_SPACES);
    setAmenities(DEFAULT_AMENITIES);
    setEnquiries(INITIAL_SAMPLE_ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.SPACES);
    localStorage.removeItem(STORAGE_KEYS.AMENITIES);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    showToast('Reset all data to original Castillo handoff specification');
  };

  const exportJSON = () => {
    const fullData = {
      siteConfig,
      spaces,
      amenities,
      enquiries,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.siteConfig) setSiteConfig(parsed.siteConfig);
      if (Array.isArray(parsed.spaces)) setSpaces(parsed.spaces);
      if (Array.isArray(parsed.amenities)) setAmenities(parsed.amenities);
      if (Array.isArray(parsed.enquiries)) setEnquiries(parsed.enquiries);
      showToast('Data imported successfully');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Failed to parse JSON file');
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        spaces,
        addSpace,
        updateSpace,
        deleteSpace,
        reorderSpaces,
        amenities,
        updateAmenity,
        addAmenity,
        deleteAmenity,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetToDefaults,
        exportJSON,
        importJSON,
        isAdminView,
        setIsAdminView,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
