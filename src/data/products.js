export const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    description: "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for all-day wear.",
    rating: 4.8,
    reviews: 2456,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    category: "Wearables",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    description: "Track your fitness goals with precision. Features heart rate monitoring, GPS tracking, sleep analysis, and 50+ workout modes. Water-resistant up to 50 meters.",
    rating: 4.6,
    reviews: 1823,
    badge: "New"
  },
  {
    id: 3,
    name: "Minimalist Leather Backpack",
    category: "Fashion",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    description: "Crafted from genuine full-grain leather, this backpack combines style and functionality. Features padded laptop compartment, multiple pockets, and adjustable straps.",
    rating: 4.9,
    reviews: 945,
    badge: "Sale"
  },
  {
    id: 4,
    name: "Organic Skincare Set",
    category: "Beauty",
    price: 79.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
    description: "Complete skincare routine with 100% organic ingredients. Includes cleanser, toner, serum, and moisturizer. Suitable for all skin types.",
    rating: 4.7,
    reviews: 1234,
    badge: null
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    description: "Big sound in a compact design. IPX7 waterproof rating, 20-hour playtime, and built-in power bank. Perfect for outdoor adventures.",
    rating: 4.5,
    reviews: 3421,
    badge: "Popular"
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 34.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop",
    description: "Set of 4 handcrafted ceramic mugs in earthy tones. Microwave and dishwasher safe. Each holds 12oz of your favorite beverage.",
    rating: 4.8,
    reviews: 678,
    badge: null
  },
  {
    id: 7,
    name: "Running Shoes Ultra",
    category: "Sports",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    description: "Engineered for performance with responsive cushioning and breathable mesh upper. Lightweight design for long-distance comfort.",
    rating: 4.6,
    reviews: 2156,
    badge: "Trending"
  },
  {
    id: 8,
    name: "Mechanical Keyboard RGB",
    category: "Electronics",
    price: 109.99,
    originalPrice: 139.99,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop",
    description: "Premium mechanical switches with customizable RGB backlighting. N-key rollover, dedicated media controls, and detachable USB-C cable.",
    rating: 4.9,
    reviews: 1567,
    badge: "Top Rated"
  }
]

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id))
}

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category)
}

export const categories = [...new Set(products.map(product => product.category))]
