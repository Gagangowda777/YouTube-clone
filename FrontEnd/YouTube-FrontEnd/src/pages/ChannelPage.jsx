import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChannelPage = ({ isSidebarOpen }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: '',
    thumbNail: '',
    description: '',
    videoUrl: '',
    category: 'Other',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{channelInfo?.channelName || user.name}'s Channel</h1>
              <p className="text-sm text-gray-500 mt-2">
                {channelInfo?.channelDescription || 'Manage your channel and edit your uploaded videos.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={channelInfo?.displayPicture || 'https://via.placeholder.com/80?text=Channel'}
                alt="Channel"
                className="h-20 w-20 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="text-sm text-gray-500">Channel owner</p>
                <p className="font-medium">{user.email}</p>
              </div>
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
          <div className="grid gap-6">
            {videos.map((video) => (
              <div key={video._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                {editingVideoId === video._id ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
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
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
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
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editValues.description}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => saveVideoDetails(video._id)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-[280px_1fr] items-center">
                    <div className="h-44 overflow-hidden rounded-3xl bg-gray-100">
                      <img
                        src={video.thumbNail || 'https://via.placeholder.com/400x225?text=No+Thumbnail'}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
                          <p className="text-sm text-gray-500 mt-1">{video.channelName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startEditing(video)}
                          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit Details
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 line-clamp-3">{video.description || 'No description available.'}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>{video.views ?? 0} views</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        <span>{video.category || 'Other'}</span>
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
