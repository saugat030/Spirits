const FilterSection = () => {
  return (
    <section className="w-[650px] flex flex-col gap-2 ms-5">
      <h1 className="text-3xl font-medium ml-2">Filter</h1>
      <hr className="bg-black" />
      <div
        id="Price_Section"
        className="flex flex-col gap-2 items-center ml-2 mb-2"
      >
        <h2 className="self-start">Price</h2>
        <div className="flex gap-3 w-full">
          <input
            type="number"
            placeholder="Min"
            className="w-[40%] border border-gray-400 rounded-lg p-1 "
          />
          <input
            type="number"
            placeholder="Max"
            className="w-[40%] border border-gray-400 rounded-lg p-1"
          />
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white border border-gray-600 rounded-lg px-4 py-1 self-start"
        >
          Filter
        </button>
      </div>

      <hr />
      <div className="flex flex-col gap-1 ">
        <h1 className="text-xl ml-2 mt-2">Categories</h1>
        <div className="grid grid-cols-2 gap-1 ml-2">
          <label htmlFor="Beer">
            <input type="checkbox" id="Beer" name="Beer" className="me-1" />
            Beer
          </label>

          <label htmlFor="Vodka">
            <input type="checkbox" id="Vodka" name="Vodka" className="me-1" />
            Vodka
          </label>

          <label htmlFor="Rum">
            <input type="checkbox" id="Rum" name="Rum" className="me-1" />
            Rum
          </label>

          <label htmlFor="Whiskey">
            <input
              type="checkbox"
              id="Whiskey"
              name="Whiskey"
              className="me-1"
            />
            Whiskey
          </label>
          <label htmlFor="Wine">
            <input type="checkbox" id="Wine" name="Wine" className="me-1" />
            Wine
          </label>
          <label htmlFor="Tequilla">
            <input
              type="checkbox"
              id="Tequilla"
              name="Tequilla"
              className="me-1"
            />
            Tequilla
          </label>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
