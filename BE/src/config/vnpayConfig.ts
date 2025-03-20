import dotenv from "dotenv";

dotenv.config();

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMNCODE as string,
  vnp_HashSecret: process.env.VNP_HASHSECRET as string,
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: `http://10.0.2.2:4000/api/payments/vnpay/callback`,
};
