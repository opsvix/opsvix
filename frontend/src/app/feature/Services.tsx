
import { projects } from "@/lib/data";
import Grid from "@/components/PortfolioGrid";
import Card from "@/components/projectCard";
import { Typograph } from "@/ui/typograph";
import { Button } from "@/ui/button";
import Link from "next/link";
import CardSwiper from "./CardSwiper";

const Services = () => {
  return <div className="w-full h-full px-3 md:px-20 2xl:px-40 mx-auto bg-[#fcfcfc]   `">
    <Typograph variant="heading" className="text-5xl h-fit text-shadow-[#8FDDFF] text-blue-800 text-shadow-[0px_0px_5px_rgba(255,255,255,1)]  md:w-1/3 mx-auto">
      <span className="font-merriweather italic">Stories </span>That <br className="md:hidden"/> Help  Our Services <span className="font-merriweather ">Flourish </span>
    </Typograph>
    <Typograph size="sub">
      Showcasing the ideas and outcomes behind what we do. Where creativity meets purpose and performance
    </Typograph>
    <div className="hidden md:block">
      <Grid>
        {projects.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </Grid>
    </div>
    <div className="md:hidden"><CardSwiper projects={projects}  /></div>
    <div className="w-full flex justify-center mt-20">
      <Button asChild>
        <Link href="/portfolio">
          View More
        </Link>
      </Button>
    </div>
  </div >;
};

export default Services;
