import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const Subscription = () => {
  const navigate = useNavigate();
    const { setSubscription, token } = useContext(AuthContext);

  const plans = [
    { id: "normal", name: "Normal Plan", price: 99, benefits: ["Access to limited movies", "No HD Streaming"] },
    { id: "premium", name: "Premium Plan", price: 299, benefits: ["Unlimited access", "HD Streaming", "No Ads"] },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const paymentResponse = async (planName) =>{
    try{
      if(!token){
        throw new Error("User not logged in");
      }
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/subscribe",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Subscription status updated successfully", response.data);
    }catch(err){
      alert("Error in updating subscription status");
      console.error("Error in updating subscription status", err);
      return
    }
    setSubscription(true);
    navigate(`/welcome?plan=${planName}`);
  }

  const handlePayment = async (plan) => {
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      alert("Failed to load payment gateway. Please try again.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/payment/razorpay", {
        amount: plan.price * 100,
        currency: "INR",
        planId: plan.id,
      });

      const options = {
        key: "rzp_test_tcw7K00n3n9dSW",
        amount: data.amount,
        currency: data.currency,
        name: "Movie Subscription",
        description: `${plan.name} Plan`,
        order_id: data.id,
        handler: function (response) {
          paymentResponse(plan.name);
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Choose Your Subscription Plan</h1>
      <div className="flex gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="text-lg font-semibold my-4">₹{plan.price}/month</p>
            <ul className="text-sm mb-4">
              {plan.benefits.map((benefit, index) => (
                <li key={index}>✅ {benefit}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
