import CourseCard from "../user/CourseCard";

const PopularCourses = () => {
  const popularCourses = [
    {
      _id: 1,
      title: "Fundamentals of Graphic Design",
      instructor: "S. Peterson",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Popular+Course+1",
      isStaffPick: false,
      rating: 4.6,
      students: "5,800",
      duration: "4h 10m",
    },
    {
      _id: 2,
      title: "Introduction to Hand Lettering",
      instructor: "M. Adams",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Popular+Course+2",
      isStaffPick: true,
      rating: 4.9,
      students: "10,120",
      duration: "2h 50m",
    },
    {
      _id: 3,
      title: "Social Media Strategy for Creatives",
      instructor: "J. Harper",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Popular+Course+3",
      isStaffPick: false,
      rating: 4.7,
      students: "7,300",
      duration: "3h 30m",
    },
    {
      _id: 4,
      title: "Drawing a Digital Portrait",
      instructor: "L. Gomez",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Popular+Course+4",
      isStaffPick: true,
      rating: 4.8,
      students: "14,000",
      duration: "5h 50m",
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Popular Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;
