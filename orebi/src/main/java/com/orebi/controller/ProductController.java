package com.orebi.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.ProductDTO;
import com.orebi.entity.Product;
import com.orebi.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product createdProduct = productService.createProduct(product);
        return convertToDTO(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return productService.updateProduct(id, convertToEntity(productDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public List<ProductDTO> getProductsBySubCategory(@PathVariable Long subCategoryId) {
        return productService.getProductsBySubCategory(subCategoryId).stream()
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
        if (product.getProductDetail() != null) {
            dto.setProductDetailId(product.getProductDetail().getProductDetailId());
            dto.setDescription(product.getProductDetail().getDescription());
        }
        return dto;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setProductId(productDTO.getProductId());
        product.setName(productDTO.getName());
        product.setImage(productDTO.getImage());
        product.setOriginalPrice(productDTO.getOriginalPrice());
        product.setDiscountedPrice(productDTO.getDiscountedPrice());
        product.setDiscountPercentage(productDTO.getDiscountPercentage());
        product.setUnit(productDTO.getUnit());
        return product;
    }
}