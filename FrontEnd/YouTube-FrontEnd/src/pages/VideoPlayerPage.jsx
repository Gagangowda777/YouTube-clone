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
  const [suggestedVideos, setSuggestedVideos] = useState([]);
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

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      try {
        const response = await axios.get('/video/fetchvideo');
        setSuggestedVideos(response.data.filter((item) => item._id !== videoId));
      } catch (err) {
        console.error('Failed to load suggested videos', err);
      }
    };

    if (videoId) {
      fetchSuggestedVideos();
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

  const fallbackThumbnail =
    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect width=%22400%22 height=%22225%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%22200%22 y=%22112.5%22 font-family=%22Arial,sans-serif%22 font-size=%2218%22 fill=%22999999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Thumbnail%3C/text%3E%3C/svg%3E';

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
      <main className={`flex-1 pt-4 sm:pt-6 px-2 sm:px-4 md:px-6 transition-all duration-300 w-full overflow-x-hidden ${isSidebarOpen ? 'md:ml-60 ml-0' : 'md:ml-20 ml-0'}`}>
        <div className="max-w-4xl mx-auto text-gray-600">Loading video...</div>
      </main>
    );
  }

  if (error && !video) {
    return (
      <main className={`flex-1 pt-4 sm:pt-6 px-2 sm:px-4 md:px-6 transition-all duration-300 w-full overflow-x-hidden ${isSidebarOpen ? 'md:ml-60 ml-0' : 'md:ml-20 ml-0'}`}>
        <div className="max-w-4xl mx-auto text-red-600">{error}</div>
      </main>
    );
  }

  if (!video) {
    return (
      <main className={`flex-1 pt-4 sm:pt-6 px-2 sm:px-4 md:px-6 transition-all duration-300 w-full overflow-x-hidden ${isSidebarOpen ? 'md:ml-60 ml-0' : 'md:ml-20 ml-0'}`}>
        <div className="max-w-4xl mx-auto text-gray-600">Video not found</div>
      </main>
    );
  }

  return (
    <main className={`flex-1 pt-4 sm:pt-6 px-2 sm:px-4 md:px-6 transition-all duration-300 w-full overflow-x-hidden ${isSidebarOpen ? 'md:ml-60 ml-0' : 'md:ml-20 ml-0'}`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="grid gap-6 lg:grid-cols-[3fr_1fr] items-start">
          <div className="space-y-6">
            {/* Video Player */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={getEmbedUrl(video.videoUrl)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="p-2">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{video.title}</h1>

              {/* Channel Name + Like/Dislike */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-4 justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 bg-blue-800">
                    {video.channelName ? video.channelName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{video.channelName}</p>
                </div>

                {/* Like & Dislike pill */}
                <div className="flex items-center rounded-full bg-gray-100 dark:bg-[#272727] overflow-hidden w-fit">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                      likedVideos[videoId]
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
                    }`}
                  >
                    {likedVideos[videoId] ? (
                      <AiFillLike className="text-xl" />
                    ) : (
                      <AiOutlineLike className="text-xl" />
                    )}
                    <span>Like</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-zinc-600 shrink-0" />
                  <button
                    onClick={toggleDislike}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                      dislikedVideos[videoId]
                        ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
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
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {video.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-6 ">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Comments</h2>

              {/* Add Comment Form */}
              {user ? (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  ></textarea>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setNewComment('')}
                      className="px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727]">
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={submitingComment}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                      {submitingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    Please{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 dark:text-blue-400 hover:underline">
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
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full shrink-0"></div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900 dark:text-gray-200">{comment.userName}</p>
                          {user && (user._id || user.id) === comment.userId && (
                            <div className="relative" ref={dropdownOpen === comment._id ? dropdownRef : null}>
                              <button
                                onClick={() =>
                                  setDropdownOpen(
                                    dropdownOpen === comment._id ? null : comment._id
                                  )
                                }
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                              >
                                <IoEllipsisVertical className="text-gray-500 dark:text-gray-400" />
                              </button>
                              {dropdownOpen === comment._id && (
                                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment._id);
                                      setEditingCommentText(comment.comment);
                                      setDropdownOpen(null);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
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
                              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            ></textarea>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentText('');
                                }}
                                className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.comment}</p>
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Videos</h2>
              </div>

              {suggestedVideos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-4 text-sm text-gray-600 dark:text-gray-400">
                  No suggested videos available.
                </div>
              ) : (
                <div className="space-y-1">
                  {suggestedVideos.slice(0, 5).map((item) => (
                    <article
                      key={item._id}
                      className="flex gap-4 rounded-3xl p-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                      onClick={() => navigate(`/video/${item._id}`)}
                    >
                      <div className="h-28 w-44 overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800 shrink-0">
                        <img
                          src={item.thumbNail || fallbackThumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackThumbnail;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">{item.channelName}</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description || 'No description.'}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default VideoPlayerPage;
