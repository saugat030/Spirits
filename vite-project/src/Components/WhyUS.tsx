interface WhyUsProps {
  details: string;
  description: string;
}

const WhyUS = ({ details, description }: WhyUsProps) => {
  return (
    <section className="flex flex-col h-2/3 gap-5 w-80 justify-center">
      <h2 className="text-3xl font-semibold">{details}</h2>
      <p>{description}</p>
      <a href="" className="text-amber-600">
        Load more
      </a>
    </section>
  );
};

export default WhyUS;
