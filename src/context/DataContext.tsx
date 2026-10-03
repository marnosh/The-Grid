import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpaceItem, AmenityItem, SiteConfig, Enquiry, BlogPost, AdminUser } from '../types';
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_SPACES,
  DEFAULT_AMENITIES,
  INITIAL_SAMPLE_ENQUIRIES,
  DEFAULT_BLOGS,
} from '../data/defaultContent';

const STORAGE_KEYS = {
  CONFIG: 'thegrid_site_config_v2',
  SPACES: 'thegrid_spaces_v2',
  AMENITIES: 'thegrid_amenities_v2',
  ENQUIRIES: 'thegrid_enquiries_v2',
  BLOGS: 'thegrid_blogs_v2',
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
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id'>) => BlogPost;
  updateBlog: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], notes?: string) => void;
  deleteEnquiry: (id: string) => void;
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
  exportDefaultContentTs: () => string;
  isAdminView: boolean;
  setIsAdminView: (value: boolean) => void;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  isBlogViewerOpen: boolean;
  setIsBlogViewerOpen: (open: boolean) => void;
  selectedBlogSlug: string | null;
  setSelectedBlogSlug: (slug: string | null) => void;
  openBlogBySlug: (slug: string) => void;
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
        if (!parsed.address || !parsed.address.startsWith('2121,')) {
          parsed.address = DEFAULT_SITE_CONFIG.address;
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
          let updatedName = sp.name;
          let updatedSeatsInfo = sp.seatsInfo;
          let updatedDescription = sp.description;
          let updatedFeatures = sp.features;

          if (sp.id === 'space-private-cabin') {
            if (sp.name.includes('12 seater') && !sp.name.includes('16')) {
              updatedName = 'Private cabin (4 / 6 / 8 / 12 / 16 seater)';
            }
            if (sp.seatsInfo && sp.seatsInfo.includes('12') && !sp.seatsInfo.includes('16')) {
              updatedSeatsInfo = '4, 6, 8, 12 or 16 Seater';
            }
            if (sp.description && sp.description.includes('4 to 12')) {
              updatedDescription = sp.description.replace('4 to 12', '4 to 16');
            }
          }

          if (sp.id === 'space-virtual-office' || sp.name.toLowerCase().includes('virtual')) {
            if (!updatedFeatures.some((f) => f.toLowerCase().includes('msme'))) {
              updatedFeatures = ['Free MSME and GST registration', ...updatedFeatures];
            }
          }

          return {
            ...sp,
            name: updatedName,
            seatsInfo: updatedSeatsInfo,
            description: updatedDescription,
            features: updatedFeatures,
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

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
      return saved ? JSON.parse(saved) : DEFAULT_BLOGS;
    } catch (e) {
      console.warn('Error reading blogs from localStorage', e);
      return DEFAULT_BLOGS;
    }
  });

  const [isAdminView, setIsAdminViewInternal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('thegrid_admin_token') || sessionStorage.getItem('thegrid_admin_token'));
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('thegrid_admin_user') || sessionStorage.getItem('thegrid_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isBlogViewerOpen, setIsBlogViewerOpen] = useState(false);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const openBlogBySlug = (slug: string) => {
    setSelectedBlogSlug(slug);
    setIsBlogViewerOpen(true);
  };

  // Safe setter for admin view: requires authentication
  const setIsAdminView = (val: boolean) => {
    if (val && !isAdminAuthenticated) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    setIsAdminViewInternal(val);
  };

  // Verify stored token with backend API on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('thegrid_admin_token') || sessionStorage.getItem('thegrid_admin_token');
      if (!token) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
        return;
      }

      try {
        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.valid) {
            setIsAdminAuthenticated(true);
            if (data.admin) {
              setAdminUser(data.admin);
              localStorage.setItem('thegrid_admin_user', JSON.stringify(data.admin));
            }
            return;
          }
        }
        // Invalidate session only if server explicitly rejected the token
        if (res.status === 401) {
          localStorage.removeItem('thegrid_admin_token');
          sessionStorage.removeItem('thegrid_admin_token');
          localStorage.removeItem('thegrid_admin_user');
          sessionStorage.removeItem('thegrid_admin_user');
          setIsAdminAuthenticated(false);
          setAdminUser(null);
          setIsAdminViewInternal(false);
        }
      } catch (err) {
        console.warn('Admin token verification skipped (offline fallback)', err);
      }
    };

    verifyToken();
  }, []);

  const loginAdmin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: 'Authentication server returned an unexpected response. Please ensure your Vercel deployment has finished.',
        };
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Invalid administrator email or password.',
        };
      }

      const token = data.token;
      const user = data.admin;
      localStorage.setItem('thegrid_admin_token', token);
      localStorage.setItem('thegrid_admin_user', JSON.stringify(user));
      setAdminUser(user);
      setIsAdminAuthenticated(true);
      setIsAdminLoginModalOpen(false);
      setIsAdminViewInternal(true);
      showToast('Admin logged in successfully');
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to authentication server. Please check your connection and retry.',
      };
    }
  };

  const logoutAdmin = () => {
    try {
      localStorage.removeItem('thegrid_admin_token');
      sessionStorage.removeItem('thegrid_admin_token');
      localStorage.removeItem('thegrid_admin_user');
      sessionStorage.removeItem('thegrid_admin_user');
    } catch {}
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setIsAdminViewInternal(false);
    showToast('Logged out of Admin Portal');
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
    } catch (e) {
      console.error(e);
    }
  }, [blogs]);

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

  const addBlog = (blogData: Omit<BlogPost, 'id'>): BlogPost => {
    const newBlog: BlogPost = {
      ...blogData,
      id: `blog-${Date.now()}`,
    };
    setBlogs((prev) => [newBlog, ...prev]);
    showToast(`Published blog: "${newBlog.title.slice(0, 30)}..."`);
    return newBlog;
  };

  const updateBlog = (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
    showToast('Blog article updated');
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    showToast('Blog article deleted');
  };

  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setEnquiries((prev) => [newEnq, ...prev]);

    // Asynchronously dispatch automated email notification to thegridbycastillo@gmail.com
    fetch('/api/enquiry/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnq),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          console.log('Automated lead alert sent to thegridbycastillo@gmail.com');
        }
      })
      .catch((err) => {
        console.warn('Enquiry alert background dispatch:', err);
      });

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
    setBlogs(DEFAULT_BLOGS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.SPACES);
    localStorage.removeItem(STORAGE_KEYS.AMENITIES);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.BLOGS);
    showToast('Reset all data to original Castillo handoff specification');
  };

  const exportJSON = () => {
    const fullData = {
      siteConfig,
      spaces,
      amenities,
      blogs,
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
      if (Array.isArray(parsed.blogs)) setBlogs(parsed.blogs);
      if (Array.isArray(parsed.enquiries)) setEnquiries(parsed.enquiries);
      showToast('Data imported successfully');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Failed to parse JSON file');
      return false;
    }
  };

  const exportDefaultContentTs = (): string => {
    return `import { SpaceItem, AmenityItem, SiteConfig, Enquiry, BlogPost } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = ${JSON.stringify(siteConfig, null, 2)};

export const DEFAULT_SPACES: SpaceItem[] = ${JSON.stringify(spaces, null, 2)};

export const DEFAULT_AMENITIES: AmenityItem[] = ${JSON.stringify(amenities, null, 2)};

export const INITIAL_SAMPLE_ENQUIRIES: Enquiry[] = ${JSON.stringify(enquiries, null, 2)};

export const DEFAULT_BLOGS: BlogPost[] = ${JSON.stringify(blogs, null, 2)};
`;
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
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetToDefaults,
        exportJSON,
        importJSON,
        exportDefaultContentTs,
        isAdminView,
        setIsAdminView,
        isAdminAuthenticated,
        adminUser,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        isBlogViewerOpen,
        setIsBlogViewerOpen,
        selectedBlogSlug,
        setSelectedBlogSlug,
        openBlogBySlug,
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
