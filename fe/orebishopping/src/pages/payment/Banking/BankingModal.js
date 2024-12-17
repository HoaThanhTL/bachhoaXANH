// BankingModal.js
import React from "react";
import "./Banking.css";

const BankingModal = ({ bankingInfo, onUploadBill, onClose, onChangeBillImage }) => {
  return (
    <div className="fixed top-0 z-99999 left-0 right-0 mt-[5%] bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded">
        <h3 className="font-semibold text-lg">Thông tin chuyển khoản</h3>
        {/* Corrected image tag with the src attribute */}
        <img src="https://i.imgur.com/cus0NeC.png" alt="Banking Info" className="w-[50%] h-auto mt-4" />
        <p>Tên tài khoản: {bankingInfo?.accountName}</p>
        <p>Tên ngân hàng: {bankingInfo?.bankName}</p>
        <p>Số tài khoản: {bankingInfo?.accountNumber}</p>

        <div className="mt-4">
          <label htmlFor="billImage" className="block mb-1">Chọn ảnh hóa đơn:</label>
          <input
            type="file"
            id="billImage"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={onChangeBillImage}
          />
        </div>

        <button
          onClick={onUploadBill}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Tải hóa đơn
        </button>

        <button
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded mt-4"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default BankingModal;
