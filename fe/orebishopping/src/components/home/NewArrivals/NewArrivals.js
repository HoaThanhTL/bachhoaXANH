// import React from "react";
// import Slider from "react-slick";
// import Heading from "../Products/Heading";
// import Product from "../Products/Product";
// import {
//   newArrOne,
//   newArrTwo,
//   newArrThree,
//   newArrFour,
// } from "../../../assets/images/index";
// import SampleNextArrow from "./SampleNextArrow";
// import SamplePrevArrow from "./SamplePrevArrow";

// const NewArrivals = () => {
//   const settings = {
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1025,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           infinite: true,
//         },
//       },
//       {
//         breakpoint: 769,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           infinite: true,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: true,
//         },
//       },
//     ],
//   };
//   return (
//     <div className="w-full pb-16">
//       <Heading heading="New Arrivals" />
//       <Slider {...settings}>
//         <div className="px-2">
//           <Product
//             _id="100001"
//             img={newArrOne}
//             productName="Round Table Clock"
//             price="44.00"
//             color="Black"
//             badge={true}
//             des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//           />
//         </div>
//         <div className="px-2">
//           <Product
//             _id="100002"
//             img={newArrTwo}
//             productName="Smart Watch"
//             price="250.00"
//             color="Black"
//             badge={true}
//             des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//           />
//         </div>
//         <div className="px-2">
//           <Product
//             _id="100003"
//             img={newArrThree}
//             productName="cloth Basket"
//             price="80.00"
//             color="Mixed"
//             badge={true}
//             des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//           />
//         </div>
//         <div className="px-2">
//           <Product
//             _id="100004"
//             img={newArrFour}
//             productName="Funny toys for babies"
//             price="60.00"
//             color="Mixed"
//             badge={false}
//             des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//           />
//         </div>
//         <div className="px-2">
//           <Product
//             _id="100005"
//             img={newArrTwo}
//             productName="Funny toys for babies"
//             price="60.00"
//             color="Mixed"
//             badge={false}
//             des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//           />
//         </div>
//       </Slider>
//     </div>
//   );
// };

// export default NewArrivals;
// import React from "react";
// import Slider from "react-slick";
// import Heading from "../Products/Heading";
// import Product from "../Products/Product";
// import newArrivalsData from "../data/newArrivalsData";
// import SampleNextArrow from "./SampleNextArrow";
// import SamplePrevArrow from "./SamplePrevArrow";

// const NewArrivals = () => {
//   // Nhóm sản phẩm theo category
//   const categories = newArrivalsData.reduce((acc, product) => {
//     (acc[product.category] = acc[product.category] || []).push(product);
//     return acc;
//   }, {});

//   const settings = {
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//       { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 2 } },
//       { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
//     ],
//   };

//   return (
//     <div className="w-full pb-16">
//       {Object.keys(categories).map((category) => (
//         <div key={category} className="mb-8">
//           <Heading heading={category} />
//           <Slider {...settings}>
//             {categories[category].map((product) => (
//               <div className="px-2" key={product._id}>
//                 <Product
//                   _id={product._id}
//                   img={product.img}
//                   productName={product.productName}
//                   price={product.price}
//                   color={product.color}
//                   badge={product.badge}
//                   des={product.des}
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NewArrivals;
import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import newArrivalsData from "../data/newArrivalsData";
import categoriesData from "../data/categoriesData"; // Import categoriesData cho banner
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  // Nhóm sản phẩm theo category
  const categories = newArrivalsData.reduce((acc, product) => {
    (acc[product.category] = acc[product.category] || []).push(product);
    return acc;
  }, {});

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full pb-16">
      {Object.keys(categories).map((category) => {
        // Tìm kiếm danh mục trong categoriesData để lấy banner
        const categoryData = categoriesData.find(cat => cat.name === category);

        return (
          <div key={category} className="mb-8">
            {/* Hiển thị banner của danh mục nếu có */}
            {categoryData && (
              <div className="mb-4">
                <Slider {...settings}>
                  {categoryData.listImg.map((img, index) => (
                    <div key={index} className="px-2">
                      <img src={img} alt={category} className="w-full h-auto" />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            <Heading heading={category} />
            <Slider {...settings}>
              {categories[category].map((product) => (
                <div className="px-2" key={product._id}>
                  <Product
                    _id={product._id}
                    img={product.img}
                    productName={product.productName}
                    price={product.price}
                    color={product.color}
                    badge={product.badge}
                    des={product.des}
                  />
                </div>
              ))}
            </Slider>
          </div>
        );
      })}
    </div>
  );
};

export default NewArrivals;
