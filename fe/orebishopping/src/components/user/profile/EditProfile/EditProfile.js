// src/components/user/profile/EditProfile/EditProfile.js
import React, { useState } from "react";
import "./EditProfile.css";

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    birthday: user.birthday,
    gender: user.gender,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Logic để lưu thay đổi (có thể thêm các API call ở đây)
    alert("Changes saved successfully!");
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
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
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
          <label>Birthday:</label>
          <input
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            name="birthday"
          />
        </div>
        <div className="profile-field">
          <label>Gender:</label>
          <select
            value={formData.gender}
            onChange={handleChange}
            name="gender"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
