import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  BookOpen, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  lastModified: string;
  imageUrl: string;
  readTime: number;
  isPublished: boolean;
  views: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
}

const AdminArticles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const articles: Article[] = [
    {
      id: 'ART001',
      title: 'Understanding Hypertension: Prevention and Management',
      content: 'Hypertension, commonly known as high blood pressure, affects millions of people worldwide...',
      summary: 'Learn about high blood pressure, its causes, symptoms, and effective management strategies.',
      category: 'Cardiovascular Health',
      tags: ['hypertension', 'heart health', 'prevention', 'lifestyle'],
      author: 'Dr. Sarah Johnson',
      publishedDate: '2024-01-25',
      lastModified: '2024-01-25',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: 8,
      isPublished: true,
      views: 1247,
      likes: 89,
      status: 'published'
    },
    {
      id: 'ART002',
      title: 'The Importance of Regular Health Checkups',
      content: 'Regular health checkups are one of the most important steps you can take...',
      summary: 'Discover why routine medical examinations are crucial for early detection and prevention.',
      category: 'Preventive Care',
      tags: ['checkup', 'prevention', 'health screening', 'wellness'],
      author: 'Dr. Michael Chen',
      publishedDate: '2024-01-24',
      lastModified: '2024-01-24',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: 6,
      isPublished: true,
      views: 892,
      likes: 67,
      status: 'published'
    },
    {
      id: 'ART003',
      title: 'Mental Health: Breaking the Stigma',
      content: 'Mental health is just as important as physical health...',
      summary: 'Understanding mental health conditions and the importance of seeking help.',
      category: 'Mental Health',
      tags: ['mental health', 'wellness', 'support', 'awareness'],
      author: 'Dr. Emily Rodriguez',
      publishedDate: '',
      lastModified: '2024-01-26',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: 10,
      isPublished: false,
      views: 0,
      likes: 0,
      status: 'draft'
    },
    {
      id: 'ART004',
      title: 'Exercise and Your Heart: A Perfect Partnership',
      content: 'Regular exercise is one of the best things you can do for your heart...',
      summary: 'How regular physical activity strengthens your cardiovascular system.',
      category: 'Fitness & Exercise',
      tags: ['exercise', 'cardiology', 'fitness', 'heart health'],
      author: 'Dr. James Wilson',
      publishedDate: '2024-01-22',
      lastModified: '2024-01-23',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: 7,
      isPublished: true,
      views: 1156,
      likes: 94,
      status: 'published'
    }
  ];

  const categories = [
    'Cardiovascular Health', 'Mental Health', 'Preventive Care', 'Fitness & Exercise',
    'Nutrition', 'Diabetes Care', 'Women\'s Health', 'Men\'s Health', 'Pediatric Care'
  ];

  const getStatusIcon = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'archived':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const articleStats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((sum, article) => sum + article.views, 0),
    totalLikes: articles.reduce((sum, article) => sum + article.likes, 0)
  };

  if (showEditor || selectedArticle) {
    return (
      <Layout title={showEditor ? "Article Editor" : "Article Details"}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setShowEditor(false);
              setSelectedArticle(null);
            }}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Articles
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {showEditor ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Article</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                      placeholder="Enter article title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none">
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                      placeholder="Author name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                    placeholder="Brief summary of the article..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                    placeholder="Write your article content here..."
                  />
                </div>

                <div className="flex justify-between">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Save as Draft
                  </button>
                  <button className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                    Publish Article
                  </button>
                </div>
              </div>
            ) : selectedArticle && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h1>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedArticle.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedArticle.status)}`}>
                      {selectedArticle.status.charAt(0).toUpperCase() + selectedArticle.status.slice(1)}
                    </span>
                  </div>
                </div>

                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium">{selectedArticle.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedArticle.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Read Time</p>
                    <p className="font-medium">{selectedArticle.readTime} minutes</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700">{selectedArticle.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedArticle.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Likes</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedArticle.likes.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                    Edit Article
                  </button>
                  {selectedArticle.status === 'draft' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Publish
                    </button>
                  )}
                  {selectedArticle.status === 'published' && (
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                      Unpublish
                    </button>
                  )}
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Health Articles Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Articles Management</h2>
            <p className="text-gray-600 mt-1">Create and manage health content for patients</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{articleStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{articleStats.published}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{articleStats.drafts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{articleStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{articleStats.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(article.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.summary}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime} min
                  </div>
                </div>

                {article.isPublished && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {article.likes} likes
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Not published'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedArticle(article);
                      }}
                      className="p-1 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new article.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminArticles;