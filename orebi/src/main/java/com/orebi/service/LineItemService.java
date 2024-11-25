package com.orebi.service;

import com.orebi.entity.LineItem;
import com.orebi.repository.LineItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LineItemService {
    @Autowired
    private LineItemRepository lineItemRepository;

    public List<LineItem> getAllLineItems() {
        return lineItemRepository.findAll();
    }

    public Optional<LineItem> getLineItemById(Long id) {
        return lineItemRepository.findById(id);
    }

    public LineItem createLineItem(LineItem lineItem) {
        return lineItemRepository.save(lineItem);
    }

    public Optional<LineItem> updateLineItem(Long id, LineItem lineItem) {
        if (lineItemRepository.existsById(id)) {
            lineItem.setLineItemId(id);
            return Optional.of(lineItemRepository.save(lineItem));
        }
        return Optional.empty();
    }

    public void deleteLineItem(Long id) {
        lineItemRepository.deleteById(id);
    }
}
