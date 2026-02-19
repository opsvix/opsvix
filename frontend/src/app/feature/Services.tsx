
import { projects } from "@/lib/data";
import Grid from "@/components/PortfolioGrid";
import Card from "@/components/projectCard";
import { Typograph } from "@/ui/typograph";
import { Button } from "@/ui/button";


type Props = {};

const Services = (props: Props) => {
  return <div className="w-full h-full px-20 2xl:px-40 mx-auto bg-[#fcfcfc]   `">
    <Typograph variant="heading">Stories That Help <br /> Our Services Flourish</Typograph>
    <Typograph size="sub">
      Showcasing the ideas and outcomes behind what we do. Where creativity meets purpose and performance
    </Typograph>
    <Grid>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
    </Grid>
    <div className="w-full flex justify-center mt-20">
      <Button asChild>
        <a href="/portfolio">
          View More
        </a>
      </Button>
    </div>
  </div >;
};

export default Services;
