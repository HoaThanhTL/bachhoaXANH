import React, { useState, useEffect } from "react";
import "./EditProfile.css";

const EditProfile = ({ user, updateUserProfile }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // Lấy token từ localStorage khi component mount
  useEffect(() => {
    const userToken = localStorage.getItem("authToken");
    if (userToken) {
      setToken(userToken);
      console.log("Access Token:", userToken);
    } else {
      setMessage("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }
  }, []);

  // Xử lý khi giá trị form thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Kiểm tra dữ liệu đầu vào trước khi gửi
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Tên không được để trống.";
    }
    if (!formData.phone.trim()) {
      return "Số điện thoại không được để trống.";
    }
    if (!formData.address.trim()) {
      return "Địa chỉ không được để trống.";
    }
    return null;
  };

  // Lưu thông tin người dùng
  const handleSave = async () => {
    if (!token) {
      setMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    // Kiểm tra dữ liệu
    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    // Tạo payload phù hợp với BE
    const payload = {
      name: formData.fullName,
      phone: formData.phone,
      address: formData.address, // Gửi đúng các trường BE cho phép
    };

    console.log("Payload gửi đi:", payload);

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/users/current`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Thông tin lỗi:", result);
        throw new Error(result.message || "Cập nhật không thành công.");
      }

      setMessage("Cập nhật thông tin thành công!");
      console.log("Thông tin đã cập nhật:", result);
      updateUserProfile(result);
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
      console.error("Lỗi:", error.message);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <div className="profile-info">
        <div className="profile-field">
          <label>Full Name:</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
          />
        </div>
        <div className="profile-field">
          <label>Phone:</label>
          <input
            type="text"
            value={formData.phone}
            onChange={handleChange}
            name="phone"
          />
        </div>
        <div className="profile-field">
          <label>Address:</label>
          <input
            type="text"
            value={formData.address}
            onChange={handleChange}
            name="address"
          />
        </div>

        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default EditProfile;
