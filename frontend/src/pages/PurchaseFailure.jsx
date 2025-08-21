import React from "react";
import {
  AlertTriangle,
  CreditCard,
  HelpCircle,
  Home,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ======================================================================
// AnimatedX Component - A custom SVG animation for the failure icon
// ======================================================================
const AnimatedX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    className="text-red-400"
  >
    <style>{`
      @keyframes draw-circle-fail {
        from { stroke-dashoffset: 62.8; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes draw-x-fail {
        from { stroke-dashoffset: 17; }
        to { stroke-dashoffset: 0; }
      }
      .circle-fail {
        stroke-dasharray: 62.8;
        stroke-dashoffset: 62.8;
        animation: draw-circle-fail 0.5s ease-out forwards;
      }
      .x-fail {
        stroke-dasharray: 17;
        stroke-dashoffset: 17;
        animation: draw-x-fail 0.4s ease-out 0.5s forwards;
      }
    `}</style>
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" className="circle-fail" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9l-6 6m0-6l6 6"
        className="x-fail"
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
// PurchaseFailure Component - The main component for a failed purchase
// ======================================================================
const PurchaseFailure = () => {
  const navigate = useNavigate();

  const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse"));

  return (
    <div className="font-sans antialiased text-slate-200 min-h-screen p-4 sm:p-8 animated-gradient-fail">
      <style>{`
        @keyframes gradient-animation-fail {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-fail {
          background: linear-gradient(-45deg, #0f172a, #1e293b, #4c1d24, #020617);
          background-size: 400% 400%;
          animation: gradient-animation-fail 15s ease infinite;
        }
      `}</style>
      <div className="container mx-auto max-w-3xl">
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block">
            <AnimatedX />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500 mt-4 mb-2">
            Payment Unsuccessful
          </h1>
          <p className="text-lg text-slate-400">
            Unfortunately, we were unable to process your payment.
          </p>
        </header>

        {/* Main Content Card */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-slate-700 pb-4 flex items-center gap-3">
              <AlertTriangle className="text-orange-400" />
              What Happened?
            </h2>
            <p className="text-slate-300 mb-6">
              There was an issue processing your transaction. This can happen
              for a few reasons, such as incorrect card details, insufficient
              funds, or a security block from your bank.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CreditCard
                  className="text-blue-400 mt-1 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-white">
                    Check Your Payment Details
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Please ensure the card number, expiration date, and CVC are
                    correct.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HelpCircle
                  className="text-purple-400 mt-1 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-white">
                    Try Another Method
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Sometimes trying a different card or payment service can
                    resolve the issue.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  navigate(
                    `/cart/${selectedCourse?.title.replace(/\s+/g, "-")}`,
                    {
                      state: {
                        id: selectedCourse?._id,
                      },
                    }
                  )
                }
                className="flex-1 group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:scale-105 transition-transform duration-300"
              >
                <ShoppingCart size={20} />
                <span>Return to Checkout</span>
                <ArrowRight
                  size={20}
                  className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                />
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-700/80 text-slate-200 font-semibold hover:bg-slate-700 transition-colors duration-300"
              >
                <Home size={20} />
                <span>Go to Homepage</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PurchaseFailure;
