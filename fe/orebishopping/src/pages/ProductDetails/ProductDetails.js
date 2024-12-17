// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
// import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

// const ProductDetails = () => {
//   const location = useLocation();
//   const [prevLocation, setPrevLocation] = useState("");
//   const [productInfo, setProductInfo] = useState([]);

//   useEffect(() => {
//     setProductInfo(location.state.item);
//     setPrevLocation(location.pathname);
//   }, [location, productInfo]);

//   return (
//     <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
//       <div className="max-w-container mx-auto px-4">
//         <div className="xl:-mt-10 -mt-7">
//           <Breadcrumbs title="" prevLocation={prevLocation} />
//         </div>
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
//           <div className="h-full">
//             <ProductsOnSale />
//           </div>
//           <div className="h-full xl:col-span-2">
//             <img
//               className="w-full h-full object-cover"
//               src={productInfo.img}
//               alt={productInfo.img}
//             />
//           </div>
//           <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
//             <ProductInfo productInfo={productInfo} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";  // Thêm useParams để lấy id từ URL
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

// Lấy id sản phẩm từ URL params
const ProductDetails = () => {
  const { _id } = useParams(); // Sử dụng useParams để lấy _id từ URL
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);  // Chỉnh lại thành null để dễ dàng kiểm tra trạng thái khi chưa có dữ liệu

  useEffect(() => {
    setPrevLocation(window.location.pathname);  // Lưu lại location khi component render

    // Hàm để lấy dữ liệu sản phẩm từ API
    const fetchProductInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/products/${_id}`);
        console.log(_id);
        console.log(response);
        const data = await response.json();
        setProductInfo(data);  // Cập nhật dữ liệu sản phẩm vào state
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductInfo();  

  }, [_id]);  

  if (!productInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <ProductsOnSale />
          </div>
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-full object-cover"
              src={productInfo.image}  // Hiển thị hình ảnh từ productInfo
              alt={productInfo.name}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
