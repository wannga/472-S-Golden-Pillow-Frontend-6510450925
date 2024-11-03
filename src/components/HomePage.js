import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

  useEffect(() => {
    // Fetch product data from the backend API
    fetch('http://localhost:13889/products')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Debugging
        const availableProducts = data.filter((item) => item.status === 'Available');
        setProducts(availableProducts);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  const handleNextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleAddToCart = () => {
    const product = products[currentIndex];
    
  
    if (!userId) {
      console.error('User ID is missing!');
      alert('Please log in again.');
      navigate('/login'); // Redirect to login if userId is missing
      return;
    }
  
    if (product) {
      fetch(`http://localhost:13889/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lot_id: product.lot_id,
          grade: product.grade,
          amount: 1,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to add item to cart');
          return response.json();
        })
        .then(() => {
          console.log('Product added to cart successfully');
          navigate(`/cart/${userId}`); // Navigate to the user’s cart page
        })
        .catch((error) => console.error('Error adding to cart:', error));
    }
  };
  
  

  const product = products[currentIndex];

  return (
    <div className="home-page-container">
      {/* Header Bar */}
      <div className="header-bar">
        <h1 className="logo">Golden Pillow</h1>
        <div className="nav-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>Log out</button>
          <button className="cart-button" onClick={() => navigate(`/cart/${userId}`)}>Cart</button>
          <button className="profile-button" onClick={() => navigate(`/profile/${userId}`)}>Profile</button>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="product-display">
        <button className="nav-arrow left-arrow" onClick={handlePrevProduct}>
          &#8592;
        </button>

        <div className="product-info">
          <h2 className="product-grade">
            Grade: {product ? product.grade : '-'}
          </h2>
          <img
            src={product ? `http://localhost:13889${product.image_path}` : '/image/durian.png'}
            alt="Durian"
            className="product-image-homepage"
          />
          <div className="product-details">
            <p>Lot: {product ? product.lot_id : '-'}</p>
            <p>Price: {product ? `${product.sale_price} Baht` : '-'}</p>
            <p>Amount: {product ? product.RemainLotamount : '-'}</p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        <button className="nav-arrow right-arrow" onClick={handleNextProduct}>
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default HomePage;
