// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import Heading from "../Products/Heading";
// import Product from "../Products/Product";
// import newArrivalsData from "../data/newArrivalsData";
// import categoriesData from "../data/categoriesData";
// import SampleNextArrow from "./SampleNextArrow";
// import SamplePrevArrow from "./SamplePrevArrow";

// const NewArrivals = () => {
//   const [categories, setCategories] = useState({});

//   useEffect(() => {
//     const updatedCategories = categoriesData.reduce((acc, category) => {
//       const filteredProducts = newArrivalsData.filter((product) =>
//         category.subcategories.some(
//           (subcategory) => subcategory.name === product.subcategory
//         )
//       );

//       if (filteredProducts.length > 0) {
//         acc[category.name] = filteredProducts;
//       }

//       return acc;
//     }, {});

//     setCategories(updatedCategories);
//   }, []);

  // const commonSliderSettings = {
  //   infinite: true,
  //   speed: 500,
  //   slidesToScroll: 1,
  //   nextArrow: <SampleNextArrow />,
  //   prevArrow: <SamplePrevArrow />,
  //   responsive: [
  //     { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
  //     { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 1 } },
  //     { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  //   ],
  // };

//   const productSliderSettings = {
//     ...commonSliderSettings,
//     slidesToShow: 4,
//   };

//   const bannerSliderSettings = {
//     ...commonSliderSettings,
//     slidesToShow: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//   };

//   return (
//     <div className="w-full pb-16">
//       {Object.keys(categories).map((category, index) => {
//         const categoryData = categoriesData.find((cat) => cat.name === category);

//         return (
//           <div key={category} className="mb-8">
//             {categoryData && categoryData.listImg.length > 0 && (
//               <div className="mb-4">
//                 <Slider
//                   {...bannerSliderSettings}
//                   key={`banner-${index}`}
//                 >
//                   {categoryData.listImg.map((img, imgIndex) => (
//                     <div key={imgIndex} className="px-2">
//                       <img src={img} alt={category} className="w-full h-auto" />
//                     </div>
//                   ))}
//                 </Slider>
//               </div>
//             )}

//             <Heading heading={category} />

//             {/* Hiển thị sản phẩm */}
//             <Slider
//               {...productSliderSettings}
//               key={`product-slider-${category}`}
//             >
//               {categories[category].map((product) => (
//                 <div key={product._id} className="px-2">
//                   <Product
//                     _id={product._id}
//                     img={product.img}
//                     productName={product.productName}
//                     originalPrice={product.originalPrice}
//                     discountedPrice={product.discountedPrice}
//                     discountPercentage={product.discountPercentage}
//                     badge={product.discountPercentage > 0 ? "Sale" : null}
//                     unit={product.unit}
//                   />
//                 </div>
//               ))}
//             </Slider>

//             {/* Thêm nút "Xem thêm" */}
//             <Link
//               to={`/category/${category}`} // Chuyển hướng tới trang category
//               className="mt-4 text-blue-500 hover:underline"
//             >
//               Xem thêm
//             </Link>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

// Common slider settings should be defined here
const commonSliderSettings = {
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const NewArrivals = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Gọi API lấy danh sách category
        const response = await fetch("http://127.0.0.1:8080/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const productSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 4,
  };

  return (
    <div className="w-full pb-16">
      {categories.map((category) => (
        <CategoryProducts
          key={category.categoryId}
          category={category}
          productSliderSettings={productSliderSettings}
        />
      ))}
    </div>
  );
};

const CategoryProducts = ({ category, productSliderSettings }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // Gọi API lấy danh sách sản phẩm theo categoryId
        const response = await fetch(
          `http://127.0.0.1:8080/api/products/category/${category.categoryId}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(
          `Failed to fetch products for category ${category.name}:`,
          error
        );
      }
    };

    fetchProductsByCategory();
  }, [category.categoryId, category.name]);

  // Tạo slider banner cho category
  const bannerSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  // Tạo mảng ảnh banner: 1 ảnh từ API và 2 ảnh sao chép
  const bannerImages = [
    `http://127.0.0.1:8080/images/${category.image}`, // ảnh từ API
    `https://cdnv2.tgdd.vn/bhx-static/bhx/5599/trang-cate-pc-2_202411271551252708.jpg`, // sao chép ảnh từ API (hoặc dùng ảnh mặc định)
    `https://cdnv2.tgdd.vn/bhx-static/bhx/5599/pc_202411131032408748.png`, // sao chép ảnh từ API (hoặc dùng ảnh mặc định)
  ];

  return (
    <div className="mb-8">
      
      {/* Slider Banner */}
      <div className="mb-4">
        <Slider {...bannerSliderSettings}>
          {bannerImages.map((img, index) => (
            <div key={index} className="px-2">
              <img src={img} alt={category.name} className="w-full h-auto" />
            </div>
          ))}
        </Slider>
      </div>
      <Heading heading={category.name} />
      {/* Các sản phẩm trong category */}
      <Slider {...productSliderSettings}>
        {products.map((product) => (
          <div key={product.productId} className="px-2">
            <Product
              _id={product.productId}
              img={product.image}
              productName={product.name}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
              discountPercentage={product.discountPercentage}
              unit={product.unit}
            />
          </div>
        ))}
      </Slider>

      <Link
        to={`/category/${category.categoryId}`}
        className="mt-4 text-blue-500 hover:underline"
      >
        Xem thêm
      </Link>
    </div>
  );
};

export default NewArrivals;
