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

//   const commonSliderSettings = {
//     infinite: true,
//     speed: 500,
//     slidesToScroll: 1,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//       { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//       { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
//     ],
//   };

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

// export default NewArrivals;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { fetchAllProducts } from "../../../services/productService";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await fetchAllProducts(); // Gọi API, nhận dữ liệu
        console.log("Fetched Products:", products); // Kiểm tra dữ liệu nhận được
        setProducts(products);
  
        // Phân loại sản phẩm theo category
        const categorizedProducts = products.reduce((acc, product) => {
          const categoryName = product.category?.name || "Uncategorized";
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
          return acc;
        }, {});
  
        console.log("Categorized Products:", categorizedProducts); // Kiểm tra dữ liệu đã phân loại
        setCategories(categorizedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  

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

  const productSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 4,
  };

  return (
    <div className="w-full pb-16">
      {Object.keys(categories).map((category) => (
        <div key={category} className="mb-8">
          <Heading heading={category} />

          <Slider {...productSliderSettings}>
            {categories[category].map((product) => (
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
            to={`/category/${category}`}
            className="mt-4 text-blue-500 hover:underline"
          >
            Xem thêm
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NewArrivals;
