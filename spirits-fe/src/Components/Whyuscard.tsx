import { MdOutlineArrowRightAlt } from "react-icons/md";
import { WhyUsProps } from "../types/home.types";

const Whyuscard = ({ details, description }: WhyUsProps) => {
  return (
    <section className="flex flex-col h-2/3 gap-5 w-80 justify-center">
      <h2 className="text-2xl font-semibold">{details}</h2>
      <p>{description}</p>
      <a href="#" className="text-amber-600 flex gap-2 items-center">
        Load more
        <MdOutlineArrowRightAlt />
      </a>
    </section>
  );
};

export default Whyuscard;
