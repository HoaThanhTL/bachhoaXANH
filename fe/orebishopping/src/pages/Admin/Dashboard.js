import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard.css';
import { Table, ProgressBar } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [mostPurchasedProduct, setMostPurchasedProduct] = useState(null);
  const [bestSellingProduct, setBestSellingProduct] = useState(null);
  const [categoryRevenue, setCategoryRevenue] = useState({}); // Doanh thu theo danh mục
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          calculateStatistics(data);
        } else {
          console.error('Lỗi khi lấy dữ liệu từ API');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    const calculateStatistics = (orders) => {
      let dailyRevenue = 0;
      let monthlyRevenue = 0;
      let yearlyRevenue = 0;
      let mostPurchasedProduct = {};
      let bestSellingProduct = { totalRevenue: 0, name: '', unitsSold: 0 };
      let categoryRevenue = {};  // Doanh thu theo danh mục

      orders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const currentDate = new Date();

        if (order.status === 'COMPLETED') {
          const totalPrice = order.totalPrice;

          if (orderDate.toDateString() === currentDate.toDateString()) {
            dailyRevenue += totalPrice;
          }
          if (orderDate.getMonth() === currentDate.getMonth() && orderDate.getFullYear() === currentDate.getFullYear()) {
            monthlyRevenue += totalPrice;
          }
          if (orderDate.getFullYear() === currentDate.getFullYear()) {
            yearlyRevenue += totalPrice;
          }

          order.orderDetails.forEach((orderDetail) => {
            const product = orderDetail.snapshotProductName;
            const categoryId = orderDetail.snapshotCategoryId; // Danh mục sản phẩm
            const quantity = orderDetail.quantity;
            const totalRevenueForProduct = quantity * orderDetail.snapshotPrice;

            if (!categoryRevenue[categoryId]) {
              categoryRevenue[categoryId] = 0;
            }
            categoryRevenue[categoryId] += totalRevenueForProduct;

            if (!mostPurchasedProduct[product]) {
              mostPurchasedProduct[product] = { quantity: 0, totalRevenue: 0 };
            }
            mostPurchasedProduct[product].quantity += quantity;
            mostPurchasedProduct[product].totalRevenue += totalRevenueForProduct;

            if (totalRevenueForProduct > bestSellingProduct.totalRevenue) {
              bestSellingProduct = { name: product, unitsSold: quantity, totalRevenue: totalRevenueForProduct };
            }
          });
        }
      });

      const sortedProducts = Object.entries(mostPurchasedProduct).sort(
        (a, b) => b[1].quantity - a[1].quantity
      );
      const mostPurchased = sortedProducts[0] ? sortedProducts[0][0] : null;

      setStatistics({
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
      });
      setTopSellingProducts(sortedProducts);
      setMostPurchasedProduct(mostPurchased);
      setBestSellingProduct(bestSellingProduct);
      setCategoryRevenue(categoryRevenue);
      setLoading(false);
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const chartData = {
    labels: ['Ngày', 'Tháng', 'Năm'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [statistics.dailyRevenue, statistics.monthlyRevenue, statistics.yearlyRevenue],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>Doanh thu ngày</h3>
          <p>{statistics.dailyRevenue} VND</p>
          <ProgressBar now={statistics.dailyRevenue / 10000 * 100} />
        </div>
        <div className="stat-card">
          <h3>Doanh thu tháng</h3>
          <p>{statistics.monthlyRevenue} VND</p>
          <ProgressBar now={statistics.monthlyRevenue / 50000 * 100} />
        </div>
        <div className="stat-card">
          <h3>Doanh thu năm</h3>
          <p>{statistics.yearlyRevenue} VND</p>
          <ProgressBar now={statistics.yearlyRevenue / 200000 * 100} />
        </div>
      </div>

      {/* Doanh thu theo danh mục */}
      <div className="category-revenue">
        <h3>Doanh thu theo danh mục</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Danh mục</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryRevenue).map(([categoryId, revenue], index) => (
              <tr key={index}>
                <td>{categoryId}</td>
                <td>{revenue} VND</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Top Selling Products */}
      <div className="top-selling-products">
        <h3>Sản phẩm bán chạy nhất</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng bán</th>
              <th>Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map(([product, stats], index) => (
              <tr key={index}>
                <td>{product}</td>
                <td>{stats.quantity}</td>
                <td>{stats.totalRevenue} VND</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="top-selling-product">
        <h3>Sản phẩm bán chạy nhất (theo doanh thu)</h3>
        <p>{bestSellingProduct.name} - {bestSellingProduct.unitsSold} sản phẩm, {bestSellingProduct.totalRevenue} VND</p>
      </div>

      <div className="most-purchased-product">
        <h3>Sản phẩm được mua nhiều nhất</h3>
        <p>{mostPurchasedProduct}</p>
      </div>

      {/* Doanh thu biểu đồ */}
      <div className="revenue-chart">
        <h3>Biểu đồ doanh thu</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
