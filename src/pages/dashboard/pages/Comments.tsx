import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlusCircle,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Link as LinkIcon
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Comment } from '../../../types';
import { api } from '../../../services/api';

interface CommentCardProps {
  comment: Comment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{comment.user.username}</h3>
              <p className="text-sm text-gray-500">User ID: {comment.user.id}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(comment.id)}
              className="p-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600">{comment.body}</p>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <LinkIcon className="h-4 w-4 mr-1" />
          <span>Related to Post #{comment.postId}</span>
        </div>
      </div>
    </div>
  );
};

const CommentsList: React.FC = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const commentsPerPage = 10;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.getComments(commentsPerPage, currentPage);
        setComments(response.comments);
        setTotalComments(response.total);
      } catch (err) {
        setError('Failed to fetch comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentPage]);

  const handleEditComment = (id: number) => {
    console.log('Edit comment:', id);
    // Implement edit functionality
  };

  const handleDeleteComment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.deleteComment(id);
        setComments(comments.filter(comment => comment.id !== id));
        setTotalComments(prev => prev - 1);
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

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

  const totalPages = Math.ceil(totalComments / commentsPerPage);

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
              <h1 className="text-2xl font-bold text-purple-500">All Comments</h1>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <p className="text-sm text-gray-600">
                  Total Comments: <span className="font-medium text-purple-500">{totalComments}</span>
                </p>
                <button
                  onClick={() => navigate('/comments/new')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                           px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 
                           transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add New Comment
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

          {comments.length > 0 && (
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
                      {Math.min((currentPage - 1) * commentsPerPage + 1, totalComments)}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * commentsPerPage, totalComments)}
                    </span>{' '}
                    of <span className="font-medium">{totalComments}</span> results
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

export default CommentsList;
