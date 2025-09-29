import { smartToast } from './toastConfig';
import { apiCall, API_ENDPOINTS, buildApiUrl } from '../config/api';

// دالة موحدة لإضافة منتج إلى السلة
export const addToCartUnified = async (
  productId: number, 
  productName: string, 
  quantity: number = 1,
  attachments?: any,
  productPrice?: number,
  productImage?: string
) => {
  try {
    console.log('🛒 [CartUtils] Adding to cart:', { productId, productName, quantity, attachments, productPrice, productImage });

    // محاولة الحصول على بيانات المنتج من API إذا لم تكن متوفرة
    let productData = null;
    if (!productPrice || !productImage) {
      try {
        productData = await apiCall(API_ENDPOINTS.PRODUCT_BY_ID(productId));
        console.log('📦 [CartUtils] Fetched product data:', productData);
      } catch (error) {
        console.warn('⚠️ [CartUtils] Could not fetch product data:', error);
      }
    }

    const finalPrice = productPrice || productData?.price || 0;
    const finalImage = productImage || productData?.mainImage || '';

    const requestBody: any = {
      productId,
      quantity,
      productName,
      price: finalPrice,
      image: finalImage
    };

    // إضافة الخدمات الإضافية إذا كانت موجودة
    if (attachments) {
      if (attachments.addOns && attachments.addOns.length > 0) {
        requestBody.addOns = attachments.addOns;
        requestBody.totalPrice = attachments.totalPrice;
        requestBody.basePrice = attachments.basePrice;
        requestBody.addOnsPrice = attachments.addOnsPrice;
        console.log('🎁 [CartUtils] Including add-ons in request:', attachments.addOns);
      }
      
      // فقط أضف attachments التقليدية إذا كانت موجودة
      if (attachments.images?.length > 0 || attachments.text?.trim()) {
        requestBody.attachments = {
          images: attachments.images,
          text: attachments.text
        };
        console.log('📎 [CartUtils] Including attachments in request:', requestBody.attachments);
      }
    }

    console.log('📤 [CartUtils] Final request body:', requestBody);

    // محاولة الحصول على بيانات المستخدم
    const userData = localStorage.getItem('user');
    
    if (userData) {
      // المستخدم مسجل - حفظ في الخادم
      try {
        const user = JSON.parse(userData);
        if (!user?.id) {
          throw new Error('بيانات المستخدم غير صحيحة');
        }

        console.log('👤 [CartUtils] User is logged in, saving to server:', user.id);

        const response = await apiCall(API_ENDPOINTS.USER_CART(user.id), {
          method: 'POST',
          body: JSON.stringify(requestBody)
        });

        console.log('✅ [CartUtils] Successfully added to server cart:', response);
        
        // تحديث localStorage بالسلة المحدثة من الخادم
        try {
          console.log('🔄 [CartUtils] Fetching updated cart from server to sync localStorage');
          const updatedCart = await apiCall(API_ENDPOINTS.USER_CART(user.id));
          console.log('📦 [CartUtils] Updated cart from server:', updatedCart);
          
          if (Array.isArray(updatedCart)) {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            console.log('✅ [CartUtils] localStorage synced with server cart:', updatedCart.length, 'items');
          } else if (updatedCart && typeof updatedCart === 'object' && updatedCart.cart && Array.isArray(updatedCart.cart)) {
            localStorage.setItem('cart', JSON.stringify(updatedCart.cart));
            console.log('✅ [CartUtils] localStorage synced with server cart property:', updatedCart.cart.length, 'items');
          } else {
            console.warn('⚠️ [CartUtils] Server returned unexpected cart format:', updatedCart);
          }
        } catch (syncError) {
          console.error('❌ [CartUtils] Failed to sync localStorage with server cart:', syncError);
        }
        
        smartToast.frontend.success(`تم إضافة ${productName} إلى السلة بنجاح! 🛒`);

        // إطلاق حدث لتحديث عداد السلة
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // إطلاق إشعار إضافة المنتج للسلة
        window.dispatchEvent(new CustomEvent('showCartNotification', {
          detail: {
            product: {
              name: productName,
              image: finalImage,
              price: finalPrice,
              addOns: attachments?.addOns || [],
              selectedOptions: attachments?.selectedOptions || {},
              totalPrice: attachments?.totalPrice || finalPrice
            },
            quantity: quantity
          }
        }));
        
        return true;
      } catch (serverError) {
        console.error('❌ [CartUtils] Server error, falling back to localStorage:', serverError);
        // في حالة فشل الخادم، احفظ في localStorage
      }
    }

    // المستخدم غير مسجل أو فشل الخادم - حفظ في localStorage
    console.log('💾 [CartUtils] Saving to localStorage');
    
    // الحصول على السلة الحالية من localStorage
    const existingCart = localStorage.getItem('cart');
    let cartItems = [];
    
    if (existingCart) {
      try {
        cartItems = JSON.parse(existingCart);
        if (!Array.isArray(cartItems)) {
          cartItems = [];
        }
      } catch (parseError) {
        console.error('❌ [CartUtils] Error parsing existing cart:', parseError);
        cartItems = [];
      }
    }

    // إنشاء عنصر جديد للسلة
    const newCartItem: any = {
      id: Date.now(), // استخدام timestamp كـ ID مؤقت
      productId,
      quantity,
      selectedOptions: {},
      optionsPricing: {},
      attachments: {},
      product: {
        id: productId,
        name: productName,
        price: finalPrice,
        mainImage: finalImage,
        stock: 999,
        productType: productData?.productType || '',
      }
    };

    // إضافة الخدمات الإضافية إذا كانت موجودة
    if (attachments) {
      if (attachments.addOns && attachments.addOns.length > 0) {
        newCartItem.addOns = attachments.addOns;
        newCartItem.totalPrice = attachments.totalPrice;
        newCartItem.basePrice = attachments.basePrice;
        newCartItem.addOnsPrice = attachments.addOnsPrice;
        // تحديث سعر المنتج ليعكس السعر الإجمالي
        newCartItem.product.price = attachments.totalPrice / quantity;
      }
      
      // إضافة المرفقات التقليدية
      if (attachments.images?.length > 0 || attachments.text?.trim()) {
        newCartItem.attachments = {
          images: attachments.images || [],
          text: attachments.text || ''
        };
      }
    }

    // البحث عن منتج مماثل في السلة (يجب أن يكون نفس المنتج ونفس الخدمات الإضافية)
    const existingItemIndex = cartItems.findIndex((item: any) => {
      const isSameProduct = item.productId === productId;
      const isSameOptions = JSON.stringify(item.selectedOptions || {}) === JSON.stringify({});
      
      // مقارنة الخدمات الإضافية
      const currentAddOns = attachments?.addOns || [];
      const itemAddOns = item.addOns || [];
      const isSameAddOns = JSON.stringify(currentAddOns.sort((a: any, b: any) => a.name.localeCompare(b.name))) === 
                          JSON.stringify(itemAddOns.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      
      return isSameProduct && isSameOptions && isSameAddOns;
    });

    if (existingItemIndex >= 0) {
      // تحديث الكمية للمنتج الموجود
      cartItems[existingItemIndex].quantity += quantity;
      // تحديث بيانات المنتج إذا كانت أحدث
      if (finalPrice > 0) cartItems[existingItemIndex].product.price = finalPrice;
      if (finalImage) cartItems[existingItemIndex].product.mainImage = finalImage;
      console.log('📝 [CartUtils] Updated existing item quantity');
    } else {
      // إضافة منتج جديد
      cartItems.push(newCartItem);
      console.log('➕ [CartUtils] Added new item to cart');
    }

    // حفظ السلة المحدثة
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // إطلاق حدث لتحديث عداد السلة
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // إطلاق إشعار إضافة المنتج للسلة
    window.dispatchEvent(new CustomEvent('showCartNotification', {
      detail: {
        product: {
          name: productName,
          image: finalImage,
          price: finalPrice,
          addOns: attachments?.addOns || [],
          selectedOptions: attachments?.selectedOptions || {},
          totalPrice: attachments?.totalPrice || finalPrice
        },
        quantity: quantity
      }
    }));
    
    return true;

  } catch (error) {
    console.error('❌ [CartUtils] Error adding to cart:', error);
    
    let errorMessage = 'فشل في إضافة المنتج إلى السلة';
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        errorMessage = 'المنتج غير موجود';
      } else if (error.message.includes('400')) {
        errorMessage = 'بيانات غير صحيحة';
      } else if (error.message.includes('500')) {
        errorMessage = 'خطأ في الخادم';
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    smartToast.frontend.error(errorMessage);
    
    return false;
  }
};

// دالة موحدة لإضافة منتج إلى المفضلة
export const addToWishlistUnified = async (productId: number, productName: string) => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      smartToast.frontend.error('يجب تسجيل الدخول لإضافة المنتج إلى المفضلة');
      return false;
    }

    const user = JSON.parse(userData);
    if (!user?.id) {
      smartToast.frontend.error('يجب تسجيل الدخول لإضافة المنتج إلى المفضلة');
      return false;
    }

    console.log('❤️ Adding to wishlist:', { productId, productName });

    const response = await apiCall(API_ENDPOINTS.USER_WISHLIST(user.id), {
      method: 'POST',
      body: JSON.stringify({ productId })
    });

    smartToast.frontend.success(`تم إضافة ${productName} إلى المفضلة! ❤️`);

    // تحديث localStorage للمفضلة
    const savedWishlist = localStorage.getItem('wishlist');
    let currentWishlist: number[] = [];
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          currentWishlist = parsedWishlist;
        }
      } catch (error) {
        console.error('❌ Error parsing wishlist:', error);
      }
    }
    
    // إضافة المنتج إذا لم يكن موجوداً
    if (!currentWishlist.includes(productId)) {
      currentWishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    }

    // إطلاق أحداث لتحديث الواجهة
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: currentWishlist }));
    window.dispatchEvent(new CustomEvent('productAddedToWishlist', { 
      detail: { productId } 
    }));
    
    return true;
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    
    let errorMessage = 'فشل في إضافة المنتج إلى المفضلة';
    if (error instanceof Error && error.message.includes('400')) {
      errorMessage = 'المنتج موجود بالفعل في المفضلة';
    }

    smartToast.frontend.error(errorMessage);
    
    return false;
  }
};

// دالة موحدة لحذف منتج من المفضلة
export const removeFromWishlistUnified = async (productId: number, productName: string) => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      smartToast.frontend.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    const user = JSON.parse(userData);
    if (!user?.id) {
      smartToast.frontend.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    console.log('💔 Removing from wishlist:', { productId, productName });

    await apiCall(API_ENDPOINTS.WISHLIST_PRODUCT(user.id, productId), {
      method: 'DELETE'
    });

    smartToast.frontend.success(`تم حذف ${productName} من المفضلة`);

    // تحديث localStorage للمفضلة
    const savedWishlist = localStorage.getItem('wishlist');
    let currentWishlist: number[] = [];
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          currentWishlist = parsedWishlist;
        }
      } catch (error) {
        console.error('❌ Error parsing wishlist:', error);
      }
    }
    
    // حذف المنتج من المفضلة
    currentWishlist = currentWishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

    // إطلاق أحداث لتحديث الواجهة
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: currentWishlist }));
    window.dispatchEvent(new CustomEvent('productRemovedFromWishlist', { 
      detail: { productId } 
    }));
    
    return true;
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error);
    
    smartToast.frontend.error('فشل في حذف المنتج من المفضلة');
    
    return false;
  }
};