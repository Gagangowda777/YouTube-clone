import { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// main content where videos are displayed, includes category filtering and search functionality
function MainContent({ isSidebarOpen, refreshKey, onVideoClick, searchQuery }) {
  const navigate = useNavigate(); // Hook for navigation
  // state for videos, loading status, error messages, and selected category for filtering
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // defining categories for filtering videos
  const categories = ['All', 'Music', 'Gaming', 'Entertainment', 'Education', 'Sports', 'News', 'Tech', 'Vlog', 'Lifestyle', 'Food', 'Travel', 'DIY', 'Comedy', 'Other'];

  // function to get user initials for profile icon
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // fallback thumbnail in case video thumbnail fails to load
  const fallbackThumbnail = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22225%22%3E%3Crect%20width%3D%22400%22%20height%3D%22225%22%20fill%3D%22%23f3f4f6%22/%3E%3Ctext%20x%3D%22200%22%20y%3D%22112.5%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%20fill%3D%22%23999999%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Thumbnail%3C/text%3E%3C/svg%3E';

  // function to convert regular video URL to embeddable URL for iframe
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
  // effect to fetch videos from the backend API when the component mounts or when refreshKey changes 
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
    // main content area which includes category buttons and video grid
    <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
      <div className="max-w-7xl mx-auto">

        {/* category Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* video Grid */}
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
            {videos
              .filter((video) => 
                (selectedCategory === 'All' || video.category === selectedCategory) &&
                (searchQuery === '' || 
                  video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  video.channelName.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((video) => (
              <article
                key={video._id}
                className="overflow-hidden rounded-3xl bg-transparent cursor-pointer"
                onClick={() => navigate(`/video/${video._id}`)}>
                <div className="overflow-hidden rounded-3xl bg-gray-100 aspect-video">
                  <img
                    src={video.thumbNail || fallbackThumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackThumbnail}}/>
                </div>
                <div className="px-1 pb-4 pt-4">
                  <h2 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2">{video.title}</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                      {getUserInitials(video.channelName)}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{video.channelName}</p>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{video.description || 'No description provided.'}</p>
                  <div className="mt-3 text-xs text-gray-500">{video.views ?? 0} views</div>
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