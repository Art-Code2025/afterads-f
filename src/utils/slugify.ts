// تحويل النص العربي والإنجليزي إلى slug احترافي
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // استبدال المسافات بشرطات
    .replace(/\s+/g, '-')
    // إزالة الأحرف الخاصة
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\-]/g, '')
    // إزالة الشرطات المتعددة
    .replace(/-+/g, '-')
    // إزالة الشرطات من البداية والنهاية
    .replace(/^-+|-+$/g, '');
};

// إنشاء رابط احترافي للمنتج
export const createProductSlug = (id: number, name: string): string => {
  const slug = slugify(name);
  return slug ? `${slug}-${id}` : `product-${id}`;
};

// إنشاء رابط للمنتج بدون رقم (اسم الخدمة فقط)
export const createProductSlugNameOnly = (name: string): string => {
  const slug = slugify(name);
  return slug || 'service';
};

// إنشاء رابط احترافي للفئة
export const createCategorySlug = (id: number, name: string): string => {
  const slug = slugify(name);
  return slug ? `${slug}-${id}` : `category-${id}`;
};

// استخراج ID من slug
export const extractIdFromSlug = (slug: string): number => {
  // فك ترميز الـ URL أولاً
  const decodedSlug = decodeURIComponent(slug);
  console.log('🔍 Extracting ID from slug:', { original: slug, decoded: decodedSlug });
  
  const match = decodedSlug.match(/-(\d+)$/);
  const extractedId = match ? parseInt(match[1], 10) : 0;
  
  console.log('🎯 Extracted ID:', extractedId);
  return extractedId;
};

// التحقق من صحة slug
export const isValidSlug = (slug: string): boolean => {
  // فك ترميز الـ URL أولاً
  const decodedSlug = decodeURIComponent(slug);
  console.log('✅ Validating slug:', { original: slug, decoded: decodedSlug });
  
  const isValid = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\-]+-\d+$/.test(decodedSlug);
  console.log('🔍 Slug validation result:', isValid);
  
  return isValid;
};