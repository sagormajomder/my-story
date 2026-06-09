'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { createPostAction, updatePostAction, deletePostAction } from '../actions';
import { toast } from 'react-hot-toast';

export default function PostManager({ initialPosts = [] }) {
  const router = useRouter();
  // We don't need fetchPosts anymore since the server passes them in
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', coverImage: '', tags: '', status: 'draft' });
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentPost({ title: '', content: '', coverImage: '', tags: '', status: 'draft' });
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setModalMode('edit');
    setCurrentPost({
      ...post,
      coverImage: post.coverImage || '',
      tags: post.tags?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const tagsArray = currentPost.tags
      ? currentPost.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const body = {
      title: currentPost.title,
      content: currentPost.content,
      coverImage: currentPost.coverImage,
      status: currentPost.status,
      tags: tagsArray,
    };

    try {
      let res;
      if (modalMode === 'create') {
        res = await createPostAction(body);
      } else {
        res = await updatePostAction(currentPost._id, body);
      }

      if (res.success) {
        toast.success(modalMode === 'create' ? 'Post created successfully!' : 'Post updated successfully!');
        closeModal();
      } else {
        if (res.errors && res.errors.length > 0) {
          const messages = res.errors.map((err) => `${err.field.replace('body.', '')}: ${err.message}`).join('\n');
          toast.error(`Validation Failed:\n${messages}`);
        } else {
          toast.error(res.message || 'Failed to save post');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await deletePostAction(id);
      if (!res.success) {
        toast.error(res.message || 'Failed to delete post');
      } else {
        toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting.');
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Posts</h2>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      {initialPosts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Plus size={24} />
            </div>
            <p className="font-medium text-foreground">No posts yet</p>
            <p className="text-sm mt-1 mb-4">Create your first story to get started.</p>
            <Button variant="outline" onClick={openCreateModal}>Create Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialPosts.map((post) => (
            <Card key={post._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.coverImage && <ImageIcon size={14} className="text-muted-foreground shrink-0" />}
                    <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {post.excerpt || post.content.replace(/(<([^>]+)>)/gi, '').slice(0, 100)}
                  </p>
                  <div className="flex gap-2">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(post)} className="gap-1">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post._id)} className="gap-1">
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 shrink-0">
              <CardTitle>{modalMode === 'create' ? 'Create New Post' : 'Edit Post'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8 rounded-full">
                <X size={18} />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave} className="flex flex-col overflow-hidden">
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Cover Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
                  <div className="flex gap-3">
                    <Input 
                      id="coverImage" 
                      type="url"
                      value={currentPost.coverImage} 
                      onChange={(e) => setCurrentPost({...currentPost, coverImage: e.target.value})} 
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    {currentPost.coverImage && (
                      <div className="w-10 h-10 rounded-md border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        <img src={currentPost.coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    value={currentPost.title} 
                    onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} 
                    required 
                    placeholder="Enter a captivating title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content <span className="text-destructive">*</span></Label>
                  <textarea 
                    id="content" 
                    className="flex min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentPost.content} 
                    onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})} 
                    required 
                    placeholder="Write your story here..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select 
                      id="status" 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={currentPost.status} 
                      onChange={(e) => setCurrentPost({...currentPost, status: e.target.value})}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input 
                      id="tags" 
                      value={currentPost.tags} 
                      onChange={(e) => setCurrentPost({...currentPost, tags: e.target.value})} 
                      placeholder="tech, lifestyle, coding"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 border-t p-4 bg-muted/20 shrink-0">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {modalMode === 'create' ? 'Publish Post' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
