import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaList, FaBox, FaUser, FaShoppingCart, FaClipboard, FaTag, FaEnvelope, FaCaretRight, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);  // Trạng thái mở/thu gọn Sidebar
  const [selected, setSelected] = useState(''); // Trạng thái để theo dõi mục được chọn

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    setSelected(item); // Cập nhật mục được chọn
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>{isOpen ? 'Admin Panel' : ''}</h3>
        {/* Nút toggle nằm cạnh chữ "Admin Panel" */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
      </div>
      <ul className="sidebar-list">
        <li className={selected === 'dashboard' ? 'selected' : ''} onClick={() => handleSelect('dashboard')}>
          <Link to="/admin"><FaHome /> {isOpen && 'Dashboard'}</Link>
        </li>
        <li className={selected === 'categories' ? 'selected' : ''} onClick={() => handleSelect('categories')}>
          <Link to="/admin/categories"><FaList /> {isOpen && 'Quản lý Danh mục'} <FaCaretRight /></Link>
        </li>
        <li className={selected === 'subcategories' ? 'selected' : ''} onClick={() => handleSelect('subcategories')}>
          <Link to="/admin/subcategories"><FaList /> {isOpen && 'Quản lý Danh mục con'} <FaCaretRight /></Link>
        </li>
        <li className={selected === 'products' ? 'selected' : ''} onClick={() => handleSelect('products')}>
          <Link to="/admin/products"><FaBox /> {isOpen && 'Quản lý Sản phẩm'}</Link>
        </li>
        <li className={selected === 'orders' ? 'selected' : ''} onClick={() => handleSelect('orders')}>
          <Link to="/admin/orders"><FaShoppingCart /> {isOpen && 'Quản lý Đơn hàng'}</Link>
        </li>
        <li className={selected === 'users' ? 'selected' : ''} onClick={() => handleSelect('users')}>
          <Link to="/admin/users"><FaUser /> {isOpen && 'Quản lý Người dùng'}</Link>
        </li>
        <li className={selected === 'blogs' ? 'selected' : ''} onClick={() => handleSelect('blogs')}>
          <Link to="/admin/blogs"><FaClipboard /> {isOpen && 'Quản lý Blog'}</Link>
        </li>
        <li className={selected === 'promos' ? 'selected' : ''} onClick={() => handleSelect('promos')}>
          <Link to="/admin/promos"><FaTag /> {isOpen && 'Quản lý Khuyến mãi'}</Link>
        </li>
        <li className={selected === 'send-mail' ? 'selected' : ''} onClick={() => handleSelect('send-mail')}>
          <Link to="/admin/send-mail"><FaEnvelope /> {isOpen && 'Gửi Mail'}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
