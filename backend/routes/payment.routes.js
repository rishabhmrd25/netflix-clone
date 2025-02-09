import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_tcw7K00n3n9dSW", // Replace with your Razorpay Key
  key_secret: "bE1S2UzGKWtlBoRT1HbMsp80",  // Replace with your Razorpay Secret
});

router.post("/razorpay", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: "order_rcptid_11",
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

export default router;
