import axios from 'axios';

const API_URL = 'http://127.0.0.1:8080/api/products';

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Trả về trực tiếp dữ liệu từ API
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
