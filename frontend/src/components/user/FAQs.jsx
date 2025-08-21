import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { faqData } from "../../utils/constant";

const FAQs = () => {
  const [openQuestionId, setOpenQuestionId] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 michroma-regular">
          Frequently Asked Questions
        </h2>
        <div className="bg-black text-gray-200">
          {faqData.map((item) => (
            <div key={item.id} className="border-b border-gray-700">
              <button
                onClick={() => toggleQuestion(item.id)}
                className="flex items-center justify-between w-full py-6 px-4 text-left focus:outline-none"
              >
                <span
                  className={`text-xl font-semibold ${
                    openQuestionId === item.id ? "text-blue-500" : ""
                  }`}
                >
                  {item.question}
                </span>
                {openQuestionId === item.id ? (
                  <FaChevronUp size={24} className="text-white" />
                ) : (
                  <FaChevronDown size={24} className="text-white" />
                )}
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openQuestionId === item.id ? "max-h-screen" : "max-h-0"
                }`}
              >
                <p className="py-4 px-4 text-gray-400">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
