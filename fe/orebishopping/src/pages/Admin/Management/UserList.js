import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { FaPencilAlt, FaTrash, FaSearch, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../../../styles/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const userToken = localStorage.getItem("authToken");
    if (userToken) {
      setToken(userToken);
    } else {
      setMessage("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải danh sách người dùng.");
      }

      const data = await response.json();
      setUsers(data);
      setMessage("");
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi tải danh sách người dùng.");
      setUsers([]);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const roleA = a.role.roleName.toLowerCase();
    const roleB = b.role.roleName.toLowerCase();
    return sortOrder === "asc" ? roleA.localeCompare(roleB) : roleB.localeCompare(roleA);
  });

  const startIndex = currentPage * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleEdit = (id) => alert(`Chỉnh sửa người dùng với ID: ${id}`);
  const handleDelete = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng với ID: ${id}?`)) {
      alert(`Xóa thành công người dùng với ID: ${id}`);
    }
  };

  return (
    <div className="user-list-container">
      <div className="card">
        <div className="card-header">
          <h6 className="card-title">Quản lý người dùng</h6>
          <button className="add-user-button">
            <FaPlus className="add-icon" />
            Thêm mới
          </button>
        </div>

        <div className="card-body">
          {message && <p className="error-message">{message}</p>}

          <div className="search-container">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="items-per-page"
            >
              <option value={1}>1</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
            </select>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={user.userId}>
                  <td>{startIndex + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role.roleName}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm action-btn"
                      onClick={() => handleEdit(user.userId)}
                    >
                      <FaPencilAlt color="#054C35" /> Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm action-btn"
                      onClick={() => handleDelete(user.userId)}
                    >
                      <FaTrash color="#054C35" /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="pagination-info">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedUsers.length)} /{" "}
              {sortedUsers.length}
            </span>
            <ReactPaginate
              pageCount={totalPages}
              onPageChange={(event) => setCurrentPage(event.selected)}
              containerClassName={"pagination-nav"}
              activeClassName={"active"}
              previousLabel={<FaArrowLeft />}
              nextLabel={<FaArrowRight />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
