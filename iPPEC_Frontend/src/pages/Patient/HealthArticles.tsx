import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  BookOpen, 
  Search, 
  Filter,
  Clock,
  User,
  Heart,
  Brain,
  Activity,
  Shield,
  Pill,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: number;
  imageUrl: string;
  tags: string[];
  featured: boolean;
}

const HealthArticles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen, color: 'text-gray-600' },
    { id: 'cardiology', name: 'Heart Health', icon: Heart, color: 'text-red-500' },
    { id: 'neurology', name: 'Brain Health', icon: Brain, color: 'text-purple-500' },
    { id: 'fitness', name: 'Fitness & Exercise', icon: Activity, color: 'text-green-500' },
    { id: 'prevention', name: 'Prevention', icon: Shield, color: 'text-blue-500' },
    { id: 'medication', name: 'Medication Guide', icon: Pill, color: 'text-orange-500' },
    { id: 'vision', name: 'Eye Care', icon: Eye, color: 'text-indigo-500' }
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding Hypertension: Prevention and Management',
      excerpt: 'Learn about high blood pressure, its causes, symptoms, and effective management strategies for a healthier life.',
      content: 'Hypertension, commonly known as high blood pressure, affects millions of people worldwide...',
      category: 'cardiology',
      author: 'Dr. Sarah Johnson',
      publishedDate: '2024-01-25',
      readTime: 8,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['hypertension', 'heart health', 'prevention'],
      featured: true
    },
    {
      id: '2',
      title: 'The Importance of Regular Health Checkups',
      excerpt: 'Discover why routine medical examinations are crucial for early detection and prevention of diseases.',
      content: 'Regular health checkups are one of the most important steps you can take...',
      category: 'prevention',
      author: 'Dr. Michael Chen',
      publishedDate: '2024-01-24',
      readTime: 6,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['checkup', 'prevention', 'health screening'],
      featured: false
    },
    {
      id: '3',
      title: 'Mental Health: Breaking the Stigma',
      excerpt: 'Understanding mental health conditions and the importance of seeking help when needed.',
      content: 'Mental health is just as important as physical health...',
      category: 'neurology',
      author: 'Dr. Emily Rodriguez',
      publishedDate: '2024-01-23',
      readTime: 10,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['mental health', 'wellness', 'support'],
      featured: true
    },
    {
      id: '4',
      title: 'Exercise and Your Heart: A Perfect Partnership',
      excerpt: 'How regular physical activity strengthens your cardiovascular system and improves overall health.',
      content: 'Regular exercise is one of the best things you can do for your heart...',
      category: 'fitness',
      author: 'Dr. James Wilson',
      publishedDate: '2024-01-22',
      readTime: 7,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['exercise', 'cardiology', 'fitness'],
      featured: false
    },
    {
      id: '5',
      title: 'Understanding Your Prescription Medications',
      excerpt: 'A comprehensive guide to reading prescriptions, understanding dosages, and medication safety.',
      content: 'Understanding your medications is crucial for safe and effective treatment...',
      category: 'medication',
      author: 'Dr. Lisa Thompson',
      publishedDate: '2024-01-21',
      readTime: 12,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['medication', 'safety', 'prescription'],
      featured: false
    },
    {
      id: '6',
      title: 'Protecting Your Vision: Eye Health Essentials',
      excerpt: 'Essential tips for maintaining healthy eyes and preventing common vision problems.',
      content: 'Your eyes are precious and deserve the best care...',
      category: 'vision',
      author: 'Dr. Robert Kim',
      publishedDate: '2024-01-20',
      readTime: 9,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['vision', 'eye care', 'prevention'],
      featured: true
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  if (selectedArticle) {
    return (
      <Layout title="Health Articles">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Articles
          </button>
          
          <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-medical-100 text-medical-800">
                  {categories.find(cat => cat.id === selectedArticle.category)?.name}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedArticle.readTime} min read
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {selectedArticle.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(selectedArticle.publishedDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{selectedArticle.excerpt}</p>
                <div className="text-gray-700 leading-relaxed">
                  {selectedArticle.content}
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p className="mt-4">
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Tags:</span>
                  {selectedArticle.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Health Articles">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Articles & Tips</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest health insights, medical advice, and wellness tips from our expert healthcare professionals.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Filter by category:</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-medical-500 bg-medical-50'
                  : 'border-gray-200 hover:border-medical-300 hover:bg-medical-50'
              }`}
            >
              <category.icon className={`w-6 h-6 mx-auto mb-2 ${category.color}`} />
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'all' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Articles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-medical-100 text-medical-800">
                        Featured
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime} min
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'All Articles' : `${categories.find(cat => cat.id === selectedCategory)?.name} Articles`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or browse different categories.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HealthArticles;