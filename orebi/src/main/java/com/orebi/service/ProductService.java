package com.orebi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.orebi.dto.ProductDTO;
import com.orebi.entity.Product;
import com.orebi.repository.CategoryRepository;
import com.orebi.repository.OrderRepository;
import com.orebi.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Long id, Product product) {
        if (productRepository.existsById(id)) {
            product.setProductId(id);
            return Optional.of(productRepository.save(product));
        }
        return Optional.empty();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public Optional<ProductDTO> updateProduct(Long productId, ProductDTO productDTO) {
        if (productRepository.existsById(productId)) {
            Product product = convertToEntity(productDTO);
            product.setProductId(productId);
            Product updatedProduct = productRepository.save(product);
            return Optional.of(convertToDTO(updatedProduct));
        }
        return Optional.empty();
    }

    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setImage(dto.getImage());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setDiscountedPrice(dto.getDiscountedPrice());
        product.setDiscountPercentage(dto.getDiscountPercentage());
        product.setUnit(dto.getUnit());
        return product;
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setImage(product.getImage());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setUnit(product.getUnit());
        if (product.getProductDetail() != null) {
            dto.setProductDetailId(product.getProductDetail().getProductDetailId());
            dto.setDescription(product.getProductDetail().getDescription());
        }
        return dto;
    }

    public Map<String, Object> getProductStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        return stats;
    }

    public List<ProductDTO> getTopSellingProducts() {
        return orderRepository.findTopSellingProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Product> getProductsBySubCategory(Long subCategoryId) {
        return productRepository.findBySubCategoryId(subCategoryId);
    }

    public List<ProductDTO> getAllProductsPaged(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchTerm = "%" + keyword.toLowerCase() + "%";
            productPage = productRepository.findByNameContainingIgnoreCase(searchTerm, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        
        return productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Thêm phương thức mới để lấy tổng số sản phẩm theo từ khóa
    public long getTotalProducts(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchTerm = "%" + keyword.toLowerCase() + "%";
            return productRepository.findByNameContainingIgnoreCase(searchTerm, Pageable.unpaged()).getTotalElements();
        }
        return productRepository.count();
    }
}


