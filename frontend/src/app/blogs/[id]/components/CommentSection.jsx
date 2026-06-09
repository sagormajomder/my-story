'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, MessageSquare, User } from 'lucide-react';
import { createCommentAction, deleteCommentAction } from '../actions';
import { toast } from 'react-hot-toast';

export default function CommentSection({ postId, postAuthorId, initialComments = [], currentUser }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Optimistic UI updates
  const [comments, setComments] = useState(initialComments);

  // Check if user is allowed to comment
  const canComment = currentUser && currentUser.role !== 'guest';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const res = await createCommentAction(postId, content);
    setIsSubmitting(false);

    if (res.success) {
      setContent('');
      // Optimistically add to top
      setComments([res.data, ...comments]);
      toast.success('Comment posted successfully');
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    // Optimistically remove from UI
    const previousComments = [...comments];
    setComments(comments.filter(c => c._id !== commentId));

    const res = await deleteCommentAction(commentId, postId);
    if (!res.success) {
      // Revert on failure
      setComments(previousComments);
      toast.error(res.message);
    } else {
      toast.success('Comment deleted');
    }
  };

  const canDelete = (commentAuthorId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin' || currentUser.role === 'moderator') return true;
    if (currentUser.userId === commentAuthorId) return true;
    if (currentUser.userId === postAuthorId) return true; // Post owner can delete comments
    return false;
  };

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="text-primary" />
        <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Input Box */}
      {canComment ? (
        <Card className="mb-10 bg-muted/20 border-border">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-y"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{content.length}/500</span>
                <Button type="submit" disabled={isSubmitting || !content.trim()}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Comment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-10 bg-muted/20 border-border">
          <CardContent className="p-6 text-center text-muted-foreground">
            {currentUser && currentUser.role === 'guest'
              ? 'Guest users cannot post comments.'
              : 'Please log in to share your thoughts.'}
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {comment.author?.name?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="bg-muted/40 border border-border/50 rounded-2xl rounded-tl-none p-4 relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.author?.name || 'Unknown User'}</span>
                    {comment.author?.role === 'super_admin' && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
                    )}
                    {comment.author?.role === 'moderator' && (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Mod</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                {/* Delete Button */}
                {canDelete(comment.author?._id || comment.author) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="absolute -right-2 -top-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-105"
                    title="Delete Comment"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}
