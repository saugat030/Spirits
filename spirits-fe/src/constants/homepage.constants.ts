export const DROPDOWN_CONSTANTS = [
  { label: "Whiskey", link: "/products?type=Whiskey" },
  { label: "Vodka", link: "/products?type=Vodka" },
  { label: "Beer", link: "/products?type=Beer" },
  { label: "Wine", link: "/products?type=Wine" },
  { label: "Rum", link: "/products?type=Rum" },
  { label: "Tequilla", link: "/products?type=Tequilla" },
];

export const WHYUS_DETAILS = [
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

const REVIEW_IMAGES = [
  "/static/Biste.png",
  "/static/Chigga.jpg",
  "/static/Madu.jpg",
] as const;

export const REVIEWS = [
  {
    name: "Saurav Bista",
    profileImageSrc: REVIEW_IMAGES[0],
    review:
      "This shop has an incredible variety of wines, beers, and spirits, ranging from popular brands to rare finds. The staff is always welcoming and extremely knowledgeable, offering great recommendations tailored to my taste and budget. Highly recommend this gem to anyone looking for quality and excellent service!",
    role: "Technical Writer and SEO",
  },
  {
    name: "Chigga (奇加)",
    profileImageSrc: REVIEW_IMAGES[1],
    review:
      "I’ve been shopping here for years, and it never disappoints. Whether I need a fine wine for a dinner party or craft beer for a casual night, they always have the perfect options. The store is clean, well-organized, and the staff is friendly and approachable. Plus, their seasonal specials are fantastic. Definitely the best liquor store in town!",
    role: "Professional Footballer",
  },
  {
    name: "Madu Vaxo",
    profileImageSrc: REVIEW_IMAGES[2],
    review:
      "This is hands down my favorite alcohol shop. Not only do they offer an impressive selection of products, but their customer service is what truly sets them apart. The staff is always eager to help, whether it’s finding the perfect gift or suggesting a new spirit to try.",
    role: "Land Lord",
  },
  {
    name: "Ramesh Thapa",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "I have been buying from this shop for a while now and the experience has always been great. The variety of drinks they offer is amazing and everything is always well organized and easy to find.",
    role: "Restaurant Owner",
  },
  {
    name: "Sita Koirala",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "What I love most about this store is the friendly atmosphere. The team really knows their products and always recommends something interesting whenever I visit.",
    role: "Event Planner",
  },
  {
    name: "Amit Shrestha",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "Great place to find both popular brands and some unique bottles you don't see everywhere. The prices are fair and the staff are super helpful.",
    role: "Business Owner",
  },
  {
    name: "Nabin Gurung",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "I usually buy drinks for small gatherings and this shop never disappoints. Their recommendations have introduced me to some really good spirits.",
    role: "Hotel Manager",
  },
  {
    name: "Priya Basnet",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "Very reliable shop with a wide selection. Whenever I need something for a celebration or a gift, I know I will find the perfect bottle here.",
    role: "Marketing Manager",
  },
  {
    name: "Bikash Lama",
    profileImageSrc: "/static/placeholder-image.png",
    review:
      "Excellent service and a great collection of beverages. The staff always takes the time to explain different options which makes the whole experience enjoyable.",
    role: "Bar Supervisor",
  },

];
