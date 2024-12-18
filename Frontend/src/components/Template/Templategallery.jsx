import React, { useContext, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MyContext from "@/Context/MyContext";

const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/blank-document.svg",
  },
  {
    id: "business",
    label: "Business Letter",
    imageUrl: "/business-letter.svg",
  },
  {
    id: "cover",
    label: "Cover Letter",
    imageUrl: "/cover-letter.svg",
  },
  {
    id: "project",
    label: "Project Proposol",
    imageUrl: "/project-proposal.svg",
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
  },
  {
    id: "softwareP",
    label: "Software Proposol",
    imageUrl: "/software-proposal.svg",
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
  },
];

const Templategallery = () => {
  const [isCreating, setIsCreating] = useState(false);
  const naviagte = useNavigate();
  const { endPoint, token, user } = useContext(MyContext);

  const createDocument = async () => {
    setIsCreating(true);
    const newDocId = uuidv4();
    try {
      const response = await axios.post(
        `${endPoint}/api/document/createDocument`,
        {
          doc_id: newDocId,
          content: "Start documenting....",
          ownerId: user?._id,
          ownerName: user?.name,
          ownerEmail: user?.email,
          doc_title: "Untitled Document",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        naviagte(`/document/${response.data.doc_id}`);
      } else {
        console.log("error");
      }
      setIsCreating(false);
    } catch (error) {
      console.log(error);
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-[#f1f3f4]">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h3 className="font-medium"> Start a new document</h3>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285%] pl-4"
              >
                <div
                  onClick={createDocument}
                  className={`aspect-[3/4] flex flex-col gap-y-3 ${
                    isCreating && "pointer-events-none opacity-50"
                  }`}
                >
                  <button
                    disabled={isCreating}
                    onClick={() => {}}
                    style={{
                      backgroundImage: `url(${template.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                  ></button>
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default Templategallery;
