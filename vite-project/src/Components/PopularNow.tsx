import WhyUS from "./WhyUS";
const PopularNow = () => {
  let list = [
    {
      details: "Euphoric",
      description:
        "After taking a sip of the rich, amber whiskey, a warm wave of euphoria spreads through the body, slowly dissolving the stress of the day.",
    },
    {
      details: "Sedative",
      description:
        "After taking a sip of the rich, amber whiskey, a warm wave of euphoria spreads through the body, slowly dissolving the stress of the day.",
    },
    {
      details: "Crafted",
      description:
        "After taking a sip of the rich, amber whiskey, a warm wave of euphoria spreads through the body, slowly dissolving the stress of the day.",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center py-10 md:py-16">
      <h1 className="font-bold text-3xl md:text-4xl md:line-clamp-2 md:w-52  pb-3 md:pb-6">
        Why Chosing Us
      </h1>
      <div className="flex md:flex-row flex-col justify-center items-center gap-12 pt-10">
        {list.map((item) => (
          <WhyUS details={item.details} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export default PopularNow;
