import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  linkTo?: string;
  buttonText?: string;
  onClick?: () => void;
}

const EmptyState = ({ title, description, linkTo, buttonText, onClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center text-center p-12 max-w-lg mx-auto">
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* decorative glow */}
        <div className="absolute inset-0 rounded-full bg-amber-100 blur-2xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm transition-transform duration-500 hover:scale-105">
          <img 
            src="https://media.gettyimages.com/id/974449816/video/hand-putting-empty-mug-back-on-table.jpg?s=640x640&k=20&c=Fiv5XMxxBii2OrsNC3OEJ78hZxz5ceuwXSwi7vhXknU=" 
            alt="Empty State" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 max-w-md leading-relaxed">
        {description}
      </p>
      {(linkTo || onClick) && (
        <Button linkTo={linkTo} onClick={onClick} title={buttonText || "Start Shopping"} size="sm" />
      )}
    </div>
  );
};

export default EmptyState;


