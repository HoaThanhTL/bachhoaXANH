package com.orebi.controller;

import java.util.List;

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

import com.orebi.entity.LineItem;
import com.orebi.service.LineItemService;

@RestController
@RequestMapping("/api/line-items")
public class LineItemController {
    @Autowired
    private LineItemService lineItemService;

    @GetMapping
    public List<LineItem> getCurrentUserCart() {
        return lineItemService.getCurrentUserCart();
    }

    @PostMapping
    public LineItem addToCart(@RequestBody LineItem lineItem) {
        return lineItemService.createLineItem(lineItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LineItem> updateQuantity(@PathVariable Long id, @RequestBody LineItem lineItem) {
        return lineItemService.updateLineItem(id, lineItem)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        lineItemService.deleteLineItem(id);
        return ResponseEntity.noContent().build();
    }
}
