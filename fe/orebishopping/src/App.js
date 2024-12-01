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
//fe/orebishopping/src/pages/Account/ForgotPassword.js
//D:\TLCN_BachHoaXANH\bachhoaXANH\fe\orebishopping\src\pages\Account\ResetPassword.js
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import Profile from "./components/user/profile/Profile";
import CategoryDetailPage from "./components/home/CategoryDetail/CategoryDetailPage";
import SubcategoryDetailPage from "./components/home/SubcategoryDetail/SubcategoryDetailPage";

//D:\TLCN_BachHoaXANH\bachhoaXANH\fe\orebishopping\src\components\home\CategoryDetail\CategoryDetailPage.js

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
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/offer" element={<Offer />} />
        <Route path="/product/:_id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentgateway" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        {/* Route for CategoryDetailPage */}
        <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
        <Route path="/subcategory/:subCategoryId" element={<SubcategoryDetailPage />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
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
