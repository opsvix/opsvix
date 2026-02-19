import { Label } from "@/ui/label";
import { Typograph } from "@/ui/typograph";
import Image from "next/image";
import Link from "next/link";

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    services: string[];
}

type ProjectProps = {
    project: Project;
};

const Card = ({ project }: ProjectProps) => {
    return (
        <Link href={`/portfolio/${project.slug}`} className="w-full flex flex-col gap-4 group cursor-pointer">
            <div className="h-96 overflow-hidden border-2 border-gray-200 object-center ">
                <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <Typograph variant="tittle">{project.title}</Typograph>
            <div className="flex flex-wrap w-5/6 gap-2">
                {project.services?.map((service, index) => (
                    <Label key={index} text={service} />
                ))}
            </div>
        </Link>
    );
};

export default Card;