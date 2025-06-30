const Years = () => {
  return (
    <section
      id="About"
      className="flex lg:flex-row flex-col gap-20 container mx-auto lg:mt-40 mt-20 p-4 lg:p-0"
    >
      <figure className="lg:w-1/2 w-full rounded-lg shadow-md shadow-amber-900">
        <img
          src="https://images.pexels.com/photos/2796105/pexels-photo-2796105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          className="w-full rounded-md object-fill"
        />
      </figure>

      <div className="flex g:w-1/2 w-full flex-col gap-8">
        <div>
          <h6 className="italic text-red-900">Since 1996</h6>
          <h1 className="text-4xl font-semibold">Desire Meets A New Taste</h1>
        </div>
        <p className="text-justify text-lg text-slate-500 w-full lg:pr-14 pr-0">
          A small river named Duden flows by their place and supplies it with
          the necessary regelialia. It is a paradisematic country, in which
          roasted parts of sentences fly into your mouth. On her way she met a
          copy. The copy warned the Little Blind Text, that where it came from
          it would have been rewritten a thousand times and everything that was
          left from its origin would be the word "and" and the Little Blind Text
          should turn around and return to its own, safe country.
        </p>
        <h2 className="text-3xl font-medium text-red-900">
          115 Years of Experience In Business
        </h2>
      </div>
    </section>
  );
};

export default Years;
