import { ClientsType } from "../types/home.types";

const Clients = (props: ClientsType) => {
  const arr = ["/static/Biste.png", "/static/Chigga.jpg", "/static/Madu.jpg"];
  return (
    <div className="bg-transparent py-6 px-3 text-slate-200 h-full border-2 lg:w-3/4 w-full flex gap-5 flex-col justify-center items-center rounded-xl">
      <p className="text-xl text-pretty italic">{props.review}</p>
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
