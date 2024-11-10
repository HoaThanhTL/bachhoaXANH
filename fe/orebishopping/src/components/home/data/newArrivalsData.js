import { newArrOne, newArrTwo, newArrThree, newArrFour } from "../../../assets/images/index";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../assets/images/index";

const newArrivalsData = [
  // Category 1: Hàng tươi sống
  {
    _id: "100000",
    img: newArrOne,
    productName: "Round Table Clock",
    originalPrice: 44.00,
    discountPercentage: 10,  
    discountedPrice: 39.60, 
    color: "Black",
    badge: true,
    sale: true,
    subcategory: "Rau củ",
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  {
    _id: "100001",
    img: newArrOne,
    productName: "Round Table Clock",
    originalPrice: 44.00,
    discountPercentage: 0, 
    discountedPrice: null, 
    color: "Black",
    badge: true,
    sale: true,
    subcategory: "Rau củ",
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  {
    _id: "100002",
    img: newArrTwo,
    productName: "Smart Watch",
    originalPrice: 250.00,
    discountPercentage: 10, 
    discountedPrice: null,
    color: "Black",
    badge: true,
    sale: false,
    subcategory: "Trái cây", 
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  {
    _id: "100003",
    img: newArrThree,
    productName: "Cloth Basket",
    originalPrice: 80.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Mixed",
    badge: true,
    subcategory: "Thịt cá", // Sản phẩm này thuộc subcategory "Thịt cá"
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  {
    _id: "100004",
    img: newArrFour,
    productName: "Funny toys for babies",
    originalPrice: 60.00,
    discountPercentage: 5, // 5% giảm giá
    discountedPrice: null,
    color: "Mixed",
    badge: false,
    sale: true,
    subcategory: "Rau củ", // Sản phẩm này thuộc subcategory "Rau củ"
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  {
    _id: "100005",
    img: newArrTwo,
    productName: "Smartphone",
    originalPrice: 700.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Black",
    badge: false,
    sale: true,
    subcategory: "Trái cây", // Sản phẩm này thuộc subcategory "Trái cây"
    des: "Sản phẩm tươi sống chất lượng cao.",
  },
  // Category 2: Đồ gia dụng
  {
    _id: "100006",
    img: newArrOne,
    productName: "Electric Kettle",
    originalPrice: 35.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Silver",
    badge: true,
    sale: true,
    subcategory: "Đồ bếp", // Sản phẩm này thuộc subcategory "Đồ bếp"
    des: "Đồ gia dụng cao cấp, bền bỉ.",
  },
  {
    _id: "100007",
    img: newArrTwo,
    productName: "Blender",
    originalPrice: 120.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "White",
    badge: true,
    sale: true,
    subcategory: "Đồ bếp", // Sản phẩm này thuộc subcategory "Đồ bếp"
    des: "Đồ gia dụng cao cấp, bền bỉ.",
  },
  {
    _id: "100008",
    img: newArrThree,
    productName: "Vacuum Cleaner",
    originalPrice: 150.00,
    discountPercentage: 5,
    discountedPrice: null,
    color: "Blue",
    badge: true,
    sale: false,
    subcategory: "Thiết bị vệ sinh", // Sản phẩm này thuộc subcategory "Thiết bị vệ sinh"
    des: "Đồ gia dụng cao cấp, bền bỉ.",
  },
  {
    _id: "100009",
    img: newArrFour,
    productName: "Microwave Oven",
    originalPrice: 200.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Black",
    badge: false,
    sale: false,
    subcategory: "Đồ bếp", // Sản phẩm này thuộc subcategory "Đồ bếp"
    des: "Đồ gia dụng cao cấp, bền bỉ.",
  },
  {
    _id: "100010",
    img: newArrTwo,
    productName: "Air Fryer",
    originalPrice: 150.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Black",
    badge: false,
    sale: false,
    subcategory: "Đồ bếp", // Sản phẩm này thuộc subcategory "Đồ bếp"
    des: "Đồ gia dụng cao cấp, bền bỉ.",
  },
  // Category 3: Thời trang
  {
    _id: "100011",
    img: newArrOne,
    productName: "T-Shirt",
    originalPrice: 20.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Red",
    badge: true,
    sale: false,
    subcategory: "Quần áo nam", // Sản phẩm này thuộc subcategory "Quần áo nam"
    des: "Thời trang mới nhất, chất liệu tốt.",
  },
  {
    _id: "100012",
    img: newArrTwo,
    productName: "Jeans",
    originalPrice: 60.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Blue",
    badge: true,
    sale: false,
    subcategory: "Quần áo nam", // Sản phẩm này thuộc subcategory "Quần áo nam"
    des: "Thời trang mới nhất, chất liệu tốt.",
  },
  {
    _id: "100013",
    img: newArrThree,
    productName: "Sneakers",
    originalPrice: 120.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "White",
    badge: true,
    sale: false,
    subcategory: "Phụ kiện", // Sản phẩm này thuộc subcategory "Phụ kiện"
    des: "Thời trang mới nhất, chất liệu tốt.",
  },
  {
    _id: "100014",
    img: newArrFour,
    productName: "Jacket",
    originalPrice: 100.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Black",
    badge: false,
    sale: false,
    subcategory: "Quần áo nữ", // Sản phẩm này thuộc subcategory "Quần áo nữ"
    des: "Thời trang mới nhất, chất liệu tốt.",
  },
  {
    _id: "100015",
    img: newArrTwo,
    productName: "Hat",
    originalPrice: 25.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Yellow",
    badge: false,
    sale: false,
    subcategory: "Phụ kiện", // Sản phẩm này thuộc subcategory "Phụ kiện"
    des: "Thời trang mới nhất, chất liệu tốt.",
  },
  // Category 4: Bestsellers
  {
    _id: "1011",
    img: bestSellerOne,
    productName: "Flower Base",
    originalPrice: 35.00,
    discountPercentage: 0,
    discountedPrice: null, // Giá sau khi giảm, sẽ được tính
    color: "Black and White",
    badge: true,
    sale: false,
    subcategory: "Phụ kiện", // Sản phẩm này thuộc subcategory "Phụ kiện"
    des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  },
  {
    _id: "1012",
    img: bestSellerTwo,
    productName: "New Backpack",
    originalPrice: 180.00,
    discountPercentage: 10,
    discountedPrice: null,
    color: "Gray",
    badge: false,
    sale: false,
    subcategory: "Phụ kiện", 
    des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  },
  {
    _id: "1013",
    img: bestSellerThree,
    productName: "Household materials",
    originalPrice: 25.00,
    discountPercentage: 0,
    discountedPrice: null,
    color: "Mixed",
    badge: true,
    sale: false,
    subcategory: "Đồ gia dụng", // Sản phẩm này thuộc subcategory "Đồ gia dụng"
    des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  },
  {
    _id: "1014",
    img: bestSellerFour,
    productName: "Travel Bag",
    originalPrice: 220.00,
    discountPercentage: 15,
    discountedPrice: null,
    color: "Black",
    badge: false,
    sale: false,
    subcategory: "Phụ kiện", // Sản phẩm này thuộc subcategory "Phụ kiện"
    des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  },
];

// Tính toán giá sau khi giảm
newArrivalsData.forEach(item => {
  if (item.discountPercentage > 0) {
    item.discountedPrice = (item.originalPrice * (1 - (item.discountPercentage / 100))).toFixed(2);
  } else {
    item.discountedPrice = item.originalPrice; // Nếu không có giảm giá, giữ giá gốc
  }
});

// Xuất dữ liệu đã xử lý
console.log(newArrivalsData);

export default newArrivalsData;
