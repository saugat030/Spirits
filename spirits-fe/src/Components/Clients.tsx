import { useState } from "react";
import { ClientsType } from "../types/home.types";

const Clients = (props: ClientsType) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = (text: string) => {
    return text.length > 250;
  };

  const truncateText = (text: string) => {
    if (!shouldTruncate(text)) return text;
    const limit = 250;
    const truncated = text.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  const displayText = isExpanded ? props.review : truncateText(props.review);
  const needsTruncation = shouldTruncate(props.review);

  return (
    <div className="relative bg-white/10 backdrop-blur-md p-8 min-h-[500px] min-w-[350px] max-w-sm mx-auto flex flex-col justify-between rounded-2xl border border-white/20 shadow-xl transition-all duration-300">
      <div className="flex-1 mb-6 flex flex-col min-h-0">
        <span className="text-amber-500/50 text-5xl font-serif absolute top-4 right-6">"</span>

        <div
          className={`mt-2 pr-1 flex-1 min-h-0 ${isExpanded ? "overflow-y-auto" : "overflow-hidden"
            }`}
        >
          <p className="text-lg text-slate-200 text-pretty italic leading-relaxed relative z-10">
            {displayText}
          </p>
        </div>

        <div className="mt-4 h-6">
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-amber-400 hover:text-amber-300 transition-colors duration-200 text-sm font-semibold tracking-wide uppercase"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center pt-6 border-t border-white/10">
        <figure className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-500/50">
          <img
            src={props.profileImageSrc}
            alt={`${props.name} profile`}
            className="object-cover h-full w-full"
          />
        </figure>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white leading-tight">{props.name}</h2>
          <h4 className="text-sm text-slate-300 font-medium">{props.role}</h4>
        </div>
      </div>
    </div>
  );
};

export default Clients;