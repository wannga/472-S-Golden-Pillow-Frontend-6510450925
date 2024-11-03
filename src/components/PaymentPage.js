import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const [order, setOrder] = useState({});
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track if a file is uploaded
  const { orderId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

  // Fetch order details when the component loads
  useEffect(() => {
    fetch(`http://localhost:13889/order/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched order data:', data); // Debugging
        setOrder(data); // Store the entire response
      })
      .catch((error) => console.error('Error fetching order data:', error));
  }, [orderId]);

  // Handle order cancellation
  const handleCancelOrder = () => {
    fetch(`http://localhost:13889/order/${orderId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to cancel order');
        }
        console.log('Order cancelled successfully');
        navigate(`/cart/${userId}`); 
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
        alert('Failed to cancel the order. Please try again.');
      });
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    const formData = new FormData();
    formData.append('image', file); // Append the file to the form data

    // Send the file to the backend
    fetch(`http://localhost:13889/upload/${orderId}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded and order updated:', data);
        setIsFileUploaded(true); // Set upload status to true
        alert('File uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload the file.');
      });
  };

  // Handle the Done button click
  const handleDone = () => {
    if (!isFileUploaded) {
      alert('Please upload a payment proof before proceeding.');
      return;
    }

    const cartId = order.cart_id; // Get the cart_id from the order data

    // Delete all items in the cart by cart_id
    fetch(`http://localhost:13889/cart/clearitems/${cartId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete products from cart.');
        }
        console.log('Products in cart cleared successfully.');

        // Navigate to the Order Page after deleting products
        navigate(`/order/${orderId}`);
      })
      .catch((error) => {
        console.error('Error deleting products from cart:', error);
        alert('Failed to delete products. Please try again.');
      });
  };

  return (
    <div className="payment-container">
      <button className="payment-cancel-button" onClick={handleCancelOrder}>
        Cancel Order
      </button>
      <h1 className="payment-title">Payment</h1>
      <div className="payment-details">
        <div className="qr-code-section">
          <h2 className="qr-title">QR CODE</h2>
          <img
            src={`http://localhost:13889/images/qrcode.jpg`}
            alt="QR Code"
            className="qr-code"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.jpg'; // Fallback image
            }}
          />
          <div className="total-amount">Total {order.total_price || '...'} Baht</div>
        </div>
        <div className="order-details">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Name:</strong> {order.user?.name}</p>
          <p><strong>Address:</strong> {order.user?.address}</p>
        </div>
      </div>
      <div className="upload-section">
        <p>Please attach a proof of payment/transfer slip.</p>
        <input type="file" onChange={handleFileUpload} />
        <button className="done-button" onClick={handleDone}>
          DONE
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
