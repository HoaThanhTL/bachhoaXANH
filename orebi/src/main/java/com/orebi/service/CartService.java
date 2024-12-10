package com.orebi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orebi.dto.OrderDTO;
import com.orebi.dto.ProductDTO;
import com.orebi.entity.Cart;
import com.orebi.entity.LineItem;
import com.orebi.entity.Order;
import com.orebi.entity.OrderDetail;
import com.orebi.entity.OrderStatus;
import com.orebi.entity.Product;
import com.orebi.entity.User;
import com.orebi.exception.ResourceNotFoundException;
import com.orebi.repository.CartRepository;
import com.orebi.repository.OrderRepository;


@Service
@Transactional
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;

    // Lấy giỏ hàng hiện tại của user
    public Cart getCurrentUserCart() {
        User currentUser = userService.getCurrentUser();
        
        return cartRepository.findByUser(currentUser)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUser(currentUser);
                newCart.setLineItems(new ArrayList<>());
                newCart.setUpdatedAt(LocalDateTime.now());
                return cartRepository.save(newCart);
            });
    }

    // Thêm sản phẩm vào giỏ hàng
    public Cart addToCart(Long productId, Integer quantity) {
        Cart cart = getCurrentUserCart();
        ProductDTO productDTO = productService.getProductById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Chuyển đổi ProductDTO thành Product
        Product product = productService.convertToEntity(productDTO);

        Optional<LineItem> existingItem = cart.getLineItems().stream()
            .filter(item -> item.getProduct().getProductId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            LineItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            LineItem newItem = new LineItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getLineItems().add(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // Cập nhật số lượng sản phẩm
    public Cart updateQuantity(Long productId, Integer quantity) {
        Cart cart = getCurrentUserCart();
        LineItem item = cart.getLineItems().stream()
            .filter(i -> i.getProduct().getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        item.setQuantity(quantity);
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public Cart removeFromCart(Long productId) {
        Cart cart = getCurrentUserCart();
        cart.getLineItems().removeIf(item -> 
            item.getProduct().getProductId().equals(productId));
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // Xem giỏ hàng
    public Cart getCart() {
        return getCurrentUserCart();
    }

    // Xóa toàn bộ giỏ hàng
    public void clearCart() {
        Cart cart = getCurrentUserCart();
        cart.getLineItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    // Chuyển từ Cart sang Order
    public Order checkout(OrderDTO orderDTO) {
        Cart cart = getCurrentUserCart();
        
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setPhone(orderDTO.getPhone());
        order.setNote(orderDTO.getNote());
        order.setIsPaid(false);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // Gom nhóm các sản phẩm giống nhau
        Map<Long, LineItem> groupedItems = cart.getLineItems().stream()
            .collect(Collectors.groupingBy(
                item -> item.getProduct().getProductId(),
                Collectors.reducing(null, (a, b) -> {
                    if (a == null) return b;
                    a.setQuantity(a.getQuantity() + b.getQuantity());
                    return a;
                })
            ));

        // Tạo orderDetails từ các sản phẩm đã gom nhóm
        List<OrderDetail> orderDetails = groupedItems.values().stream()
            .map(lineItem -> {
                OrderDetail detail = new OrderDetail();
                Product product = lineItem.getProduct();
                
                detail.setOrder(order);
                detail.setProductId(product.getProductId());
                detail.setProductName(product.getName());
                detail.setProductImage(product.getImage());
                detail.setPrice(product.getDiscountedPrice());
                detail.setQuantity(lineItem.getQuantity());
                detail.setTotalLineItem(product.getDiscountedPrice() * lineItem.getQuantity());
                
                return detail;
            })
            .collect(Collectors.toList());

        order.setOrderDetails(orderDetails);
        order.setTotalPrice(orderDetails.stream()
            .mapToDouble(OrderDetail::getTotalLineItem)
            .sum());

        return orderRepository.save(order);
    }
}
