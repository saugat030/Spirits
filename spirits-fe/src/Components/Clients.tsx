import { useState } from "react";
import { ClientsType } from "../types/home.types";

const Clients = (props: ClientsType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const arr = ["/static/Biste.png", "/static/Chigga.jpg", "/static/Madu.jpg"];

  // Function to check if text needs truncation (roughly 7 lines)
  const shouldTruncate = (text: string) => {
    return text.length > 350; // Approximate character count for 7 lines
  };

  const truncateText = (text: string) => {
    if (!shouldTruncate(text)) return text;

    // Find a good breaking point near the character limit
    const limit = 350;
    const truncated = text.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  const displayText = isExpanded ? props.review : truncateText(props.review);
  const needsTruncation = shouldTruncate(props.review);

  return (
    <div className="bg-transparent py-6 px-3 min-h-[385px] text-slate-200 border-2 lg:w-3/4 w-full flex gap-5 flex-col justify-center items-center rounded-xl">
      <div className="w-full">
        <p className="text-xl text-pretty italic leading-relaxed">
          {displayText}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium underline decoration-dotted underline-offset-2"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
      <div className="flex py-3 gap-3 justify-start w-full items-center">
        <figure className="w-20 rounded-full aspect-square overflow-hidden justify-between">
          <img
            src={arr[props.imgid]}
            alt="photo"
            className="object-cover h-full w-full "
          />
        </figure>
        <div className="flex flex-col gap-1 text-white">
          <h2 className="text-2xl">{props.name}</h2>
          <h4 className="text-lg text-slate-300">{props.role}</h4>
        </div>
      </div>
    </div>
  );
};

export default Clients;
