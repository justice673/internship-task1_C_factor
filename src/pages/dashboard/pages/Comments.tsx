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
  Link as LinkIcon,
  X,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Comment } from '../../../types';
import { api } from '../../../services/api';

interface CommentCardProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onDelete: (id: number) => void;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: Omit<Comment, 'id'> | Comment) => void;
  initialData?: Comment;
  mode: 'add' | 'edit';
}

// Alert Modal Component
const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
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
            className="px-4 py-2 bg-red-600 text-white
                     hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Comment Modal Component (for both Add and Edit)
const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [commentBody, setCommentBody] = useState('');
  const [postId, setPostId] = useState('');

  useEffect(() => {
    if (initialData) {
      setCommentBody(initialData.body);
      setPostId(initialData.postId.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commentData = {
      body: commentBody,
      postId: parseInt(postId),
      user: initialData?.user || {
        id: Math.floor(Math.random() * 1000),
        username: 'Current User'
      },
      ...(initialData && { id: initialData.id })
    };
    onSubmit(commentData);
    setCommentBody('');
    setPostId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md shadow-xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-500">
              {mode === 'add' ? 'Add New Comment' : 'Edit Comment'}
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
                Comment
              </label>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="w-full p-3 border border-gray-300 focus:ring-2
                         focus:ring-purple-500 focus:border-transparent transition-all
                         resize-none"
                rows={4}
                placeholder="Write your comment here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post ID
              </label>
              <input
                type="number"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="w-full p-3 border border-gray-300 focus:ring-2
                         focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter post ID"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 px-4
                       hover:bg-purple-600 transition-colors duration-200 font-medium"
            >
              {mode === 'add' ? 'Add Comment' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommentCard: React.FC<CommentCardProps> = ({ comment, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ">
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
              onClick={() => onEdit(comment)}
              className="p-2 text-gray-600 hover:text-green-500 transition-colors
                       rounded-full hover:bg-green-50"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors
                       rounded-full hover:bg-red-50"
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
  const [apiComments, setApiComments] = useState<Comment[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const commentsPerPage = 10;

  // Load API comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.getComments(commentsPerPage, currentPage);
        setApiComments(response.comments);
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

  // Load local comments
  useEffect(() => {
    const savedComments = localStorage.getItem('localComments');
    if (savedComments) {
      setLocalComments(JSON.parse(savedComments));
    }
  }, []);

  // Save local comments when they change
  useEffect(() => {
    localStorage.setItem('localComments', JSON.stringify(localComments));
  }, [localComments]);

  const handleAddComment = (newComment: Omit<Comment, 'id'>) => {
    const comment = {
      ...newComment,
      id: Date.now(),
      isLocal: true,
    } as Comment;
    setLocalComments(prevComments => [comment, ...prevComments]);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUpdateComment = (updatedComment: Comment) => {
    if (updatedComment.isLocal) {
      setLocalComments(prevComments =>
        prevComments.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    } else {
      setApiComments(prevComments =>
        prevComments.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    }
  };

  const handleDeleteClick = (id: number) => {
    setCommentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    const commentToDeleteObj = localComments.find(c => c.id === commentToDelete);
    
    if (commentToDeleteObj) {
      setLocalComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentToDelete)
      );
    } else {
      try {
        await api.deleteComment(commentToDelete);
        setApiComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentToDelete)
        );
        setTotalComments(prev => prev - 1);
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
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

  if (error && !apiComments.length) {
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
  const totalPages = Math.ceil((totalComments + localComments.length) / commentsPerPage);
  
  // Combine and sort comments
  const allComments = [...localComments, ...apiComments].sort((a, b) => {
    if (a.isLocal && !b.isLocal) return -1;
    if (!a.isLocal && b.isLocal) return 1;
    return 0;
  });

  // Get current page comments
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 bg-white p-4 sm:p-6 shadow-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-purple-500 hover:underline 
                       transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-purple-500">All Comments</h1>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <p className="text-sm text-gray-600">
                  Total Comments: <span className="font-medium text-purple-500">
                    {totalComments + localComments.length}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setEditingComment(null);
                    setIsModalOpen(true);
                  }}
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

          <CommentModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingComment(null);
            }}
            onSubmit={modalMode === 'add' ? handleAddComment : handleUpdateComment}
            initialData={editingComment}
            mode={modalMode}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setCommentToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Comment"
            message="Are you sure you want to delete this comment? This action cannot be undone."
          />

          {loading && currentPage > 1 && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          )}

          <div className="space-y-6">
            {currentComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {currentComments.length > 0 && (
            <div className="mt-8 flex items-center justify-between bg-white px-4 py-3 
                          shadow-sm rounded-lg">
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
                      {Math.min((currentPage - 1) * commentsPerPage + 1, totalComments + localComments.length)}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * commentsPerPage, totalComments + localComments.length)}
                    </span>{' '}
                    of <span className="font-medium">{totalComments + localComments.length}</span> results
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