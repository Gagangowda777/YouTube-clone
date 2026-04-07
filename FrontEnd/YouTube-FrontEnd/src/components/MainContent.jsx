import { useEffect, useState } from 'react';
import axios from 'axios';

function MainContent({ isSidebarOpen, refreshKey, onVideoClick }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname.includes('youtube.com')) {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (hostname.includes('youtu.be')) {
        const videoId = parsed.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/video/fetchvideo');
        setVideos(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [refreshKey]);

  return (
    <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Latest Videos</h1>
            <p className="text-sm text-gray-600 mt-1">Browse videos uploaded to the platform.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading videos...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
            No videos available yet. Upload one using the button in the header.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video._id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
                onClick={() => onVideoClick(video)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={video.thumbNail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x225?text=No+Thumbnail'; }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
                  <p className="text-sm text-gray-500">{video.channelName}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{video.description || 'No description provided.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{video.views ?? 0} views</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MainContent;