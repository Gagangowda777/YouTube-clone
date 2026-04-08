import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IoEllipsisVertical } from 'react-icons/io5';

const ChannelPage = ({ isSidebarOpen }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [editValues, setEditValues] = useState({
    title: '',
    thumbNail: '',
    description: '',
    videoUrl: '',
    category: 'Other',
  });

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchChannelData = async () => {
      setLoadingData(true);
      setError('');
      try {
        const channelResponse = await axios.get(`/channel/channelInfo/${encodeURIComponent(user.name)}`);
        setChannelInfo(channelResponse.data.channel);
      } catch (err) {
        setChannelInfo(null);
      }

      try {
        const videoResponse = await axios.get('/video/fetchvideo');
        const filteredVideos = videoResponse.data.filter((video) => {
          const channelMatch = video.channelName === user.name;
          const ownerMatch =
            video.uploadedBy === user._id ||
            video.uploadedBy === user.id ||
            video.channelName === user.name;
          return channelMatch || ownerMatch;
        });
        setVideos(filteredVideos);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load channel videos');
      } finally {
        setLoadingData(false);
      }
    };

    fetchChannelData();
  }, [user]);

  const startEditing = (video) => {
    setEditingVideoId(video._id);
    setEditValues({
      title: video.title || '',
      thumbNail: video.thumbNail || '',
      description: video.description || '',
      videoUrl: video.videoUrl || '',
      category: video.category || 'Other',
    });
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditValues({
      title: '',
      thumbNail: '',
      description: '',
      videoUrl: '',
      category: 'Other',
    });
  };

  const handleEditChange = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value,
    });
  };

  const saveVideoDetails = async (videoId) => {
    try {
      await axios.put(`/video/updateVideo/${videoId}`, editValues);
      const updatedVideos = videos.map((video) =>
        video._id === videoId ? { ...video, ...editValues } : video
      );
      setVideos(updatedVideos);
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update video');
    }
  };

  const deleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/video/deleteVideo/${videoId}`);
        setVideos(videos.filter((video) => video._id !== videoId));
        setDropdownOpen(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete video');
      }
    }
  };

  if (loading || loadingData) {
    return (
      <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
        <div className="max-w-7xl mx-auto text-gray-600">Loading channel...</div>
      </main>
    );
  }

  return (
    <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* User Initial */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-30 h-30 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                {getUserInitials(user.name)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-gray-500">
                {channelInfo?.channelDescription || 'Manage your channel and edit your uploaded videos.'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
            No videos uploaded yet. Use the header Create button to add your first video.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="rounded-3xl bg-white overflow-hidden shadow-sm">
                {editingVideoId === video._id ? (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title"
                        value={editValues.title}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        name="thumbNail"
                        value={editValues.thumbNail}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                      <input
                        name="videoUrl"
                        value={editValues.videoUrl}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={editValues.category}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        <option value="Music">Music</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Sports">Sports</option>
                        <option value="News">News</option>
                        <option value="Tech">Tech</option>
                        <option value="Vlog">Vlog</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="DIY">DIY</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editValues.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveVideoDetails(video._id)}
                        className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Video Thumbnail */}
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={video.thumbNail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4='}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === video._id ? null : video._id)}
                        className="p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                      >
                        <IoEllipsisVertical className="text-white text-lg" />
                      </button>
                      {dropdownOpen === video._id && (
                        <div ref={dropdownRef} className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              startEditing(video);
                              setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteVideo(video._id)}
                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{video.channelName}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{video.description || 'No description available.'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{video.views ?? 0} views</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ChannelPage;
