import { NavLink } from "react-router-dom";
import { categories } from "../../utils/constant";

const CategoryMarquee = () => {
  return (
    <div className="relative w-full bg-gray-100 overflow-hidden py-8">
      <div className=" w-[200%] animate-marquee">
        {[...categories, ...categories].map((category, index) => (
          <NavLink
            key={index}
            to={`/category/${category.title.toLowerCase().replace(/ /g, "-")}`}
            className="group relative w-72 h-96 mx-4 rounded-xl overflow-hidden shadow-2xl"
            style={{ minWidth: "288px" }}
          >
            {/* <div
              className="absolute inset-0 bg-cover bg-center brightness-75 transition-all duration-300 group-hover:brightness-100"
              style={{ backgroundImage: `url(${category.image})` }}
            ></div> */}
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 object-cover w-full h-full brightness-75 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white z-10 p-4">
              <h3 className="text-xl md:text-2xl font-extrabold uppercase mb-1 drop-shadow-md">
                {category.title}
              </h3>
              <p className="text-sm font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Explore classes in this category
              </p>
            </div>
            <span className="absolute inset-0"></span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CategoryMarquee;
