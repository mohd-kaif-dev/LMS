import React, { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => (total += item.price));
    setSubtotal(total);
  }, [cartItems]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-gray-900">
              <ShoppingCart size={24} />
              <h2 className="text-2xl font-bold">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-800 hover:text-gray-900 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gray-300 shadow-sm"
                >
                  <img
                    src={item.course.thumbnailUrl}
                    alt={item.course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.course.title}
                    </h3>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                  </div>
                  <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-800">
              <ShoppingCart size={48} className="mb-4" />
              <p className="text-xl">Your cart is empty!</p>
            </div>
          )}

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-4">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="w-full py-3 rounded-full bg-blue-500 text-black font-semibold text-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
