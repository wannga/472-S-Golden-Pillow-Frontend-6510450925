import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CreateCouponPage.css";

function CreateCoupon() {
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState({
      discount_details: '',
      coupon_code: '',
      coupon_condition: '', 
      coupon_status: '',
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:13889/coupon/createCoupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discount_details: couponData.discount_details,
          coupon_code: couponData.coupon_code,
          coupon_condition: couponData.coupon_condition,
          coupon_status: couponData.coupon_status || "AVAILABLE",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        if (!response.ok) throw new Error("Server error");

        console.log('Coupon added:', result);
        alert('Coupon registered successfully!');
      } else {
        alert(`failed to register coupon: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('Failed to register coupon. Please try again.');
    }

    console.log("Coupon Data:", couponData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="create-coupon-container">
      <div>
        <button onClick={() => navigate('/AdminCouponPage')} className="back-button-create-coupon">Back</button>
      </div>

      <h1 className="header-text">Create Coupons!</h1>

      <div className="create-coupon-input">
        {/* Discount Details */}
        <div className="input-wrapper">
          <label className="label-container">discount_details</label>
          <input
            type="text"
            className="input-container"
            name="discount_details"
            value={couponData.discount_details}
            onChange={handleChange}
            required
          />
        </div>

        {/* Coupon Code */}
        <div className="input-wrapper">
          <label className="label-container">coupon_code</label>
          <input
            type="text"
            className="input-container"
            name="coupon_code"
            value={couponData.coupon_code}
            onChange={handleChange}
            required
          />
        </div>

        {/* Coupon Condition */}
        <div className="input-wrapper">
          <label className="label-container">coupon_condition</label>
        </div>
        
        {/* Condition Text Area */}
        <div className="input-wrapper">
        <textarea
            placeholder="Condition"
            className="text-area-container"
            value={couponData.coupon_condition}
            name="coupon_condition"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Status Selection */}
        <div className="status-container">
          <span>Status</span>
          <button
            onClick={() => setCouponData((prevData) => ({ ...prevData, coupon_status: "AVAILABLE" }))}
            className={couponData.coupon_status === "AVAILABLE" ? "status-button-selected" : "status-button-unselected"}
          >
            AVAILABLE
          </button>

          <button
            onClick={() => setCouponData((prevData) => ({ ...prevData, coupon_status: "UNAVAILABLE" }))}
            className={couponData.coupon_status === "UNAVAILABLE" ? "status-button-selected" : "status-button-unselected"}
          >
            NOT AVAILABLE
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <button type="submit" className="confirm-button" onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  );
}

export default CreateCoupon;
