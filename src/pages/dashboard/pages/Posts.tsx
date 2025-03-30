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
    User
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Post } from '../../../types/index';
import { api } from '../../../services/api';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    if (!post) return null;

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Edit post:', post.id);
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Delete post:', post.id);
    };

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
                            onClick={handleEdit}
                            className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
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
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await api.getPosts(postsPerPage);
                setPosts(response.posts);
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

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
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
                                    Total Posts: <span className="font-medium text-purple-500">{totalPosts}</span>
                                </p>
                                <button
                                    onClick={() => navigate('/posts/new')}
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

                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {posts.length > 0 && (
                        <div className="mt-8 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium 
                           text-gray-700 bg-white border border-gray-300  
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
                                            {Math.min((currentPage - 1) * postsPerPage + 1, totalPosts)}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * postsPerPage, totalPosts)}
                                        </span>{' '}
                                        of <span className="font-medium">{totalPosts}</span> results
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
