import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 w-full">
      <div className="w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4 leading-tight">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};


export default NotFoundPage;
