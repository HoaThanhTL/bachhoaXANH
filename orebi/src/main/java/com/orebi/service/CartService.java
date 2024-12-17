package com.orebi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
import com.orebi.entity.PaymentMethod;
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
    @Transactional(readOnly = false)
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
        // Lấy giỏ hàng hiện tại của user đang đăng nhập
        Cart cart = getCurrentUserCart();
        
        // Tìm và xóa LineItem có productId tương ứng
        boolean removed = cart.getLineItems().removeIf(item -> 
            item.getProduct().getProductId().equals(productId));
        
        // Kiểm tra nếu không xóa được sản phẩm nào
        if (!removed) {
            throw new ResourceNotFoundException("Product not found in cart");
        }
        cart.setUpdatedAt(LocalDateTime.now());
        
        // Lưu giỏ hàng đã cập nhật vào database
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

    public Order checkoutSelectedItems(OrderDTO orderDTO) {
        // Lấy cart hiện tại
        Cart cart = getCart();
        
        // Filter chỉ lấy những lineItem được chọn
        List<LineItem> selectedItems = cart.getLineItems().stream()
            .filter(item -> orderDTO.getSelectedLineItemIds()
                .contains(item.getLineItemId()))
            .collect(Collectors.toList());
        
        // Validate
        if (selectedItems.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm được chọn");
        }
        
        // Tạo order mới với selected items
        Order order = new Order();
        order.setUser(userService.getCurrentUser());
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setPhone(orderDTO.getPhone());
        order.setNote(orderDTO.getNote());
        order.setIsPaid(false);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        if (orderDTO.getPaymentMethod() == PaymentMethod.COD || orderDTO.getPaymentMethod() == PaymentMethod.BANKING) {
            order.setStatus(OrderStatus.PENDING);
        } else {
            order.setStatus(OrderStatus.PENDING_PAYMENT);
        }

        // Tính tổng tiền chỉ cho selected items
        double totalPrice = selectedItems.stream()
            .mapToDouble(item -> item.getProduct().getDiscountedPrice() * item.getQuantity())
            .sum();
        order.setTotalPrice(totalPrice);
        
        // Tạo order details cho selected items
        List<OrderDetail> orderDetails = selectedItems.stream()
            .map(item -> {
                OrderDetail detail = new OrderDetail();
                detail.setOrder(order);
                detail.setQuantity(item.getQuantity());
                detail.setTotalLineItem(item.getProduct().getDiscountedPrice() * item.getQuantity());
                detail.setSnapshotProductId(item.getProduct().getProductId());
                detail.setSnapshotProductName(item.getProduct().getName());
                detail.setSnapshotProductImage(item.getProduct().getImage());
                detail.setSnapshotPrice(item.getProduct().getDiscountedPrice());
                return detail;
            })
            .collect(Collectors.toList());
        
        order.setOrderDetails(orderDetails);
        
        // Save order
        return orderRepository.save(order);
    }
}
