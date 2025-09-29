import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { smartToast } from '../../utils/toastConfig';
import { apiCall, API_ENDPOINTS, buildApiUrl, buildImageUrl } from '../../config/api';

interface Product {
  id: number;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  productType?: 'product' | 'theme';
  mainImage: string;
  detailedImages: string[];
  isActive?: boolean;
  faqs?: { question: string; answer: string }[];
  addOns?: { name: string; price: number; description?: string }[];
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    originalPrice: 0,
    isAvailable: true,
    categoryId: null as number | null,
    productType: 'product' as 'product' | 'theme',
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [addOns, setAddOns] = useState<{ name: string; price: number; description?: string }[]>([]);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [detailedImageFiles, setDetailedImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [existingDetailedImages, setExistingDetailedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const isEditing = !!product;

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      
      if (product) {
        setFormData({
          name: product.name,
          shortDescription: product.shortDescription || '',
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          isAvailable: product.isAvailable,
          categoryId: product.categoryId,
          productType: product.productType || 'product',
          isActive: product.isActive !== undefined ? product.isActive : true,
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || ''
        });
        setFaqs(product.faqs || []);
        setAddOns(product.addOns || []);
        if (product.mainImage) {
          setMainImagePreview(buildImageUrl(product.mainImage));
        }
        setExistingDetailedImages(product.detailedImages || []);
      } else {
        setFormData({
          name: '',
          shortDescription: '',
          description: '',
          price: 0,
          originalPrice: 0,
          isAvailable: true,
          categoryId: null,
          productType: 'product',
          isActive: true,
          seoTitle: '',
          seoDescription: '',
          metaTitle: '',
          metaDescription: ''
        });
        setFaqs([]);
        setAddOns([]);
        setMainImagePreview('');
      }
      
      setMainImageFile(null);
      setDetailedImageFiles([]);
      setExistingDetailedImages([]);
      setErrors({});
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await apiCall(API_ENDPOINTS.CATEGORIES, {
        method: 'GET'
      });
      console.log('Categories response:', response);
      // الخادم الخلفي يعيد البيانات مباشرة كـ array وليس في شكل {success, data}
      if (Array.isArray(response)) {
        console.log('Categories data:', response);
        setCategories(response);
      } else if (response.success && response.data) {
        console.log('Categories data:', response.data);
        setCategories(response.data);
      } else {
        console.error('Failed to fetch categories:', response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'categoryId'
        ? (value === '' ? (name === 'categoryId' ? null : 0) : Number(value))
        : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setMainImageFile(compressedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setMainImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setMainImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setMainImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDetailedImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const compressedFiles = await Promise.all(
      files.map(file => compressImage(file, 800, 0.7))
    );
    setDetailedImageFiles(prev => [...prev, ...compressedFiles]);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file, 800, 0.7))
      );
      setDetailedImageFiles(prev => [...prev, ...compressedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeDetailedImage = (index: number) => {
    setDetailedImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingDetailedImage = (index: number) => {
    setExistingDetailedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم الخدمة مطلوب';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر';
    }
    
    // isAvailable validation is handled by radio buttons, no additional validation needed
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'التصنيف مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      if (formData.originalPrice) {
        formDataToSend.append('originalPrice', formData.originalPrice.toString());
      }
      formDataToSend.append('isAvailable', formData.isAvailable.toString());
      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId.toString());
      }
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('seoTitle', formData.seoTitle);
      formDataToSend.append('seoDescription', formData.seoDescription);
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaDescription', formData.metaDescription);
      
      if (faqs.length > 0) {
        formDataToSend.append('faqs', JSON.stringify(faqs));
      }
      
      if (addOns.length > 0) {
        formDataToSend.append('addOns', JSON.stringify(addOns));
      }

      if (mainImageFile) {
        formDataToSend.append('mainImage', mainImageFile);
      }
      
      if (detailedImageFiles.length > 0) {
        detailedImageFiles.forEach((file, index) => {
          formDataToSend.append(`detailedImages`, file);
        });
      }

      const endpoint = isEditing
        ? API_ENDPOINTS.PRODUCT_BY_ID(product!.id.toString())
        : API_ENDPOINTS.PRODUCTS;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await apiCall(endpoint, {
        method,
        body: formDataToSend
      });
      
      // Check if response contains product data (successful creation/update)
      if (response && (response.id || response._id)) {
        smartToast.dashboard.success(isEditing ? 'تم تحديث الخدمة بنجاح' : 'تم إضافة الخدمة بنجاح');
        onSuccess();
        handleClose();
      } else {
        smartToast.dashboard.error(response.message || 'حدث خطأ أثناء حفظ الخدمة');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      smartToast.dashboard.error('حدث خطأ أثناء حفظ الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديد'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                المعلومات الأساسية
              </h3>
              
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم الخدمة *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="أدخل اسم الخدمة..."
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وصف مختصر
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                    placeholder="أدخل وصف مختصر للخدمة..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وصف كامل
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                    placeholder="أدخل وصف تفصيلي للخدمة..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    التصنيف *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>

                

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      السعر الحالي (ر.س) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أدخل السعر"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">ر.س</span>
                      </div>
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      السعر قبل الخصم (ر.س)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        placeholder="السعر الأصلي (اختياري)"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">ر.س</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      حالة التوفر *
                    </label>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="isAvailable"
                          checked={formData.isAvailable === true}
                          onChange={() => setFormData(prev => ({ ...prev, isAvailable: true }))}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 focus:ring-2"
                        />
                        <span className="mr-2 text-sm font-medium text-green-700">متوفر</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="isAvailable"
                          checked={formData.isAvailable === false}
                          onChange={() => setFormData(prev => ({ ...prev, isAvailable: false }))}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <span className="mr-2 text-sm font-medium text-red-700">غير متوفر</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    حالة الخدمة
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === true}
                        onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">مفعل</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === false}
                        onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">غير مفعل</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm ml-3">📷</span>
                صور الخدمة
              </h3>
              
              <div className="space-y-6">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الصورة الرئيسية
                    <span className="text-xs text-gray-500 mr-2">(يمكن السحب والإفلات)</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      const files = Array.from(e.dataTransfer.files);
                      if (files.length > 0 && files[0].type.startsWith('image/')) {
                        handleMainImageChange({ target: { files } } as any);
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      onChange={handleMainImageChange}
                      accept="image/*"
                      className="hidden"
                      id="mainImage"
                    />
                    <label htmlFor="mainImage" className="cursor-pointer">
                      {mainImagePreview || mainImageFile ? (
                        <div className="space-y-2">
                          <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-gray-300 group relative">
                            <img
                              src={mainImageFile 
                                ? URL.createObjectURL(mainImageFile) 
                                : mainImagePreview
                              }
                              alt="صورة رئيسية"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMainImageFile(null);
                                setMainImagePreview('');
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                              title="حذف الصورة"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                              رئيسية
                            </div>
                            {mainImageFile && (
                              <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                                {(mainImageFile.size / 1024).toFixed(0)}KB
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 font-semibold">اضغط لتغيير الصورة</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center transition-colors ${
                            dragActive ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <ImageIcon className={`w-8 h-8 transition-colors ${
                              dragActive ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <p className={`font-semibold transition-colors ${
                            dragActive ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {dragActive ? 'اتركها هنا' : 'اضغط أو اسحب الصورة الرئيسية'}
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG أو JPEG</p>
                          <p className="text-xs text-gray-400">
                            سيتم ضغط الصورة تلقائياً لتحسين الأداء
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Detailed Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صور تفصيلية
                    <span className="text-xs text-gray-500 mr-2">(يمكن السحب والإفلات)</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      onChange={handleDetailedImagesChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="detailedImages"
                    />
                    <label htmlFor="detailedImages" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center transition-colors ${
                          dragActive ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Upload className={`w-8 h-8 transition-colors ${
                            dragActive ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <p className={`font-semibold transition-colors ${
                          dragActive ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {dragActive ? 'اتركها هنا' : 'اضغط أو اسحب الصور هنا'}
                        </p>
                        <p className="text-sm text-gray-500">
                          يمكن اختيار عدة صور • PNG, JPG, JPEG
                        </p>
                        <p className="text-xs text-gray-400">
                          سيتم ضغط الصور تلقائياً لتحسين الأداء
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Preview Images */}
                  {(detailedImageFiles.length > 0 || existingDetailedImages.length > 0) && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700">
                          الصور المختارة ({detailedImageFiles.length + existingDetailedImages.length})
                        </p>
                        <p className="text-xs text-gray-500">
                          اضغط على × لحذف الصورة
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {/* Existing Images */}
                        {existingDetailedImages.map((image, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                              <img
                                src={buildImageUrl(image)}
                                alt={`صورة موجودة ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingDetailedImage(index)}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                              title="حذف الصورة"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              موجودة
                            </div>
                          </div>
                        ))}
                        
                        {/* New Images */}
                        {detailedImageFiles.map((file, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200 hover:border-green-300 transition-colors">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`صورة جديدة ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDetailedImage(index)}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                              title="حذف الصورة"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              جديدة
                            </div>
                            <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                              {(file.size / 1024).toFixed(0)}KB
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm ml-3">❓</span>
                الأسئلة الشائعة
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          السؤال {index + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index].question = e.target.value;
                            setFaqs(newFaqs);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                          placeholder="أدخل السؤال..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          الإجابة
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index].answer = e.target.value;
                            setFaqs(newFaqs);
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                          placeholder="أدخل الإجابة..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaqs = faqs.filter((_, i) => i !== index);
                          setFaqs(newFaqs);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        حذف السؤال
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors font-medium"
                >
                  + إضافة سؤال جديد
                </button>
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm ml-3">➕</span>
                الخدمات الإضافية
              </h3>
              
              <div className="space-y-4">
                {addOns.map((addOn, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          اسم الخدمة الإضافية
                        </label>
                        <input
                          type="text"
                          value={addOn.name}
                          onChange={(e) => {
                            const newAddOns = [...addOns];
                            newAddOns[index].name = e.target.value;
                            setAddOns(newAddOns);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                          placeholder="أدخل اسم الخدمة..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          السعر (ر.س)
                        </label>
                        <input
                          type="number"
                          value={addOn.price || ''}
                          onChange={(e) => {
                            const newAddOns = [...addOns];
                            newAddOns[index].price = Number(e.target.value);
                            setAddOns(newAddOns);
                          }}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                          placeholder="أدخل السعر..."
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        وصف الخدمة (اختياري)
                      </label>
                      <textarea
                        value={addOn.description || ''}
                        onChange={(e) => {
                          const newAddOns = [...addOns];
                          newAddOns[index].description = e.target.value;
                          setAddOns(newAddOns);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                        placeholder="أدخل وصف الخدمة..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newAddOns = addOns.filter((_, i) => i !== index);
                        setAddOns(newAddOns);
                      }}
                      className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      حذف الخدمة
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => setAddOns([...addOns, { name: '', price: 0, description: '' }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors font-medium"
                >
                  + إضافة خدمة جديدة
                </button>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm ml-3">🔍</span>
                إعدادات SEO
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان SEO
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors"
                      placeholder="أدخل عنوان SEO..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors"
                      placeholder="أدخل Meta Title..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وصف SEO
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                      placeholder="أدخل وصف SEO..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                      placeholder="أدخل Meta Description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'جاري الحفظ...' : (isEditing ? 'تحديث الخدمة' : 'إضافة الخدمة')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;