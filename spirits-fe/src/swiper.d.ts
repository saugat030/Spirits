// swiper.d.ts (or your custom .d.ts file)
declare module "swiper/css" {
  const content: any;
  export default content;
}

declare module "swiper/css/*" {
  const content: any;
  export default content;
}
