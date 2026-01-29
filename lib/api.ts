const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "An error occurred",
      data.errors,
    );
  }

  return data;
}

// Public API functions
export const api = {
  // Profile
  getProfile: () => fetchApi<{ profile: Profile }>("/profile"),

  // Projects
  getProjects: (params?: {
    category?: string;
    featured?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.featured) searchParams.set("featured", params.featured);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    return fetchApi<{ projects: Project[]; pagination: Pagination }>(
      `/projects?${searchParams}`,
    );
  },
  getProject: (id: string) => fetchApi<{ project: Project }>(`/projects/${id}`),
  getCategories: () =>
    fetchApi<{ categories: { _id: string; count: number }[] }>(
      "/projects/categories",
    ),

  // Skills
  getSkills: () =>
    fetchApi<{ skills: Skill[]; groupedSkills: Record<string, Skill[]> }>(
      "/skills",
    ),

  // Experience
  getExperience: () =>
    fetchApi<{
      experiences: Experience[];
      work: Experience[];
      education: Experience[];
    }>("/experience"),

  // Testimonials
  getTestimonials: (featured?: boolean) => {
    const params = featured ? "?featured=true" : "";
    return fetchApi<{ testimonials: Testimonial[] }>(`/testimonials${params}`);
  },

  // Services
  getServices: () => fetchApi<{ services: Service[] }>("/services"),

  // Messages
  sendMessage: (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) =>
    fetchApi<{ message: string }>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Admin API functions
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ token: string; admin: Admin }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: (token: string) => fetchApi<{ admin: Admin }>("/auth/me", { token }),

  // Projects
  getProjects: (token: string) =>
    fetchApi<{ projects: Project[] }>("/projects", { token }),
  getProject: (token: string, id: string) =>
    fetchApi<{ project: Project }>(`/projects/${id}`, { token }),
  createProject: (token: string, data: FormData) =>
    fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then((r) => r.json()),
  updateProject: (token: string, id: string, data: FormData) =>
    fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then((r) => r.json()),
  deleteProject: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
      token,
    }),

  // Skills
  getSkills: (token: string) =>
    fetchApi<{ skills: Skill[] }>("/skills", { token }),
  createSkill: (token: string, data: Partial<Skill>) =>
    fetchApi<{ skill: Skill }>("/skills", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
  updateSkill: (token: string, id: string, data: Partial<Skill>) =>
    fetchApi<{ skill: Skill }>(`/skills/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),
  deleteSkill: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/skills/${id}`, { method: "DELETE", token }),

  // Experience
  getExperience: (token: string) =>
    fetchApi<{ work: Experience[]; education: Experience[] }>("/experience", {
      token,
    }),
  createExperience: (token: string, data: Partial<Experience>) =>
    fetchApi<{ experience: Experience }>("/experience", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
  updateExperience: (token: string, id: string, data: Partial<Experience>) =>
    fetchApi<{ experience: Experience }>(`/experience/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),
  deleteExperience: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/experience/${id}`, {
      method: "DELETE",
      token,
    }),

  // Testimonials
  getTestimonials: (token: string) =>
    fetchApi<{ testimonials: Testimonial[] }>("/testimonials", { token }),
  createTestimonial: (token: string, data: Partial<Testimonial>) =>
    fetchApi<{ testimonial: Testimonial }>("/testimonials", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
  updateTestimonial: (token: string, id: string, data: Partial<Testimonial>) =>
    fetchApi<{ testimonial: Testimonial }>(`/testimonials/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/testimonials/${id}`, {
      method: "DELETE",
      token,
    }),

  // Services
  getServices: (token: string) =>
    fetchApi<{ services: Service[] }>("/services", { token }),
  createService: (token: string, data: Partial<Service>) =>
    fetchApi<{ service: Service }>("/services", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
  updateService: (token: string, id: string, data: Partial<Service>) =>
    fetchApi<{ service: Service }>(`/services/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),
  deleteService: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/services/${id}`, {
      method: "DELETE",
      token,
    }),

  // Messages
  getMessages: (
    token: string,
    params?: { page?: number; isRead?: boolean },
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.isRead !== undefined)
      searchParams.set("isRead", params.isRead.toString());
    return fetchApi<{
      messages: Message[];
      unreadCount: number;
      pagination: Pagination;
    }>(`/messages?${searchParams}`, { token });
  },
  markMessageRead: (token: string, id: string) =>
    fetchApi<{ message: Message }>(`/messages/${id}/read`, {
      method: "PUT",
      token,
    }),
  deleteMessage: (token: string, id: string) =>
    fetchApi<{ message: string }>(`/messages/${id}`, {
      method: "DELETE",
      token,
    }),

  // Profile
  getProfile: (token: string) =>
    fetchApi<{ profile: Profile }>("/profile", { token }),
  updateProfile: (token: string, data: FormData) =>
    fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then((r) => r.json()),
};

// Types
export interface Profile {
  _id: string;
  name: string;
  title: string;
  tagline?: string;
  bio?: string;
  shortBio?: string;
  avatar?: { url: string; publicId?: string };
  resumeUrl?: string;
  email?: string;
  phone?: string;
  location?: { city?: string; country?: string };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    behance?: string;
    dribbble?: string;
    github?: string;
    website?: string;
  };
  availability?: { isAvailable: boolean; status: string };
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  images: {
    url: string;
    publicId?: string;
    alt?: string;
    isPrimary?: boolean;
  }[];
  tools: string[];
  client?: { name?: string; website?: string };
  projectUrl?: string;
  featured: boolean;
  isPublished: boolean;
  completedAt?: string;
  tags: string[];
  createdAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  color?: string;
  order: number;
  isVisible: boolean;
}

export interface Experience {
  _id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  location?: string;
  description?: string;
  achievements?: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  duration?: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  clientTitle?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: { url: string };
  featured: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  features: string[];
  priceRange?: string;
  pricing?: {
    startingPrice?: number;
    currency?: string;
    pricingType: string;
  };
  order: number;
  isActive: boolean;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
