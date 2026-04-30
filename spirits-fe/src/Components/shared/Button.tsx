import { Link } from "react-router-dom";
import { MouseEvent } from "react";

export interface ButtonProps {
  title: string;
  linkTo?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}

const Button = ({
  title,
  linkTo,
  onClick,
  size = "md",
  type = "button",
}: ButtonProps) => {

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClasses = `group relative inline-flex justify-center items-center overflow-hidden rounded-full border border-orange-500/60 text-orange-500 font-semibold transition-all duration-300 hover:text-white ${sizeStyles[size]}`;
  const innerContent = (
    <>
      <span className="absolute inset-y-0 left-0 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full z-0" />
      <span className="relative z-10">{title}</span>
    </>
  );

  // if 'linkTo' is provided render a react router link
  if (linkTo) {
    return (
      <Link to={linkTo} onClick={onClick} className={baseClasses}>
        {innerContent}
      </Link>
    );
  }
// else normal button
  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {innerContent}
    </button>
  );
};

export default Button;