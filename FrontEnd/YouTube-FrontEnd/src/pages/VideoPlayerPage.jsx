import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { AiOutlineDislike, AiFillDislike } from 'react-icons/ai';
import { IoEllipsisVertical } from 'react-icons/io5';

const VideoPlayerPage = ({ isSidebarOpen }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitingComment, setSubmittingComment] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [dislikedVideos, setDislikedVideos] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

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
    const fetchVideoAndComments = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch video details
        const videoResponse = await axios.get(`/video/fetchvideo/${videoId}`);
        setVideo(videoResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`/comment/fetchComments/${videoId}`);
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoAndComments();
    }
  }, [videoId]);

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

  const handleAddComment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await axios.post(
        `/comment/addComment/${videoId}`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.put(
        `/comment/updateComment/${commentId}`,
        { comment: editingCommentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComments(
        comments.map((c) =>
          c._id === commentId ? response.data.comment : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
      setDropdownOpen(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`/comment/deleteComment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComments(comments.filter((c) => c._id !== commentId));
      setDropdownOpen(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const toggleLike = () => {
    setLikedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
    if (dislikedVideos[videoId]) {
      setDislikedVideos((prev) => ({
        ...prev,
        [videoId]: false,
      }));
    }
  };

  const toggleDislike = () => {
    setDislikedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
    if (likedVideos[videoId]) {
      setLikedVideos((prev) => ({
        ...prev,
        [videoId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto text-gray-600">Loading video...</div>
      </main>
    );
  }

  if (error && !video) {
    return (
      <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto text-red-600">{error}</div>
      </main>
    );
  }

  if (!video) {
    return (
      <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto text-gray-600">Video not found</div>
      </main>
    );
  }

  return (
    <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Video Player */}
        <div className="mb-6 aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            src={getEmbedUrl(video.videoUrl)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{video.title}</h1>

          {/* Channel Name */}
          <p className="text-lg text-gray-600 mb-4">{video.channelName}</p>

          {/* Actions and Description */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                likedVideos[videoId]
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {likedVideos[videoId] ? (
                <AiFillLike className="text-xl" />
              ) : (
                <AiOutlineLike className="text-xl" />
              )}
              <span>Like</span>
            </button>
            <button
              onClick={toggleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                dislikedVideos[videoId]
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dislikedVideos[videoId] ? (
                <AiFillDislike className="text-xl" />
              ) : (
                <AiOutlineDislike className="text-xl" />
              )}
              <span>Dislike</span>
            </button>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {video.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>

          {/* Add Comment Form */}
          {user ? (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={submitingComment}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 pb-6 border-b border-gray-200 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline"
                >
                  sign in
                </button>
                {' '}to comment.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">{comment.userName}</p>
                      {user && user._id === comment.userId && (
                        <div className="relative" ref={dropdownOpen === comment._id ? dropdownRef : null}>
                          <button
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === comment._id ? null : comment._id
                              )
                            }
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <IoEllipsisVertical className="text-gray-500" />
                          </button>
                          {dropdownOpen === comment._id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setEditingCommentText(comment.comment);
                                  setDropdownOpen(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment._id ? (
                      <div className="mt-2">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        ></textarea>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentText('');
                            }}
                            className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              handleEditComment(comment._id)
                            }
                            className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mt-1">{comment.comment}</p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPlayerPage;
