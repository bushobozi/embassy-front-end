export const PublicationTypes = {
    ARTICLE: "ARTICLE",
    NEWSLETTER: "NEWSLETTER",
    PRESS_RELEASE: "PRESS_RELEASE",
    PUBLICATION: "PUBLICATION",
    REPORT: "REPORT",
    BROCHURE: "BROCHURE",
    BLOG: "BLOG",
    OTHER: "OTHER",
} as const;

export const PublicationStatus = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
    PENDING_APPROVAL: "PENDING_APPROVAL",
} as const;

export const PublicationTags = {
    GENERAL: "GENERAL",
    CULTURE: "CULTURE",
    EDUCATION: "EDUCATION",
    TRADE: "TRADE",
    TOURISM: "TOURISM",
    EVENTS: "EVENTS",
    ALERTS: "ALERTS",
    OTHER: "OTHER",
} as const;

export const publicationTypeLabels: Record<string, string> = {
    ARTICLE: "Article",
    NEWSLETTER: "Newsletter",
    PRESS_RELEASE: "Press Release",
    PUBLICATION: "Publication",
    REPORT: "Report",
    BROCHURE: "Brochure",
    BLOG: "Blog",
    OTHER: "Other",
};

export const publicationStatusLabels: Record<string, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
    PENDING_APPROVAL: "Pending Approval",
};

export const publicationTagLabels: Record<string, string> = {
    GENERAL: "General",
    CULTURE: "Culture",
    EDUCATION: "Education",
    TRADE: "Trade",
    TOURISM: "Tourism",
    EVENTS: "Events",
    ALERTS: "Alerts",
    OTHER: "Other",
};

export interface PublicationFormData {
    title: string;
    publication_type: string;
    content: string;
    cover_image: File | null;
    tags: string;
    status: string;
}