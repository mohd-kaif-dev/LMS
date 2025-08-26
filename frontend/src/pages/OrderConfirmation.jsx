import React, { useEffect } from "react";
import {
  Check,
  Package,
  CreditCard,
  User,
  ExternalLink,
  Calendar,
  Hash,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
// Assuming you have a store setup like Zustand or Redux
import { useOrderStore } from "../store/useOrderStore";
import { useNavigate } from "react-router-dom";

import { dateFormat } from "../utils/constant";

// ======================================================================
// AnimatedCheck Component - A custom SVG animation for the success icon
// ======================================================================
const AnimatedCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    className="text-green-400"
  >
    <style>{`
      @keyframes draw-circle {
        from { stroke-dashoffset: 31.4; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes draw-check {
        from { stroke-dashoffset: 12; }
        to { stroke-dashoffset: 0; }
      }
      .circle {
        stroke-dasharray: 31.4;
        stroke-dashoffset: 31.4;
        animation: draw-circle 0.5s ease-out forwards;
      }
      .check {
        stroke-dasharray: 12;
        stroke-dashoffset: 12;
        animation: draw-check 0.4s ease-out 0.5s forwards;
      }
    `}</style>
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" className="circle" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 12l1.5 1.5l3-3"
        className="check"
      />
    </g>
    {/* Pulsing glow effect */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="none"
      fill="currentColor"
      className="opacity-20 animate-pulse"
    />
  </svg>
);

// ======================================================================
// GlassCard Component - A reusable component for the glassmorphism effect
// ======================================================================
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

// ======================================================================
// OrderConfirmation Component - The main component for the order confirmation page
// ======================================================================
const OrderConfirmation = () => {
  const { order, checkoutSuccessAndCreateOrder } = useOrderStore();

  // In a real app, you'd get this from the URL or local storage
  const checkoutId = localStorage.getItem("checkoutId");

  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you might only fetch if the order is not already in the store
    if (!order && checkoutId) {
      checkoutSuccessAndCreateOrder(checkoutId);
    }
  }, [checkoutId, checkoutSuccessAndCreateOrder, order]);

  const capitalize = (word) => {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  if (!order) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        Loading your order details...
      </div>
    );
  }

  console.log(order);

  return (
    <div className=" text-slate-200 min-h-screen p-4 sm:p-8 animated-gradient">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block">
            <AnimatedCheck />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500 mt-4 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-400">
            Thank you for your purchase. Your learning journey starts now!
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Details & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {order.courses.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-24 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          By {item.instructor.name}
                        </p>
                      </div>
                      <p className="font-bold text-slate-100">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* What's Next? */}
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                What's Next?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    navigate(
                      `/courses/${order.courses[0].title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}/learn/${
                        order.courses[0].sections[0].lessons[0]._id
                      }`
                    )
                  }
                  className="flex-1 group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition-transform duration-300"
                >
                  <ExternalLink size={20} />
                  <span>Start Learning</span>
                  <ArrowRight
                    size={20}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </button>
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-700/80 text-slate-200 font-semibold hover:bg-slate-700 transition-colors duration-300"
                >
                  <User size={20} />
                  <span>Go to My Dashboard</span>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Order Details */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-white mb-5">
                Order Details
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Hash size={16} /> Order ID
                  </span>
                  <span className="font-mono text-slate-200">
                    {order.orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Calendar size={16} /> Date
                  </span>
                  <span className="text-slate-200">
                    {dateFormat(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-slate-400">
                    <CreditCard size={16} /> Payment Method
                  </span>
                  <span className="text-slate-200">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-slate-400">
                    <BadgeCheck size={16} /> Payment Status
                  </span>
                  <span className="font-semibold px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                    {capitalize(order.paymentStatus)}
                  </span>
                </div>
                <div className="border-t border-slate-700 my-4"></div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-slate-300">
                    Total Paid
                  </span>
                  <span className="font-bold text-green-400">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
