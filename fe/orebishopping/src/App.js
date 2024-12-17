import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import OtpPage from "./pages/Account/OtpPage";
import ForgotPassword from "./pages/Account/ForgotPassword";
import ResetPassword from "./pages/Account/ResetPassword";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
//D:\TLCN_BachHoaXANH\bachhoaXANH\fe\orebishopping\src\pages\payment\Vnpay\PaymentSuccess.js
import PaymentSuccess from "./pages/payment/Vnpay/PaymentSuccess";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import Profile from "./components/user/profile/Profile";
import CategoryDetailPage from "./components/home/CategoryDetail/CategoryDetailPage";
import SubcategoryDetailPage from "./components/home/SubcategoryDetail/SubcategoryDetailPage";

// Import admin components
import MainLayout from "./components/admin/MainLayout";
import Dashboard from "./pages/Admin/Dashboard";
import CategoryList from "./pages/Admin/Management/CategoryList";
import SubCategoryList from "./pages/Admin/Management/SubCategoryList";
import ProductList from "./pages/Admin/Management/ProductList";
import UserList from "./pages/Admin/Management/UserList";
import OrderList from "./pages/Admin/Management/OrderList";
import BlogList from "./pages/Admin/Management/BlogList";
import PromoList from "./pages/Admin/Management/PromoList";
import AddUser from "./pages/Admin/Actions/AddUser";
import AddCategory from "./pages/Admin/Actions/Category/AddCategory";
import AddSubCategory from "./pages/Admin/Actions/SubCategory/AddSubCategory";
import AddProduct from "./pages/Admin/Actions/Product/AddProduct";
import AddBlog from "./pages/Admin/Actions/AddBlog";
import AddPromo from "./pages/Admin/Actions/AddPromo";
import SendMail from "./pages/Admin/Actions/SendMail";
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};

// Define the router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/product/:_id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentgateway" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
        <Route path="/subcategory/:subCategoryId" element={<SubcategoryDetailPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin Routes with PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="subcategories" element={<SubCategoryList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="promotions" element={<PromoList />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-subcategory" element={<AddSubCategory />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="add-promo" element={<AddPromo />} />
          <Route path="send-mail" element={<SendMail />} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
