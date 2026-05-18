import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  buttonText?: string;
}

const ErrorState = ({
  title = "Oops! A bit of a spill.",
  message = "It looks like we've encountered a technical hiccup.",
  onRetry,
  buttonText = "Try Again",
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center text-center p-12 max-w-lg mx-auto">
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* decorative glow */}
        <div className="absolute inset-0 rounded-full bg-red-100 blur-2xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm transition-transform duration-500 hover:scale-105">
          <img
            src="/spilling-error.gif"
            alt="Error State"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-red-500 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} title={buttonText} size="sm" />
      )}
    </div>
  );
};

export default ErrorState;


