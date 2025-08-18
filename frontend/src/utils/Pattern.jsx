import { useNavigate } from "react-router-dom";

const ModernCard = ({ title, description, buttonText, path }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-100/90 to-blue-500 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-sm">
          {description}
        </p>
        <button
          onClick={() => navigate(path)}
          className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ModernCard;
