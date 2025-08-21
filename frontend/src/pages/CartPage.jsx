import { useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Star,
  Trash2,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import useCourseStore from "../store/useCourseStore";
import { useOrderStore } from "../store/useOrderStore";
import { useLocation } from "react-router-dom";
import StripeIntegration from "../utils/StripeIntergration";

// ======================================================================
// CourseCard Component - Reusable card for course recommendations
// ======================================================================
const CourseCard = ({ title, author, rating, image, price }) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-72 bg-gray-300 rounded-xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
      <img src={image} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-800 mb-2">{author}</p>
        <div className="flex items-center space-x-1 text-yellow-600 mb-2">
          <Star size={16} />
          <span className="text-sm font-bold">{rating}</span>
        </div>
        <p className="text-lg font-bold text-gray-900">${price}</p>
      </div>
    </div>
  );
};

// ======================================================================
// CartPage Component - The main component for the cart page
// ======================================================================
const CartPage = () => {
  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     title: "Complete web development course",
  //     author: "Hitesh Choudhary",
  //     rating: 4.6,
  //     reviews: 14114,
  //     totalHours: 86.5,
  //     lectures: 268,
  //     level: "All Levels",
  //     price: 3089,
  //     isPremium: true,
  //     image: "https://placehold.co/120x80/60a5fa/ffffff?text=Course+1",
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced web development course",
  //     author: "John Doe",
  //     rating: 4.9,
  //     reviews: 1123,
  //     totalHours: 105.5,
  //     lectures: 223,
  //     level: "Advanced",
  //     price: 2599,
  //     isPremium: false,
  //     image: "https://placehold.co/120x80/800080/ffffff?text=Course+2",
  //   },
  // ]);

  const { selectedCourse, fetchCourseById } = useCourseStore();
  const { checkout, createCheckout, isCheckingOut } = useOrderStore();

  const location = useLocation();
  const courseId = location.state?.id;

  console.log("courseId: ", courseId);
  console.log("Course: ", selectedCourse);
  console.log("Checkout: ", checkout);

  if (checkout) {
    localStorage.setItem("checkoutId", checkout);
  }

  // useEffect(() => {
  //   const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  //   setSubtotal(total);
  // }, [cartItems]);

  // const handleRemoveItem = (id) => {
  //   setCartItems(cartItems.filter((item) => item.id !== id));
  // };

  const recommendedCourses = [
    {
      title: "JS Node.js & React",
      author: "Stephen Grider",
      rating: 4.7,
      image: "https://placehold.co/288x144/f0e442/000000?text=JS+React",
      price: 150,
    },
    {
      title: "Ethical Hacking",
      author: "Zaid Sabih",
      rating: 4.8,
      image: "https://placehold.co/288x144/3498db/ffffff?text=Hacking",
      price: 199,
    },
    {
      title: "Python for Beginners",
      author: "Jose Portilla",
      rating: 4.6,
      image: "https://placehold.co/288x144/2ecc71/ffffff?text=Python",
      price: 99,
    },
    {
      title: "AWS Certified",
      author: "Stephane Maarek",
      rating: 4.9,
      image: "https://placehold.co/288x144/e74c3c/ffffff?text=AWS",
      price: 250,
    },
    {
      title: "Data Science",
      author: "Frank Kane",
      rating: 4.5,
      image: "https://placehold.co/288x144/9b59b6/ffffff?text=Data+Science",
      price: 180,
    },
  ];

  useEffect(() => {
    if (!courseId) return;

    fetchCourseById(courseId);

    createCheckout({
      courseId,
    });
  }, [courseId, createCheckout, fetchCourseById]);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 font-sans antialiased p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Shopping Checkout
        </h1>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Main Cart Section */}
          <div className="flex-1">
            {selectedCourse ? (
              <div
                key={selectedCourse._id}
                className="flex flex-col sm:flex-row items-center sm:items-start p-4 bg-gray-100 rounded-xl shadow-lg"
              >
                <img
                  src={selectedCourse.thumbnailUrl}
                  alt={selectedCourse.title}
                  className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                  <h3 className="text-xl font-semibold mb-1">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    By {selectedCourse.instructor.name}
                  </p>
                  <div className="flex items-center space-x-2 text-yellow-400 text-sm mb-2">
                    <span className="font-bold">{selectedCourse.rating}</span>
                    <Star size={16} />
                    <span className="text-gray-400">
                      ({selectedCourse.reviews} ratings)
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs flex items-center space-x-2">
                    <span>{selectedCourse.totalHours} total hours</span>
                    <span>•</span>
                    <span>{selectedCourse.lectures} lectures</span>
                    <span>•</span>
                    <span>{selectedCourse.difficulty}</span>
                  </div>
                  {selectedCourse.isPremium && (
                    <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500 text-gray-900">
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2 mt-4 sm:mt-0">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{selectedCourse?.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingCart size={48} className="mb-4" />
                <p className="text-xl">Your cart is empty!</p>
              </div>
            )}
          </div>

          {/* Checkout & Summary Section */}
          <div className="lg:w-80 mt-8 lg:mt-0 p-6 bg-gray-200 rounded-xl shadow-lg h-min sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total:</h2>
            <p className="text-4xl font-bold text-gray-800 mb-6">
              ₹{selectedCourse?.price.toLocaleString()}
            </p>
            <StripeIntegration
              course={selectedCourse}
              isCheckingOut={isCheckingOut}
            />
            <div className="border-t border-gray-700 pt-4">
              <button className="w-full py-3 rounded-full text-blue-400 border border-blue-400 hover:bg-blue-900 hover:text-gray-100 transition-colors duration-200 font-semibold text-sm">
                Apply Coupon
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">You might also like</h2>
            <button className="text-gray-900 hover:text-gray-800">
              <ChevronRight size={24} />
            </button>
          </div>
          <div
            className="flex space-x-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {recommendedCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
