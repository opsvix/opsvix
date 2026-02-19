import { projects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import Contact from '@/app/feature/Contact';
import CustomLayout from '@/layout/CustomLayout';
import { Typograph } from '@/ui/typograph';

export async function generateStaticParams() {
   return projects.map((project) => ({
      slug: [project.slug],
   }));
}

export default async function ProjectPage({
   params,
}: {
   params: Promise<{ slug: string[] }>;
}) {
   const { slug } = await params;

   // Handle the case where slug might be missing or empty if called directly incorrectly
   if (!slug || slug.length === 0) {
      notFound();
   }

   const currentSlug = slug[0];
   const project = projects.find((p) => p.slug === currentSlug);

   if (!project) {
      notFound();
   }

   return (
      <CustomLayout >
         <div className="w-full h-full mx-auto py-20 px-20 2xl:px-40 bg-[#fcfcfc]">
            <div className="relative w-full py-20 flex items-center justify-between gap-16">
               <div className='w-1/2 flex flex-col items-start gap-10   '>
                  <Typograph variant="heading" className="pt-0 text-start text-5xl">
                     {project.title}
                  </Typograph>
                  <div className="flex flex-wrap gap-2 w-2/3">
                     {project.services?.map((service, index) => (
                        <Label key={index} text={service} />
                     ))}
                  </div>
               </div>
               <div className='w-1/2 flex flex-col gap-5 '>
                  <Typograph className="h-fit w-full  ">
                     This project showcases our commitment to delivering high-quality digital solutions.
                     By integrating advanced technologies and user-centric design, we created a seamless experience
                     that meets the specific needs of the client and their users.
                  </Typograph>
                  <Button className="w-fit">View Website</Button>
               </div>
            </div>
            <div className='w-full h-96 relative '>
               <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover w-full h-full"
                  priority
               />
            </div>
            <div className="w-full py-20 flex flex-row jutify-between ">
               {[{ count: "10k+", title: 'Happy Clients' }, { count: "63%", title: 'Increased Efficiency' }, { count: "30%", title: 'Reduced Costs' }].map((item, index) => (
                  <div key={index} className={`w-full border-r border-gray-300 ${index === 2 ? 'border-r-0' : ''}`}>
                     <Typograph variant="heading" className='pt-0'>
                        {item.count}
                     </Typograph>
                     <Typograph variant="paragraph" className="text-center">
                        {item.title}
                     </Typograph>
                  </div>
               ))}
            </div>
            <Link href="/portfolio">back</Link>
            <div className="w-full h-screen">
               <Contact />
            </div>

         </div>
      </CustomLayout>
   );
}

// Key Featurs
// Client testurmain
// 