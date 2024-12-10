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
import com.orebi.entity.Category;
import com.orebi.entity.Product;
import com.orebi.entity.SubCategory;
import com.orebi.exception.ResourceNotFoundException;
import com.orebi.repository.CategoryRepository;
import com.orebi.repository.OrderRepository;
import com.orebi.repository.ProductRepository;
import com.orebi.repository.SubCategoryRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
            .map(this::convertToDTO);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        
        if (productDTO.getSubCategoryId() != null) {
            SubCategory subCategory = subCategoryRepository.findById(productDTO.getSubCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
            product.setSubCategory(subCategory);
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public Optional<ProductDTO> updateProduct(Long productId, ProductDTO productDTO) {
        if (productRepository.existsById(productId)) {
            Product product = convertToEntity(productDTO);
            product.setProductId(productId);
            
            if (productDTO.getCategoryId() != null) {
                Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                product.setCategory(category);
            }
            
            if (productDTO.getSubCategoryId() != null) {
                SubCategory subCategory = subCategoryRepository.findById(productDTO.getSubCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
                product.setSubCategory(subCategory);
            }
            
            Product updatedProduct = productRepository.save(product);
            return Optional.of(convertToDTO(updatedProduct));
        }
        return Optional.empty();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsBySubCategory(Long subCategoryId) {
        return productRepository.findBySubCategoryId(subCategoryId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
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
        dto.setDescription(product.getDescription());
        if (product.getProductDetail() != null) {
            dto.setProductDetailId(product.getProductDetail().getProductDetailId());
            dto.setDescription(product.getProductDetail().getDescription());
        }
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }
        
        if (product.getSubCategory() != null) {
            dto.setSubCategoryId(product.getSubCategory().getSubCategoryId());
        }
        
        return dto;
    }

    public Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductId(dto.getProductId());
        product.setName(dto.getName());
        product.setImage(dto.getImage());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setDiscountedPrice(dto.getDiscountedPrice());
        product.setDiscountPercentage(dto.getDiscountPercentage());
        product.setUnit(dto.getUnit());
        return product;
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

    public long getTotalProducts(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchTerm = "%" + keyword.toLowerCase() + "%";
            return productRepository.findByNameContainingIgnoreCase(searchTerm, Pageable.unpaged()).getTotalElements();
        }
        return productRepository.count();
    }
}


