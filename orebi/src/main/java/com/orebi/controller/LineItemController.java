package com.orebi.controller;

import com.orebi.entity.LineItem;
import com.orebi.service.LineItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/line-items")
public class LineItemController {
    @Autowired
    private LineItemService lineItemService;

    @GetMapping
    public List<LineItem> getAllLineItems() {
        return lineItemService.getAllLineItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineItem> getLineItemById(@PathVariable Long id) {
        return lineItemService.getLineItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LineItem createLineItem(@RequestBody LineItem lineItem) {
        return lineItemService.createLineItem(lineItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LineItem> updateLineItem(@PathVariable Long id, @RequestBody LineItem lineItem) {
        return lineItemService.updateLineItem(id, lineItem)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLineItem(@PathVariable Long id) {
        lineItemService.deleteLineItem(id);
        return ResponseEntity.noContent().build();
    }
}
