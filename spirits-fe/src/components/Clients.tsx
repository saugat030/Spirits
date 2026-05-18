import { ClientsType } from "../types/home.types";

const Clients = (props: ClientsType) => {
  return (
    <div className="relative bg-white/10 backdrop-blur-md p-8 h-[450px] w-full max-w-sm mx-auto flex flex-col justify-between rounded-2xl border border-white/20 shadow-xl transition-all duration-300">
      <div className="flex-1 mb-6 flex flex-col min-h-0">
        <span className="text-amber-500/50 text-5xl font-serif absolute top-4 right-6">"</span>

        <div className="mt-2 pr-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-amber-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-amber-500/70 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full">
          <p className="text-lg text-slate-200 text-pretty italic leading-relaxed relative z-10">
            {props.review}
          </p>
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