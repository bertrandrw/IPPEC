import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Layout from '../../components/Layout/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToast } from '../../components/common/ToastContainer';
import api from '../../utils/api';

interface Article {
  id: string;
  title: string;
  content?: string;
  featuredImageUrl: string | null;
  status: 'PRIVATE' | 'PUBLIC';
  category: string | null;
  updatedAt: string;
}

interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface ArticlesResponse {
  data: {
    data: Article[];
    meta: PaginationMeta;
  };
  message: string;
  success: boolean;
}

const DoctorArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null as File | null,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const { user } = useAuth();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('error', 'Failed to upload image. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let featuredImageUrl = '';
      if (formData.image) {
        const uploadResponse = await handleImageUpload(formData.image);
        if (uploadResponse.data.success) {
          featuredImageUrl = uploadResponse.data.data.url;
        }
      }

      const articleData = {
        title: formData.title,
        content: formData.content,
        featuredImageUrl: featuredImageUrl || undefined,
        status: 'PRIVATE' as const,
      };

      let response;
      if (selectedArticle) {
        // Update existing article
        response = await api.patch(`/articles/doctor/${selectedArticle.id}`, articleData);
      } else {
        // Create new article
        response = await api.post('/articles/doctor', {
          ...articleData,
          authorId: user?.id,
        });
      }

      if (response.data.success) {
        showToast('success', response.data.message || `Article ${selectedArticle ? 'updated' : 'published'} successfully!`);
        setFormData({ title: '', content: '', image: null });
        setShowForm(false);
        setSelectedArticle(null);
        // Refresh the current page
        await fetchArticles(pagination.currentPage);
      } else {
        throw new Error(response.data.message || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      showToast('error', 'Failed to save article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get<ArticlesResponse>(`/articles/doctor/my-articles?page=${page}`);
      if (response.data.success) {
        setArticles(response.data.data.data);
        setPagination(response.data.data.meta);
      } else {
        throw new Error(response.data.message || 'Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      showToast('error', 'Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleEdit = async (article: Article) => {
    try {
      // Fetch the full article data including content
      const response = await api.get(`/articles/doctor/${article.id}`);
      if (response.data.success) {
        const fullArticle = response.data.data;
        setSelectedArticle(fullArticle);
        setFormData({
          title: fullArticle.title,
          content: fullArticle.content ?? '',
          image: null,
        });
        setShowForm(true);
      } else {
        throw new Error(response.data.message || 'Failed to fetch article details');
      }
    } catch (error: any) {
      console.error('Error fetching article details:', error);
      showToast('error', error.response?.data?.message || 'Failed to load article details. Please try again.');
    }
  };

  const handleDelete = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await api.delete(`/articles/doctor/${articleId}`);
        if (response.data.success) {
          showToast('success', response.data.message || 'Article deleted successfully!');
          // Refresh the current page after deletion
          await fetchArticles(pagination.currentPage);
        } else {
          throw new Error(response.data.message || 'Failed to delete article');
        }
      } catch (error: any) {
        console.error('Error deleting article:', error);
        showToast('error', error.response?.data?.message || 'Failed to delete article. Please try again.');
      }
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <Layout title="Health Articles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Health Articles</h1>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setSelectedArticle(null);
              setFormData({ title: '', content: '', image: null });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Write New Article
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <div className="mt-1">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={modules}
                      className="h-64"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : selectedArticle ? 'Update Article' : 'Publish Article'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-6">
          {loading && !showForm ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  {article.featuredImageUrl && (
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <div className="prose prose-sm text-gray-600 mb-4">
                      <div dangerouslySetInnerHTML={{ 
                        __html: article.content 
                          ? (article.content.length > 150 
                            ? `${article.content.substring(0, 150)}...` 
                            : article.content)
                          : ''
                      }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => fetchArticles(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchArticles(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Article count */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Articles: {pagination.totalRecords}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorArticles;
