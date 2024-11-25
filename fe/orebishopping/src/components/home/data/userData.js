// src/components/home/data/userData.js

const userData = {
    token: "fake-jwt-token", // Token giả lập để xác thực
    role: "user", // Role của người dùng, có thể là 'admin' hoặc 'user'
    user: {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+123456789",
      birthday: "1990-01-01",
      gender: "Male",
      avatar: "https://img4.thuthuatphanmem.vn/uploads/2020/05/07/hinh-anh-cute-dep-nhat_093404024.jpg", // Link ảnh avatar giả lập
      joined: "2022-03-01",
    },
    orderHistory: [
      {
        orderId: "#12345",
        date: "2024-11-10",
        status: "Delivered",
        total: 120.00,
        items: [
          { productId: 1, productName: "Product 1", quantity: 2, price: 60.00 },
          { productId: 2, productName: "Product 2", quantity: 1, price: 60.00 }
        ]
      },
      {
        orderId: "#12346",
        date: "2024-11-05",
        status: "Processing",
        total: 80.00,
        items: [
          { productId: 3, productName: "Product 3", quantity: 1, price: 80.00 }
        ]
      }
    ],
    reviews: [
      {
        productId: 1,
        productName: "Product 1",
        rating: 5,
        review: "Great product, will buy again!"
      },
      {
        productId: 2,
        productName: "Product 2",
        rating: 4,
        review: "Good quality, but a bit expensive."
      }
    ]
  };
  
  export default userData;
  