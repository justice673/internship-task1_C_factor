import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Heart,
    PlusCircle,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    User,
    X,
    AlertTriangle
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Post } from '../../../types/index';
import { api } from '../../../services/api';

// Alert Modal Component
const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center space-x-3 text-red-600 mb-4">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 
                                 transition-colors border border-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 
                                 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Post Modal Component
const PostModal: React.FC<PostModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode
}) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setBody(initialData.body);
            setTags(initialData.tags?.join(', ') || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            title,
            body,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            userId: initialData?.userId || 1,
            reactions: initialData?.reactions || { likes: 0, dislikes: 0 },
            ...(initialData && { id: initialData.id })
        };
        onSubmit(postData);
        setTitle('');
        setBody('');
        setTags('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md shadow-xl transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-purple-500">
                            {mode === 'add' ? 'Create New Post' : 'Edit Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:text-red-500 transition-colors rounded-full
                                     hover:bg-red-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-gray-300 focus:ring-2
                                         focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter post title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full p-3 border border-gray-300 focus:ring-2
                                         focus:ring-purple-500 focus:border-transparent transition-all
                                         resize-none"
                                rows={4}
                                placeholder="Write your post content here..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full p-3 border border-gray-300 focus:ring-2
                                         focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="tag1, tag2, tag3"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white py-3 px-4
                                   hover:bg-purple-600 transition-colors duration-200 font-medium"
                        >
                            {mode === 'add' ? 'Create Post' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
    if (!post) return null;

    return (
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">User #{post.userId}</h3>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(post)}
                            className="p-2 text-gray-600 hover:text-green-500 transition-colors
                                     rounded-full hover:bg-green-50"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(post.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors
                                     rounded-full hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                    </h2>
                    <p className="text-gray-600">{post.body}</p>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                            <span
                                key={`${tag}-${index}`}
                                className="px-2 py-1 bg-purple-100 text-purple-600 text-sm rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                            <Heart className="h-5 w-5 mr-1 text-red-500" />
                            <span>{post.reactions.likes}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Heart className="h-5 w-5 mr-1 text-gray-400" />
                            <span>{post.reactions.dislikes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostsList: React.FC = () => {
    const navigate = useNavigate();
    const [apiPosts, setApiPosts] = useState<Post[]>([]);
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const postsPerPage = 10;

    // Load API posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await api.getPosts(postsPerPage, currentPage);
                setApiPosts(response.posts);
                setTotalPosts(response.total);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    // Load local posts
    useEffect(() => {
        const savedPosts = localStorage.getItem('localPosts');
        if (savedPosts) {
            setLocalPosts(JSON.parse(savedPosts));
        }
    }, []);

    // Save local posts when they change
    useEffect(() => {
        localStorage.setItem('localPosts', JSON.stringify(localPosts));
    }, [localPosts]);

    const handleAddPost = (newPost: Omit<Post, 'id'>) => {
        const post = {
            ...newPost,
            id: Date.now(),
            isLocal: true,
        } as Post;
        setLocalPosts(prevPosts => [post, ...prevPosts]);
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleUpdatePost = (updatedPost: Post) => {
        if (updatedPost.isLocal) {
            setLocalPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === updatedPost.id ? updatedPost : post
                )
            );
        } else {
            setApiPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === updatedPost.id ? updatedPost : post
                )
            );
        }
    };

    const handleDeleteClick = (id: number) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        const postToDeleteObj = localPosts.find(p => p.id === postToDelete);
        
        if (postToDeleteObj) {
            setLocalPosts(prevPosts => 
                prevPosts.filter(post => post.id !== postToDelete)
            );
        } else {
            try {
                await api.deletePost(postToDelete);
                setApiPosts(prevPosts => 
                    prevPosts.filter(post => post.id !== postToDelete)
                );
                setTotalPosts(prev => prev - 1);
            } catch (err) {
                console.error('Failed to delete post:', err);
            }
        }
        setIsDeleteModalOpen(false);
        setPostToDelete(null);
    };

    if (loading && currentPage === 1) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
                </div>
            </div>
        );
    }

    if (error && !apiPosts.length) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    // Calculate pagination
    const totalPages = Math.ceil((totalPosts + localPosts.length) / postsPerPage);
    
    // Combine and sort posts
    const allPosts = [...localPosts, ...apiPosts].sort((a, b) => {
        if (a.isLocal && !b.isLocal) return -1;
        if (!a.isLocal && b.isLocal) return 1;
        return 0;
    });

    // Get current page posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8 bg-white p-4 sm:p-6 shadow-sm">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-purple-500 hover:underline mb-4"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Dashboard
                        </button>

                        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                            <h1 className="text-2xl font-bold text-purple-500">All Posts</h1>
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                <p className="text-sm text-gray-600">
                                    Total Posts: <span className="font-medium text-purple-500">
                                        {totalPosts + localPosts.length}
                                    </span>
                                </p>
                                <button
                                    onClick={() => {
                                        setModalMode('add');
                                        setEditingPost(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                                           px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 
                                           transition-colors duration-200"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    Create New Post
                                </button>
                            </div>
                        </div>
                    </div>

                    <PostModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingPost(null);
                        }}
                        onSubmit={modalMode === 'add' ? handleAddPost : handleUpdatePost}
                        initialData={editingPost}
                        mode={modalMode}
                    />

                    <AlertModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setPostToDelete(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Post"
                        message="Are you sure you want to delete this post? This action cannot be undone."
                    />

                    <div className="space-y-6">
                        {currentPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onEdit={handleEditPost}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>

                    {currentPosts.length > 0 && (
                        <div className="mt-8 flex items-center justify-between bg-white px-4 py-3 
                                      shadow-sm rounded-lg">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 text-sm 
                                           font-medium text-gray-700 bg-white border border-gray-300 
                                           hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm 
                                           font-medium text-gray-700 bg-white border border-gray-300 
                                           hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {Math.min((currentPage - 1) * postsPerPage + 1, 
                                                     totalPosts + localPosts.length)}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * postsPerPage, 
                                                     totalPosts + localPosts.length)}
                                        </span>{' '}
                                        of <span className="font-medium">{totalPosts + localPosts.length}</span> results
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-3 py-2 text-sm 
                                               font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
                                               hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage >= totalPages}
                                        className="relative inline-flex items-center px-3 py-2 text-sm 
                                               font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
                                               hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostsList;
