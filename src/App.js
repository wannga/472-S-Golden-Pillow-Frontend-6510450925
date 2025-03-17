import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import OwnerProfile from './components/OwnerProfilePage';
import AdminProfile from './components/AdminProfilePage';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import YourOrderPage from './components/YourOrderPage'; 
import ClientProfilePage from './components/ClientProfilePage'; 
import RegisterProductPage from './components/RegisterProductPage.js';
import OrderHistoryPage from './components/OrderHistoryPage.js';
import ProductListPage from './components/ProductListPage.js';
import AdminCheckOrderPage from './components/AdminCheckOrderPage.js';
import CreateCouponPage from './components/CreateCouponPage.js';
import AddAdminStaffPage from './components/AddAdminStaffPage.js';
import CheckEmployeeInfoPage from './components/CheckEmployeeInfoPage.js';
import CouponPage from './components/CouponPage.js';
import AdminCouponPage from './components/AdminCouponPage.js';
import ProductReviewPage from './components/ProductReviewPage.js';
import CheckPackedOrderPage from './components/CheckPackedOrderPage.js'
import CheckDeliveryOrderPage from './components/CheckDeliveryOrderPage.js'
import ReviewPage from './components/ReviewPage.js';
import EditCouponPage from './components/EditCouponPage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart/:userId" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/:userId" element={<AdminProfile />} />
          <Route path="/owner/:userId" element={<OwnerProfile />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} /> 
          <Route path="/order/:orderId" element={<YourOrderPage />} />
          <Route path="/profile/:userId" element={<ClientProfilePage />} />
          <Route path="/RegisterProduct" element={<RegisterProductPage />} />
          <Route path="/OrderHistory" element={<OrderHistoryPage />} />
          <Route path="/ProductList" element={<ProductListPage />} />
          <Route path="/AdminCheck/:orderId" element={<AdminCheckOrderPage />} />
          <Route path="/CreateCouponPage" element={<CreateCouponPage />} />
          <Route path="/addRole" element={<AddAdminStaffPage />} />
          <Route path="/profileEmployee/:staffId" element={<CheckEmployeeInfoPage />} />
          <Route path="/CouponPage" element={<CouponPage/>} />
          <Route path="/AdminCouponPage" element={<AdminCouponPage/>} />
          <Route path='/reviews' element={<ProductReviewPage/>}/>
          <Route path="/packStaff/:userId" element={<CheckPackedOrderPage />} />
          <Route path="/deliverStaff/:userId" element={<CheckDeliveryOrderPage />} />
          <Route path='/order/review' element={<ReviewPage/>}/>
          <Route path='/EditCouponPage/:coupon_id' element={<EditCouponPage/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
