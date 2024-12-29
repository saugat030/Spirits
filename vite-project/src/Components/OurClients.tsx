import { FaArrowAltCircleRight } from "react-icons/fa";
import Clients from "./Clients";
const OurClients = () => {
  return (
    <section>
      <div className="relative h-[900px] mt-56">
        <div className="absolute inset-0 bg-[url('src/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-[0.35] z-0"></div>
        <div className="relative z-10 flex flex-col justify-between py-20 items-center gap-8 h-full">
          <div id="headings">
            <h2 className="text-white italic text-xl text-center mb-2">
              Testimonials
            </h2>
            <h1 className="text-6xl font-semibold text-white">
              Our Happy Clients
            </h1>
          </div>
          <div className="flex w-full gap-10 justify-between container mx-auto">
            <Clients
              name="Saurav Bista"
              imgid={0}
              review="The alcohol tastes like Saugat's cum. So nostalgic , reminds me of when I used to grab his cock and go deep down inside my throat and he would jizz directly in my stomach throught the food pipe."
              role="Man Whore"
            />
            <Clients
              name="Chigga (奇加)"
              imgid={1}
              review={
                "我真的很喜欢店主和他的黑色大鸡巴。让我如此饥渴。而且我是同性恋所以喜欢喝酒。葡萄酒是同性恋者最好的饮料. 我喜欢喝酒然后吃狗肉。世界上最好的组合。喝完酒后，我开车去学校附近兜风，然后撞上了一个小孩."
              }
              role="Professional Chigga"
            />
            <Clients
              name="Madu Vaxo"
              imgid={2}
              review="I really love the alcohol specially the most expensive one since my dad pays for it all. I am so fat and alcohol makes me feell slimmer everyday. I even brush my teeth with a shot of vodka in the morning"
              role="Bau ko sampati"
            />
          </div>
          <FaArrowAltCircleRight className="text-red-500 text-6xl font-bold hover:scale-110" />
        </div>
      </div>
    </section>
  );
};

export default OurClients;
