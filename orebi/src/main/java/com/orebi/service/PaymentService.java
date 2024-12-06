package com.orebi.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.orebi.Cloudinary.CloudinaryService;
import com.orebi.dto.OrderDTO;
import com.orebi.entity.Order;
import com.orebi.entity.OrderStatus;
import com.orebi.entity.PaymentMethod;
@Service
public class PaymentService {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Value("${vnpay.merchant-id}")
    private String vnpayMerchantId;

    @Value("${vnpay.secret-key}")
    private String vnpaySecretKey;

    @Value("${banking.account-number}")
    private String bankAccountNumber;

    @Value("${banking.account-name}")
    private String bankAccountName;

    @Value("${banking.bank-name}")
    private String bankName;

    @Value("${vnpay.return-url}")
    private String vnpayReturnUrl;

    // Xử lý VNPay
    public String createVNPayPayment(Long orderId, String ipAddress) throws Exception {
        Order order = orderService.getOrderEntityById(orderId);
        
        if (order.getPaymentMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }
        
        if (order.getIsPaid()) {
            throw new RuntimeException("Đơn hàng đã được thanh toán");
        }

        return createVNPayUrl(order, ipAddress);
    }

    public void processVNPayCallback(Map<String, String> params) {
        if (!validateVNPayCallback(params)) {
            throw new RuntimeException("Dữ liệu callback không hợp lệ");
        }

        String orderId = params.get("vnp_TxnRef");
        String transactionNo = params.get("vnp_TransactionNo");
        String responseCode = params.get("vnp_ResponseCode");
        
        Order order = orderService.getOrderEntityById(Long.parseLong(orderId));
        order.setVnpayTransactionNo(transactionNo);
        
        if ("00".equals(responseCode)) {
            order.setStatus(OrderStatus.PENDING);
            order.setIsPaid(true);
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            order.setPaymentNote("Mã lỗi VNPay: " + responseCode);
        }
        
        orderService.saveOrder(order);
    }

    // Xử lý Banking
    public OrderDTO processBankTransferBill(Long orderId, MultipartFile billImage) {
        if (billImage == null || billImage.isEmpty()) {
            throw new RuntimeException("Vui lòng upload ảnh bill");
        }

        Order order = orderService.getOrderEntityById(orderId);
        
        if (order.getPaymentMethod() != PaymentMethod.BANKING) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }

        try {
            String imageUrl = cloudinaryService.uploadFile(billImage).getUrl();
            order.setBankTransferImage(imageUrl);
            order.setStatus(OrderStatus.PENDING_PAYMENT);
            return orderService.saveOrder(order);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi upload bill: " + e.getMessage());
        }
    }

    public OrderDTO verifyBankTransfer(Long orderId, boolean isValid, String note) {
        Order order = orderService.getOrderEntityById(orderId);
        
        if (order.getPaymentMethod() != PaymentMethod.BANKING) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ");
        }

        if (isValid) {
            order.setStatus(OrderStatus.PENDING);
            order.setIsPaid(true);
            order.setPaymentNote("Thanh toán thành công");
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            order.setPaymentNote(note != null ? note : "Thanh toán thất bại");
        }
        
        return orderService.saveOrder(order);
    }

    // Lấy thông tin banking
    public Map<String, String> getBankingInfo() {
        Map<String, String> bankInfo = new HashMap<>();
        bankInfo.put("accountNumber", bankAccountNumber);
        bankInfo.put("accountName", bankAccountName);
        bankInfo.put("bankName", bankName);
        return bankInfo;
    }

    // Các phương thức hỗ trợ
    private String createVNPayUrl(Order order, String ipAddress) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = "Thanh toan don hang " + order.getOrderId();
        String vnp_TxnRef = String.valueOf(order.getOrderId());
        String vnp_IpAddr = ipAddress;
        String vnp_TmnCode = vnpayMerchantId;
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf((long)order.getTotalPrice() * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpayReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Tạo URL thanh toán
        return buildVNPayUrl(vnp_Params);
    }

    private boolean validateVNPayCallback(Map<String, String> params) {
        // Kiểm tra chữ ký
        String signValue = params.get("vnp_SecureHash");
        String calculatedHash = calculateVNPayHash(params);
        
        if (!signValue.equals(calculatedHash)) {
            return false;
        }

        // Kiểm tra các tham số bắt buộc
        String[] requiredParams = {
            "vnp_TxnRef", "vnp_TransactionNo", "vnp_ResponseCode",
            "vnp_Amount", "vnp_BankCode"
        };
        
        for (String param : requiredParams) {
            if (!params.containsKey(param)) {
                return false;
            }
        }

        return true;
    }

    private String calculateVNPayHash(Map<String, String> params) {
        // Implement VNPay hash calculation
        return "hash_value";
    }

    private String buildVNPayUrl(Map<String, String> params) {
        // Implement VNPay URL building
        return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..." + params;
    }
}
