# Sock Drop - Novelty Sock E-commerce Website

A fun and quirky mock e-commerce website for novelty socks, built with HTML, CSS, and JavaScript.

## 🧦 Features

### Core Functionality
- **Product Catalog**: Display 8 unique novelty socks with fun descriptions and emoji placeholders
- **Category Filtering**: Filter products by category (Funny, Animal, Food, Holiday) without page reloads
- **Shopping Cart**: Add items to cart with persistent storage using localStorage
- **Cart Management**: View cart contents, update quantities, and remove items
- **Dark Mode Toggle**: Switch between light and dark themes with preference persistence

### User Experience
- **Responsive Design**: Mobile-first approach that works on all device sizes
- **Modern UI**: Clean, modern design using Google Fonts (Poppins)
- **Smooth Animations**: Fade-in effects and hover animations for better UX
- **Interactive Elements**: Hover effects, smooth scrolling, and visual feedback

### Technical Features
- **localStorage Integration**: Cart items and theme preferences persist across sessions
- **Dynamic Content**: JavaScript-driven product rendering and filtering
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Notification System**: Success messages when adding items to cart

## 📁 Project Structure

```
Sock Drop/
├── index.html          # Main homepage
├── cart.html           # Shopping cart page
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open `index.html`** in your web browser
3. **Start Shopping!** Browse products, add items to cart, and explore all features

No build process or dependencies required - it's a pure HTML/CSS/JavaScript project!

## 🛍️ How to Use

### Browsing Products
- View all products on the homepage
- Use category filter buttons to see specific types of socks
- Click "Shop Now" to scroll to the products section

### Adding to Cart
- Click "Add to Cart" on any product
- Cart count updates automatically in the navbar
- Items are saved to localStorage and persist on page refresh

### Managing Cart
- Click the cart icon in the navbar to view your cart
- Adjust quantities using + and - buttons
- Remove items with the "Remove" button
- View total price and proceed to checkout

### Theme Switching
- Click the moon/sun icon in the navbar to toggle dark mode
- Theme preference is saved and restored on page reload

## 🎨 Design Features

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Amber (#f59e0b)
- **Dark Mode**: Inverted colors with proper contrast

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Layout
- **Grid System**: CSS Grid for product layout
- **Flexbox**: Used for navigation and component alignment
- **Mobile-First**: Responsive breakpoints at 768px and 480px

## 📱 Responsive Design

The website is fully responsive with:
- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Adjusted grid layouts and spacing
- **Mobile**: Stacked layouts, hamburger menu, and touch-friendly buttons

## 🔧 Customization

### Adding Products
Edit the `products` array in `script.js`:

```javascript
const products = [
    {
        id: 9,
        name: "Your New Sock",
        description: "Description here",
        price: 12.99,
        category: "funny",
        image: "🎭"
    }
    // Add more products...
];
```

### Modifying Categories
Update the filter buttons in `index.html` and the category filtering logic in `script.js`.

### Styling Changes
All styles are in `styles.css` with CSS custom properties for easy theming.

## 🌟 Product Categories

- **Funny**: Humorous and pun-based socks
- **Animal**: Animal-themed socks (cats, dinosaurs, etc.)
- **Food**: Food-inspired socks (pizza, tacos, etc.)
- **Holiday**: Seasonal and holiday-themed socks

## 🛠️ Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This is a mock project for educational and demonstration purposes.

## 🤝 Contributing

Feel free to fork this project and add your own features or improvements!

---

**Sock Drop** - Stand Out from the Foot Up! 🧦✨ 