import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductReviewPage.css';

const ProductReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, userId, username } = location.state || {};

  if (!username) {
    alert('คุณต้องเข้าสู่ระบบเพื่อเขียนรีวิว!');
  }

  const [reviews, setReviews] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [newReview, setNewReview] = useState({ star: 5, comment: '' });

  const fetchReviews = async (star) => {
    try {
      const response = await fetch(`http://localhost:13889/reviews?lot_id=${product.lot_id}&grade=${product.grade}${star ? `&star=${star}` : ''}`);
      const data = await response.json();
      console.log('Fetched reviews:', data); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }; 

  const filterReviews = (star) => {
    setSelectedStar(star !== null ? Number(star) : null);
  };

  const filteredReviews = selectedStar
  ? reviews.filter((review) => Number(review.star) === Number(selectedStar))
  : reviews;

  useEffect(() => {
    fetchReviews(selectedStar);
    console.log('Selected Star:', selectedStar);
    console.log('Fetched Reviews:', reviews);
  }, [product.lot_id, product.grade, selectedStar]);


  const handleInputChange = (event) => {
    setNewReview({ ...newReview, [event.target.name]: event.target.value });
  };

  const handleFeedback = async (reviewId, action) => {
    try {
      const response = await fetch(`http://localhost:13889/reviews/feedback/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      const updatedReview = await response.json();

      // อัปเดตค่า like_count และ dislike_count ใน state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId ? updatedReview : review
        )
      );
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return alert("กรุณาใส่คอมเมนต์!");

    const reviewData = {
      lot_id: product.lot_id,
      grade: product.grade,
      username: username,
      order_id: 46,
      star: newReview.star,
      comment: newReview.comment,
    };

    try {
      const response = await fetch('http://localhost:13889/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReviewFromServer = await response.json();
        setReviews([newReviewFromServer, ...reviews]); // เพิ่มรีวิวใหม่ไปด้านบน
        setNewReview({ star: 5, comment: '' }); // รีเซ็ตฟอร์ม
      } else {
        alert("เกิดข้อผิดพลาด ไม่สามารถส่งรีวิวได้");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      console.log('by user:', username);
    }
  };

  return (
    <div className="review-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>

      <div className="review-header">
        <h2>Grade: {product.grade}</h2>
        <h2>Lot: {product.lot_id}</h2>
        <img src={`http://localhost:13889${product.image_path}`} alt="Durian" className="durian-image" />
      </div>

      <p className="review-average">Average: 4.25 ⭐</p>

      {/* ปุ่มกรองดาว */}
      <div className="review-filters">
        <button className="filter-button" onClick={() => filterReviews(null)}>All</button>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} className="filter-button" onClick={() => filterReviews(star)}>
            {star} ⭐
          </button>
        ))}
      </div>

      <div className="review-form">
        <div className='h3-send'>
        <h3>Your Review 🖍️</h3>
        <button className="submit-review-button" onClick={handleSubmitReview}>Send Review</button>
        </div>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => setNewReview({ ...newReview, star })}>
              {newReview.star >= star ? '⭐️' : '☆'}
            </span>
          ))}
        </div>
        <textarea
          name="comment"
          value={newReview.comment}
          onChange={handleInputChange}
          placeholder="พิมพ์รีวิวของคุณที่นี่..."
        ></textarea>
      </div>

      {/* รายการรีวิว */}
      <div className="review-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div className="review-card" key={review.review_id}>
              <div className="review-header2">
                <h3 className="username">{review.username}</h3>
                <div className="like-dislike-buttons">
                  <button className="like-button" onClick={() => handleFeedback(review.review_id, 'like')}>
                    👍
                  </button>
                  <span>{review.like_count}</span>
                  <button className="dislike-button" onClick={() => handleFeedback(review.review_id, 'dislike')}>
                    👎
                  </button>
                  <span>{review.dislike_count}</span>
                </div>
              </div>
              <p className="review-rating">{'⭐'.repeat(review.star)}{review.star < 5 ? '☆'.repeat(5 - review.star) : ''}</p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviewPage;
