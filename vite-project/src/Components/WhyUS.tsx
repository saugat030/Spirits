import { WHYUS_DETAILS } from "../constants/homepage.constants";
import Whyuscard from "./Whyuscard";

const WhyUs = () => {
  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center py-10 mt-14 md:mt-0 md:py-16">
      <h1 className="font-bold text-3xl md:text-4xl md:line-clamp-2 md:w-52  pb-3 md:pb-6">
        Why Chosing Us
      </h1>
      <div className="flex md:flex-row flex-col justify-center items-center gap-12 pt-10">
        {WHYUS_DETAILS.map((item, index) => (
          <Whyuscard
            key={index}
            details={item.details}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
