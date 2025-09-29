import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { smartToast } from '../utils/toastConfig';
import { Search, Grid, List, FolderOpen, X, ArrowUpDown } from 'lucide-react';
import GlobalFooter from './layout/GlobalFooter';
import { createCategorySlug } from '../utils/slugify';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../config/api';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive?: boolean;
  createdAt?: string;
}

const AllCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedAllCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedAllCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiCall(API_ENDPOINTS.CATEGORIES);
      const filteredCategories = data.filter((category: Category) => category.name !== 'ثيمات');
      setCategories(filteredCategories);
      localStorage.setItem('cachedAllCategories', JSON.stringify(filteredCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
      smartToast.frontend.error('حدث خطأ أثناء تحميل الفئات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    let filtered = [...categories];
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
    }
    setFilteredCategories(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);

  const CategoryCard: React.FC<{ category: Category; viewMode: 'grid' | 'list' }> = ({ category, viewMode }) => {
    const categorySlug = createCategorySlug(category.id, category.name);

    if (viewMode === 'list') {
      return (
        <Link
          to={`/category/${categorySlug}`}
          className="block bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden"
          aria-label={`استكشف فئة ${category.name}`}
        >
          <div className="flex items-center p-6 gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm rounded-2xl group-hover:blur-md transition-all duration-500"></div>
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#7a7a7a]/30">
                <img
                  src={buildImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/placeholder-category.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#7a7a7a]/50 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#18b5d8] transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-100 text-base leading-relaxed line-clamp-2">
                {category.description || 'اكتشف مجموعة متنوعة من المنتجات في هذه الفئة'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpDown className="w-4 h-4 text-white transform -rotate-90" />
              </div>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link
        to={`/category/${categorySlug}`}
        className="block bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group overflow-hidden"
        aria-label={`استكشف فئة ${category.name}`}
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm rounded-3xl group-hover:blur-md transition-all duration-500"></div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
            <img
              src={buildImageUrl(category.image)}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/placeholder-category.jpg';
              }}
            />
            <div className="absolute top-4 right-4 w-8 h-8 bg-[#7a7a7a]/50 rounded-full flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#292929]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="relative p-6">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#18b5d8] transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-gray-100 text-sm leading-relaxed line-clamp-5 mb-4">
              {category.description || 'اكتشف مجموعة متنوعة من المنتجات في هذه الفئة'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[#18b5d8] text-sm font-medium">استكشف الخدمات</span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpDown className="w-3 h-3 text-white transform -rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="min-h-screen bg-[#292929] relative overflow-hidden " dir="rtl">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292929] via-[#4a4a4a] to-[#2a2a2a] opacity-90"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '5%', left: '5%' }}>
            &lt;div className=&quot;categories&quot;&gt;
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '15%', right: '10%', animationDelay: '500ms' }}>
            function getCategories()
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ bottom: '20%', left: '15%', animationDelay: '1000ms' }}>
            const [categories, setCategories] =
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ bottom: '10%', right: '5%', animationDelay: '1500ms' }}>
            API.fetchCategories();
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '25%', left: '50%', animationDelay: '2000ms' }}>
            categories.map(category =&gt;
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '35%', right: '20%', animationDelay: '2500ms' }}>
            useState(&#123; loading: false &#125;);
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ bottom: '30%', left: '25%', animationDelay: '3000ms' }}>
            fetchData().then(res =&gt;
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '50%', left: '30%', animationDelay: '3500ms' }}>
            renderUI(component);
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ bottom: '15%', right: '15%', animationDelay: '4000ms' }}>
            &lt;RouterProvider /&gt;
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '60%', left: '20%', animationDelay: '4500ms' }}>
            const query = useQuery();
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ top: '10%', left: '70%', animationDelay: '5000ms' }}>
            useEffect(() =&gt;
          </div>
          <div className="absolute font-mono text-base text-[#7a7a7a] animate-pulse" style={{ bottom: '25%', right: '25%', animationDelay: '5500ms' }}>
            async function init()
          </div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4a4a4a]/40 to-transparent animate-pulse"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2a2a2a]/30 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#4a4a4a]/30 to-transparent animate-pulse delay-500"></div>
          <div className="absolute right-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#2a2a2a]/35 to-transparent animate-pulse delay-1500"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-[#4a4a4a]/70 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-[#2a2a2a]/80 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-[#4a4a4a]/60 rounded-full animate-ping delay-1200"></div>
          <div className="absolute bottom-60 right-20 w-1 h-1 bg-[#2a2a2a]/70 rounded-full animate-ping delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-[#4a4a4a]/90 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-80 right-1/4 w-1.5 h-1.5 bg-[#2a2a2a]/50 rounded-full animate-ping delay-1800"></div>
        </div>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-10 text-[#7a7a7a] font-mono text-base leading-6 animate-pulse">
            1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0
          </div>
          <div className="absolute top-0 left-32 text-[#7a7a7a] font-mono text-base leading-6 animate-pulse delay-500">
            0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1
          </div>
          <div className="absolute top-0 right-20 text-[#7a7a7a] font-mono text-base leading-6 animate-pulse delay-1000">
            1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1<br/>0
          </div>
          <div className="absolute top-0 right-40 text-[#7a7a7a] font-mono text-base leading-6 animate-pulse delay-1500">
            0<br/>1<br/>1<br/>0<br/>1<br/>0<br/>1<br/>1<br/>0<br/>1
          </div>
        </div>
        <div className="absolute inset-0 opacity-35">
          <div className="absolute text-[#18b5d8]/50 text-3xl animate-[float_7s_ease-in-out_infinite]" style={{ top: '5%', left: '5%' }}>
            <span role="img" aria-label="folder">📁</span>
          </div>
          <div className="absolute text-[#ffffff]/45 text-3xl animate-[float_7s_ease-in-out_infinite]" style={{ top: '15%', right: '10%', animationDelay: '600ms' }}>
            <span role="img" aria-label="category">🗂️</span>
          </div>
          <div className="absolute text-[#ffffff]/40 text-2xl animate-[glow_3.5s_ease-in-out_infinite]" style={{ top: '30%', right: '20%', animationDelay: '1200ms' }}>
            <span role="img" aria-label="organize">📋</span>
          </div>
          <div className="absolute text-[#18b5d8]/50 text-2xl animate-[float_7s_ease-in-out_infinite]" style={{ bottom: '25%', right: '15%', animationDelay: '1800ms' }}>
            <span role="img" aria-label="collection">📚</span>
          </div>
          <div className="absolute text-[#7a7a7a]/45 text-3xl animate-[glow_3.5s_ease-in-out_infinite]" style={{ top: '25%', left: '20%', animationDelay: '2400ms' }}>
            <span role="img" aria-label="folder-open">📂</span>
          </div>
          <div className="absolute text-[#7a7a7a]/50 text-4xl animate-[float_7s_ease-in-out_infinite]" style={{ bottom: '35%', left: '25%', animationDelay: '3000ms' }}>
            <span role="img" aria-label="archive">🗃️</span>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#4a4a4a]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-[#4a4a4a]/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
          <div className="absolute top-2/3 left-2/3 w-28 h-28 bg-[#4a4a4a]/12 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pulse"
             style={{
               backgroundImage: `linear-gradient(rgba(74, 74, 74, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(74, 74, 74, 0.3) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-15px) rotate(5deg) scale(1.1);
            }
          }
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(122, 122, 122, 0.3));
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 10px rgba(122, 122, 122, 0.7));
              transform: scale(1.05);
            }
          }
        `}
      </style>

<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-[80px]">        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/20 to-[#292929]/10 backdrop-blur-md border border-[#7a7a7a]/30 transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#7a7a7a]/15 to-transparent transform rotate-0 transition-all duration-700"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center transform transition-transform duration-500">
                <FolderOpen className="w-6 h-6 text-[#18b5d8] filter drop-shadow-[0_0_10px_rgba(76,255,238,0.8)]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              جميع الفئات <span className="text-[#7a7a7a]">المتاحة</span>
            </h1>
            <div className="relative w-12 h-12">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/20 to-[#292929]/10 backdrop-blur-md border border-[#7a7a7a]/30 transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#7a7a7a]/15 to-transparent transform rotate-0 transition-all duration-700"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center transform transition-transform duration-500">
                <FolderOpen className="w-6 h-6 text-[#18b5d8] filter drop-shadow-[0_0_10px_rgba(76,255,238,0.8)]" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto px-4">
            استكشف جميع فئات منتجاتنا المميزة واختر ما يناسب احتياجاتك
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="space-y-4 sm:space-y-6">
            {/* Search Bar - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 text-[#18b5d8] w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="ابحث عن الفئات..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#18b5d8] focus:border-transparent transition-all duration-300 text-white text-sm sm:text-base"
                  aria-label="البحث عن الفئات"
                />
              </div>
            </div>

            {/* Sort and View Mode - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Sort Dropdown */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#18b5d8] focus:border-transparent transition-all duration-300 text-white text-sm sm:text-base"
                  aria-label="ترتيب الفئات"
                >
                  <option value="name" className="bg-[#292929] text-white">ترتيب حسب الاسم (أ-ي)</option>
                  <option value="name-desc" className="bg-[#292929] text-white">ترتيب حسب الاسم (ي-أ)</option>
                  <option value="newest" className="bg-[#292929] text-white">الأحدث أولاً</option>
                  <option value="oldest" className="bg-[#292929] text-white">الأقدم أولاً</option>
                </select>
              </div>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-gray-100 font-semibold text-sm sm:text-base">عرض:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors duration-300 bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 ${
                    viewMode === 'grid' ? 'text-[#18b5d8] border-[#18b5d8]/60' : 'text-white hover:bg-[#7a7a7a]/40'
                  }`}
                  aria-label="عرض الشبكة"
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors duration-300 bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 ${
                    viewMode === 'list' ? 'text-[#18b5d8] border-[#18b5d8]/60' : 'text-white hover:bg-[#7a7a7a]/40'
                  }`}
                  aria-label="عرض القائمة"
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Results and Clear Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-[#7a7a7a]/30 gap-3 sm:gap-0">
              <div className="text-gray-100 text-sm sm:text-base">
                <span className="font-semibold text-[#18b5d8]">{filteredCategories.length}</span> فئة متاحة
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#7a7a7a]/30 to-[#292929]/30 backdrop-blur-sm border border-[#7a7a7a]/40 rounded-lg text-[#18b5d8] hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                  aria-label="مسح البحث"
                >
                  <span>مسح البحث</span>
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 px-4">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-[#7a7a7a]/30 rounded-full animate-spin border-t-[#18b5d8]"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">جاري التحميل...</h3>
            <p className="text-lg text-gray-100">يتم تحميل الفئات، يرجى الانتظار</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center place-items-center' 
              : 'space-y-4 sm:space-y-6'
          } w-full max-w-7xl mx-auto`}>
            {filteredCategories.map(category => (
              <div key={category.id} className="w-full max-w-sm mx-auto flex justify-center">
                <CategoryCard category={category} viewMode={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/20 to-[#292929]/10 backdrop-blur-md border border-[#7a7a7a]/30 transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#7a7a7a]/15 to-transparent transform rotate-0 transition-all duration-700"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center transform transition-transform duration-500">
                <FolderOpen className="w-10 h-10 text-[#18b5d8] filter drop-shadow-[0_0_10px_rgba(76,255,238,0.8)]" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">لا توجد فئات</h3>
            <p className="text-lg text-gray-100 mb-8 max-w-md mx-auto">
              {searchTerm
                ? 'لم نجد فئات تطابق معايير البحث. جرب تغيير كلمات البحث.'
                : 'لا توجد فئات متاحة حالياً. سيتم إضافة فئات جديدة قريباً.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7a7a7a] to-[#292929] text-white px-8 py-4 rounded-xl hover:from-[#292929] hover:to-[#7a7a7a] transition-all duration-300 font-bold text-lg backdrop-blur-sm border border-white/10 hover:scale-105 transform"
                aria-label="مسح البحث"
              >
                <span>مسح البحث</span>
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllCategories;