export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string[];
    services: string[];
    insights?: string;
    features?: string[];
    design_strategy?: string;
}