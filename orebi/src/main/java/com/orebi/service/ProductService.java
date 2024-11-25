package com.orebi.service;

import com.orebi.entity.Product;
import com.orebi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
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
}
