package com.orebi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.orebi.dto.OrderDTO;
import com.orebi.service.OrderService;
import com.orebi.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    // Xử lý thanh toán VNPay
    @PostMapping("/vnpay/create/{orderId}")
    public ResponseEntity<?> createVNPayPayment(
            @PathVariable Long orderId,
            HttpServletRequest request) {
        try {
            String paymentUrl = paymentService.createVNPayPayment(orderId, request.getRemoteAddr());
            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tạo thanh toán VNPay: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay/callback")
    public ResponseEntity<?> vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            paymentService.processVNPayCallback(params);
            return ResponseEntity.ok("Thanh toán thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xử lý callback VNPay: " + e.getMessage());
        }
    }

    // Xử lý thanh toán Banking
    @PostMapping("/banking/upload-bill/{orderId}")
    public ResponseEntity<?> uploadBankTransferBill(
            @PathVariable Long orderId,
            @RequestParam("bill") MultipartFile billImage) {
        try {
            OrderDTO updatedOrder = paymentService.processBankTransferBill(orderId, billImage);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi upload bill: " + e.getMessage());
        }
    }

    // Admin xác nhận thanh toán Banking
    @PostMapping("/banking/verify/{orderId}")
    public ResponseEntity<?> verifyBankTransfer(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> request) {
        try {
            boolean isValid = (boolean) request.get("isValid");
            String note = request.containsKey("note") ? (String) request.get("note") : null;
            
            OrderDTO updatedOrder = paymentService.verifyBankTransfer(orderId, isValid, note);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xác nhận thanh toán: " + e.getMessage());
        }
    }

    // Lấy thông tin ngân hàng
    @GetMapping("/banking/info")
    public ResponseEntity<?> getBankingInfo() {
        return ResponseEntity.ok(paymentService.getBankingInfo());
    }
}
