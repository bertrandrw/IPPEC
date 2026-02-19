import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  Shield, 
  Search, 
  ShoppingCart, 
  MapPin, 
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Package,
  Lock,
  X,
  Star,
  Eye,
  Zap,
  Truck,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/ToastContainer';

interface PrivateMedicine {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  discretePackaging: boolean;
  requiresAgeVerification: boolean;
  image?: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  isPopular: boolean;
  isFastDelivery: boolean;
  pharmacy: {
    id: string;
    name: string;
    location: string;
    phone: string;
    rating: number;
    verified: boolean;
  };
}

interface CartItem extends PrivateMedicine {
  quantity: number;
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryInstructions: string;
  discreteDelivery: boolean;
}

interface PaymentMethod {
  type: 'mobile' | 'card';
  provider: string;
  number?: string;
  expiryDate?: string;
  cvv?: string;
}

interface AgeVerification {
  nationalId: string;
  dateOfBirth: string;
  verified: boolean;
}

const PrivateOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [medicines, setMedicines] = useState<PrivateMedicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [ageVerification, setAgeVerification] = useState<AgeVerification>({
    nationalId: '',
    dateOfBirth: '',
    verified: false
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>({
    type: 'mobile',
    provider: 'mtn',
    number: ''
  });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
    discreteDelivery: true
  });
  const [sortBy, setSortBy] = useState('popular');
  const { showToast } = useToast();

  const categories = [
    'all',
    'contraceptives',
    'emergency-contraception',
    'sexual-health',
    'personal-care',
    'pregnancy-tests',
    'fertility',
    'other'
  ];

  const categoryLabels: Record<string, string> = {
    'all': 'All Products',
    'contraceptives': 'Protection',
    'emergency-contraception': 'Emergency Care',
    'sexual-health': 'Wellness Products',
    'personal-care': 'Personal Care',
    'pregnancy-tests': 'Testing Kits',
    'fertility': 'Family Planning',
    'other': 'Other Products'
  };

  useEffect(() => {
    // Simulate API call - Replace with actual API
    const fetchPrivateMedicines = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockMedicines: PrivateMedicine[] = [
          {
            id: '1',
            name: 'Protection Pack - Premium',
            category: 'contraceptives',
            description: 'High-quality protection with ultra-thin design',
            price: 8500,
            inStock: true,
            discretePackaging: true,
            requiresAgeVerification: true,
            rating: 4.8,
            reviewCount: 127,
            badges: ['Best Seller', 'Fast Delivery'],
            isPopular: true,
            isFastDelivery: true,
            pharmacy: {
              id: 'ph1',
              name: 'Kigali Central Pharmacy',
              location: 'Kigali, Rwanda',
              phone: '+250 788 123 456',
              rating: 4.9,
              verified: true
            }
          },
          {
            id: '2',
            name: 'Emergency Care Tablet',
            category: 'emergency-contraception',
            description: 'Emergency contraceptive pill - effective within 72 hours',
            price: 12000,
            inStock: true,
            discretePackaging: true,
            requiresAgeVerification: true,
            rating: 4.6,
            reviewCount: 89,
            badges: ['Doctor Recommended', 'Urgent Care'],
            isPopular: false,
            isFastDelivery: true,
            pharmacy: {
              id: 'ph2',
              name: 'Remera Health Pharmacy',
              location: 'Remera, Kigali',
              phone: '+250 788 987 654',
              rating: 4.7,
              verified: true
            }
          },
          {
            id: '3',
            name: 'Pregnancy Test Kit',
            category: 'pregnancy-tests',
            description: 'Accurate home pregnancy test - 99% accuracy',
            price: 4500,
            inStock: true,
            discretePackaging: true,
            requiresAgeVerification: false,
            rating: 4.9,
            reviewCount: 203,
            badges: ['Most Accurate', 'Top Rated'],
            isPopular: true,
            isFastDelivery: false,
            pharmacy: {
              id: 'ph3',
              name: 'Nyamirambo Medical Store',
              location: 'Nyamirambo, Kigali',
              phone: '+250 788 456 789',
              rating: 4.5,
              verified: true
            }
          },
          {
            id: '4',
            name: 'Intimate Wellness Gel',
            category: 'personal-care',
            description: 'Personal lubricant for comfort and safety',
            price: 6500,
            inStock: true,
            discretePackaging: true,
            requiresAgeVerification: true,
            rating: 4.4,
            reviewCount: 156,
            badges: ['Premium Quality'],
            isPopular: false,
            isFastDelivery: true,
            pharmacy: {
              id: 'ph1',
              name: 'Kigali Central Pharmacy',
              location: 'Kigali, Rwanda',
              phone: '+250 788 123 456',
              rating: 4.9,
              verified: true
            }
          },
          {
            id: '5',
            name: 'Fertility Supplement',
            category: 'fertility',
            description: 'Natural fertility support supplement',
            price: 15000,
            inStock: true,
            discretePackaging: true,
            requiresAgeVerification: false,
            rating: 4.3,
            reviewCount: 78,
            badges: ['Natural', 'Low Stock'],
            isPopular: false,
            isFastDelivery: false,
            pharmacy: {
              id: 'ph4',
              name: 'Gasabo District Pharmacy',
              location: 'Gasabo, Kigali',
              phone: '+250 788 321 654',
              rating: 4.6,
              verified: true
            }
          }
        ];
        setMedicines(mockMedicines);
      } catch (error) {
        showToast('error', 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivateMedicines();
  }, [showToast]);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: PrivateMedicine) => {
    // Check if age verification is required and not completed
    if (medicine.requiresAgeVerification && !ageVerification.verified) {
      setShowAgeVerification(true);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
    showToast('success', 'Added to cart');
  };

  const handleAgeVerification = () => {
    if (!ageVerification.nationalId || !ageVerification.dateOfBirth) {
      showToast('error', 'Please provide your National ID and Date of Birth');
      return;
    }

    // Simple age verification - check if user is 18+
    const birthDate = new Date(ageVerification.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    if (actualAge < 18) {
      showToast('error', 'You must be 18 years or older to purchase this product');
      return;
    }

    setAgeVerification(prev => ({ ...prev, verified: true }));
    setShowAgeVerification(false);
    showToast('success', 'Age verification completed successfully');
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === medicineId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('error', 'Your cart is empty');
      return;
    }

    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address) {
      showToast('error', 'Please fill in all required delivery information');
      return;
    }

    try {
      // Simulate API call for placing order
      setLoading(true);
      
      const orderData = {
        items: cart,
        deliveryAddress,
        total: getTotalPrice(),
        discreteDelivery: deliveryAddress.discreteDelivery,
        orderType: 'private'
      };

      // Mock API call - replace with actual API
      console.log('Placing order:', orderData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('success', 'Order placed successfully! You will receive a confirmation email.');
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      
      // Reset form
      setDeliveryAddress({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        deliveryInstructions: '',
        discreteDelivery: true
      });
      
    } catch (error) {
      showToast('error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && medicines.length === 0) {
    return (
      <Layout title="Private Orders">
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Private Orders">
      <div className="min-h-screen bg-gradient-to-b from-[#E6F2FF] to-white p-4 lg:p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#397dc0] to-[#2c5f99] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl lg:text-3xl font-bold">Private Orders</h1>
          </div>
          <p className="text-blue-100 text-sm lg:text-base">
            Discreet ordering for personal healthcare products with secure packaging and confidential delivery
          </p>
          <div className="flex items-center gap-2 mt-4 text-blue-100">
            <Lock className="h-4 w-4" />
            <span className="text-sm">100% Confidential • Discreet Packaging • Secure Delivery</span>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products discretely..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0] transition-all"
                />
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0] bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="flex items-center gap-2 bg-[#397dc0] text-white px-6 py-3 rounded-lg hover:bg-[#2c5f99] transition-all duration-200 relative transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#397dc0] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
              <span>{filteredMedicines.length} products available</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>100% Discreet</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              {/* Product Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                <Package className="h-16 w-16 text-blue-300" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {medicine.badges.map(badge => (
                    <span key={badge} className={`px-2 py-1 rounded-full text-xs font-bold ${
                      badge === 'Best Seller' ? 'bg-yellow-400 text-yellow-900' :
                      badge === 'Fast Delivery' ? 'bg-green-400 text-green-900' :
                      badge === 'Doctor Recommended' ? 'bg-blue-400 text-blue-900' :
                      badge === 'Most Accurate' ? 'bg-purple-400 text-purple-900' :
                      badge === 'Low Stock' ? 'bg-red-400 text-red-900' :
                      'bg-gray-400 text-gray-900'
                    }`}>
                      {badge}
                    </span>
                  ))}
                </div>


              </div>

              <div className="p-6">
                {/* Product Title and Rating */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 group-hover:text-[#397dc0] transition-colors">
                    {medicine.name}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{medicine.rating}</span>
                    <span className="text-xs text-gray-500">({medicine.reviewCount})</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                  {medicine.description}
                </p>
                
                {/* Pharmacy Info with Rating */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <Package className="h-4 w-4 text-[#397dc0]" />
                    <span className="font-medium">{medicine.pharmacy.name}</span>
                    {medicine.pharmacy.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{medicine.pharmacy.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{medicine.pharmacy.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {medicine.price.toLocaleString()} RWF
                  </span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    medicine.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>



                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {medicine.discretePackaging && (
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Discreet
                    </div>
                  )}
                  {medicine.isFastDelivery && (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Fast
                    </div>
                  )}
                  {medicine.isPopular && (
                    <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Popular
                    </div>
                  )}
                </div>
                
                {medicine.requiresAgeVerification && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm mb-4 p-2 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>Age verification required (18+)</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(medicine)}
                    disabled={!medicine.inStock}
                    className="flex-1 bg-[#397dc0] text-white py-3 rounded-lg hover:bg-[#2c5f99] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:shadow-lg transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => showToast('info', 'Quick view coming soon!')}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.price.toLocaleString()} RWF each</p>
                            <p className="text-xs text-gray-500">From: {item.pharmacy.name}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} RWF</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {getTotalPrice().toLocaleString()} RWF
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCart(false);
                          setShowCheckout(true);
                        }}
                        className="w-full bg-[#397dc0] text-white py-3 rounded-lg hover:bg-[#2c5f99] transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Age Verification Modal */}
        {showAgeVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-red-600">Age Verification Required</h2>
                  <button
                    onClick={() => setShowAgeVerification(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <p className="text-gray-700 text-center mb-4">
                    This product requires age verification. You must be 18 years or older to purchase this item.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      National ID Number *
                    </label>
                    <input
                      type="text"
                      value={ageVerification.nationalId}
                      onChange={(e) => setAgeVerification(prev => ({ ...prev, nationalId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                      placeholder="Enter your National ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={ageVerification.dateOfBirth}
                      onChange={(e) => setAgeVerification(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Privacy Notice</p>
                      <p>Your identification information is used only for age verification and is not stored or shared with third parties.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAgeVerification(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAgeVerification}
                    className="flex-1 bg-[#397dc0] text-white py-3 rounded-lg hover:bg-[#2c5f99] transition-colors"
                  >
                    Verify Age
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Checkout - Discreet Delivery</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Delivery Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.fullName}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={deliveryAddress.phone}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={deliveryAddress.email}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          value={deliveryAddress.address}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.city}
                            onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.postalCode}
                            onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Instructions
                        </label>
                        <textarea
                          value={deliveryAddress.deliveryInstructions}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Special instructions for delivery (optional)"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="discreteDelivery"
                          checked={deliveryAddress.discreteDelivery}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, discreteDelivery: e.target.checked }))}
                          className="h-4 w-4 text-[#397dc0] border-gray-300 rounded focus:ring-[#397dc0]"
                        />
                        <label htmlFor="discreteDelivery" className="text-sm text-gray-700 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          Use discreet packaging (recommended)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Payment Method
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Mobile Money Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Money
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentProvider"
                              value="mtn"
                              checked={selectedPaymentMethod.type === 'mobile' && selectedPaymentMethod.provider === 'mtn'}
                              onChange={() => setSelectedPaymentMethod({ type: 'mobile', provider: 'mtn', number: '' })}
                              className="mr-3"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-xs">
                                MTN
                              </div>
                              <span className="font-medium">MTN MoMo</span>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentProvider"
                              value="airtel"
                              checked={selectedPaymentMethod.type === 'mobile' && selectedPaymentMethod.provider === 'airtel'}
                              onChange={() => setSelectedPaymentMethod({ type: 'mobile', provider: 'airtel', number: '' })}
                              className="mr-3"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">
                                AT
                              </div>
                              <span className="font-medium">Airtel Money</span>
                            </div>
                          </label>
                        </div>
                        
                        {selectedPaymentMethod.type === 'mobile' && (
                          <div className="mt-3">
                            <input
                              type="tel"
                              placeholder="Enter phone number (e.g., 078XXXXXXX)"
                              value={selectedPaymentMethod.number || ''}
                              onChange={(e) => setSelectedPaymentMethod(prev => ({ ...prev, number: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Card Payment Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Credit/Debit Cards
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentProvider"
                              value="visa"
                              checked={selectedPaymentMethod.type === 'card' && selectedPaymentMethod.provider === 'visa'}
                              onChange={() => setSelectedPaymentMethod({ type: 'card', provider: 'visa', number: '' })}
                              className="mr-3"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                VISA
                              </div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentProvider"
                              value="mastercard"
                              checked={selectedPaymentMethod.type === 'card' && selectedPaymentMethod.provider === 'mastercard'}
                              onChange={() => setSelectedPaymentMethod({ type: 'card', provider: 'mastercard', number: '' })}
                              className="mr-3"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                MC
                              </div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentProvider"
                              value="amex"
                              checked={selectedPaymentMethod.type === 'card' && selectedPaymentMethod.provider === 'amex'}
                              onChange={() => setSelectedPaymentMethod({ type: 'card', provider: 'amex', number: '' })}
                              className="mr-3"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                AX
                              </div>
                            </div>
                          </label>
                        </div>
                        
                        {selectedPaymentMethod.type === 'card' && (
                          <div className="mt-3 space-y-3">
                            <input
                              type="text"
                              placeholder="Card Number"
                              value={selectedPaymentMethod.number || ''}
                              onChange={(e) => setSelectedPaymentMethod(prev => ({ ...prev, number: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={selectedPaymentMethod.expiryDate || ''}
                                onChange={(e) => setSelectedPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                              />
                              <input
                                type="text"
                                placeholder="CVV"
                                value={selectedPaymentMethod.cvv || ''}
                                onChange={(e) => setSelectedPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Summary
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-500">{item.pharmacy.name}</p>
                          </div>
                          <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} RWF</p>
                        </div>
                      ))}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="text-lg font-bold text-green-600">
                            {getTotalPrice().toLocaleString()} RWF
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Shield className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">Privacy Guarantee</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Discreet packaging with no product identification</li>
                            <li>• Confidential billing and shipping labels</li>
                            <li>• Secure delivery with signature required</li>
                            <li>• Your privacy is our priority</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-[#397dc0] text-white py-3 rounded-lg hover:bg-[#2c5f99] disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Place Order Securely
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PrivateOrders;