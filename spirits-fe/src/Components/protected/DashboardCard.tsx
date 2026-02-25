import { ReactNode } from "react";
type DashboardCardType = {
  price: number;
  title: string;
  primaryicon: ReactNode;
  secondaryicon: ReactNode;
};
const DashboardCard = (props: DashboardCardType) => {
  return (
    <div className="rounded-2xl border-2 bg-[#f3eae5] p-6 w-[320px] shadow-sm hover:border-purple-400 transition-colors duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div>{props.primaryicon}</div>
        <p className="text-gray-500 font-semibold">{props.title}</p>
      </div>
      <h2 className="text-3xl font-semibold text-black mb-6">
        $ {props.price}
      </h2>
      <div className="flex items-center gap-1 text-sm text-green-500">
        {props.secondaryicon}
        <span>10% increase from last month</span>
      </div>
    </div>
  );
};

export default DashboardCard;
