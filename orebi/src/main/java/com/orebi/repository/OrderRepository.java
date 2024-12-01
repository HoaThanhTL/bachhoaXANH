package com.orebi.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.orebi.entity.Order;
import com.orebi.entity.OrderStatus;
import com.orebi.entity.Product;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserIdOrderByDateDesc(Long userId);
    List<Order> findByStatus(OrderStatus status);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o")
    Double sumTotalPrice();
    
    Long countByDateStartsWith(String date);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();
    
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
    
    @Query(value = """
        SELECT c.name as category, COUNT(od.order_id) as orderCount, 
        SUM(od.total_line_item) as totalSales 
        FROM category c 
        JOIN product p ON p.category_id = c.category_id 
        JOIN order_detail od ON od.product_id = p.product_id 
        GROUP BY c.category_id, c.name
        ORDER BY totalSales DESC
        """, nativeQuery = true)
    List<Map<String, Object>> findCategorySales();
    
    @Query(value = """
        SELECT p.* FROM product p 
        JOIN order_detail od ON od.product_id = p.product_id 
        GROUP BY p.product_id 
        ORDER BY SUM(od.quantity) DESC 
        LIMIT 10
        """, nativeQuery = true)
    List<Product> findTopSellingProducts();
}
