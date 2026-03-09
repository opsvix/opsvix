export interface Project {
    id: number;
    title: string;
    slug: string;
    color: string;
    textColor?: string;
    description: string;
    image: string[];
    services: string[];
    insights?: string;
    features?: string[];
    design_strategy?: string;
}