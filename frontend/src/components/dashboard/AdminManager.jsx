'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  changeUserRoleAction, 
  deleteUserAction, 
  deleteAnyPostAction, 
  deleteAnyCommentAction 
} from '@/actions/admin';

export default function AdminManager({ initialUsers = [], initialPosts = [], initialComments = [], currentUserId, userRole }) {
  const [activeTab, setActiveTab] = useState(userRole === 'super_admin' ? 'users' : 'posts');
  
  // Local state for optimistic UI updates
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUserId) {
      toast.error("You cannot change your own role here.");
      return;
    }
    
    // Optimistic update
    const previousUsers = [...users];
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    
    const res = await changeUserRoleAction(userId, newRole);
    if (res.success) {
      toast.success('User role updated');
    } else {
      setUsers(previousUsers);
      toast.error(res.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      toast.error("You cannot delete yourself.");
      return;
    }

    if (!window.confirm('Delete this user? This will also delete their posts and comments.')) return;
    
    const previousUsers = [...users];
    setUsers(users.filter(u => u._id !== userId));

    const res = await deleteUserAction(userId);
    if (res.success) {
      toast.success('User deleted');
    } else {
      setUsers(previousUsers);
      toast.error(res.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    const previousPosts = [...posts];
    setPosts(posts.filter(p => p._id !== postId));

    const res = await deleteAnyPostAction(postId);
    if (res.success) {
      toast.success('Post deleted');
    } else {
      setPosts(previousPosts);
      toast.error(res.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    const previousComments = [...comments];
    setComments(comments.filter(c => c._id !== commentId));

    const res = await deleteAnyCommentAction(commentId);
    if (res.success) {
      toast.success('Comment deleted');
    } else {
      setComments(previousComments);
      toast.error(res.message);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex gap-2 mb-6 bg-muted/30 p-1.5 rounded-xl overflow-x-auto">
        {userRole === 'super_admin' && (
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('users')}
            className="gap-2 flex-1 min-w-[120px]"
          >
            <Users size={16} /> Manage Users
          </Button>
        )}
        <Button 
          variant={activeTab === 'posts' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('posts')}
          className="gap-2 flex-1 min-w-[120px]"
        >
          <FileText size={16} /> Manage Posts
        </Button>
        <Button 
          variant={activeTab === 'comments' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('comments')}
          className="gap-2 flex-1 min-w-[120px]"
        >
          <MessageSquare size={16} /> Manage Comments
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-0">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name / Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="bg-transparent border border-input rounded-md text-sm p-1.5 focus:ring-1 focus:ring-primary"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={user._id === currentUserId}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="user">User</option>
                          <option value="guest">Guest</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === currentUserId}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map(post => (
                    <tr key={post._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate">{post.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{post.author?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No posts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* COMMENTS TAB */}
          {activeTab === 'comments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Content</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comments.map(comment => (
                    <tr key={comment._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="line-clamp-2">{comment.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">On: {comment.post?.title || 'Unknown Post'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {comment.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {comments.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">No comments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
