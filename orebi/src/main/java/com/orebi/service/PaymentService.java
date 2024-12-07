package com.orebi.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

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

    @Value("${vnpay.base-url}")
    private String vnpayBaseUrl;

    // Xử lý VNPay
    public String createVNPayPayment(Long orderId, String ipAddress) throws Exception {
        Order order = orderService.getOrderEntityById(orderId);
        
        if (order.getPaymentMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }

        if (order.getStatus() == OrderStatus.PENDING) {
            throw new RuntimeException("Đơn hàng chưa được xác nhận");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Đơn hàng đã bị hủy");
        }

        if (order.getIsPaid() || order.getStatus() == OrderStatus.COMPLETED) {
            throw new RuntimeException("Đơn hàng đã được thanh toán");
        }

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnpayMerchantId);
        vnp_Params.put("vnp_Amount", String.valueOf((long)order.getTotalPrice() * 100));
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_CreateDate", getCreateDate());
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_IpAddr", ipAddress);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderId());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_ReturnUrl", vnpayReturnUrl);
        vnp_Params.put("vnp_TxnRef", String.valueOf(order.getOrderId()));

        return buildVNPayUrl(vnp_Params);
    }

    public void processVNPayCallback(Map<String, String> params) {
        if (!validateVNPayCallback(params)) {
            throw new RuntimeException("Dữ liệu callback không hợp lệ");
        }

        String orderId = params.get("vnp_TxnRef");
        String transactionNo = params.get("vnp_TransactionNo");
        String responseCode = params.get("vnp_ResponseCode");
        String bankCode = params.get("vnp_BankCode");
        String payDate = params.get("vnp_PayDate");
        
        Order order = orderService.getOrderEntityById(Long.parseLong(orderId));
        order.setVnpayTransactionNo(transactionNo);
        


        if ("00".equals(responseCode)) {
            order.setStatus(OrderStatus.COMPLETED);
            order.setIsPaid(true);
            order.setPaymentNote(String.format(
                "Thanh toán thành công qua %s vào lúc %s", 
                bankCode, 
                formatPayDate(payDate)
            ));
        } else {
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            order.setPaymentNote(String.format(
                "Thanh toán thất bại. Mã lỗi: %s, Ngân hàng: %s", 
                responseCode, 
                bankCode
            ));
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
    private String getCreateDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        return formatter.format(cld.getTime());
    }

    private String formatPayDate(String payDate) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            return outputFormat.format(inputFormat.parse(payDate));
        } catch (Exception e) {
            return payDate;
        }
    }

    private String buildVNPayUrl(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(vnpaySecretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        
        return vnpayBaseUrl + "?" + queryUrl;
    }

    private boolean validateVNPayCallback(Map<String, String> params) {
        // Kiểm tra chữ ký số
        String vnp_SecureHash = params.get("vnp_SecureHash");
        if (vnp_SecureHash == null) {
            return false;
        }

        // Tạo map mới và loại bỏ chữ ký số để tính toán
        Map<String, String> validParams = new HashMap<>(params);
        validParams.remove("vnp_SecureHash");
        validParams.remove("vnp_SecureHashType");
        
        // Sắp xếp tham số theo thứ tự
        List<String> fieldNames = new ArrayList<>(validParams.keySet());
        Collections.sort(fieldNames);
        
        // Tạo chuỗi hash
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = validParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        // So sánh chữ ký số
        String calculatedHash = hmacSHA512(vnpaySecretKey, hashData.toString());
        return calculatedHash.equals(vnp_SecureHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            byte[] hmacData = org.apache.commons.codec.digest.HmacUtils.hmacSha512(
                key.getBytes(), 
                data.getBytes()
            );
            return org.apache.commons.codec.binary.Hex.encodeHexString(hmacData);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký số: " + e.getMessage());
        }
    }
}
