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
    <div className="h-[400px] flex justify-evenly items-center">
      <h1 className="font-bold text-4xl line-clamp-2 w-52 pb-6">
        Why Chosing Us
      </h1>
      <div className="flex gap-12 pt-10">
        {list.map((item) => (
          <WhyUS details={item.details} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export default PopularNow;
