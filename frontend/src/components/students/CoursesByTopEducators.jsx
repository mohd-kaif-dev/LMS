import CourseCard from "../user/CourseCard";

const CoursesByTopEducators = () => {
  const topEducatorCourses = [
    {
      _id: 1,
      title: "Procreate Animation: Create a GIF",
      instructor: "L. Bardot",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Top+Educator+Course+1",
      isStaffPick: true,
      rating: 5.0,
      students: "22,400",
      duration: "1h 55m",
    },
    {
      _id: 2,
      title: "Productivity for Creatives",
      instructor: "T. E. Johnson",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Top+Educator+Course+2",
      isStaffPick: false,
      rating: 4.9,
      students: "18,700",
      duration: "2h 30m",
    },
    {
      _id: 3,
      title: "Drawing Expressive Hands in Ink",
      instructor: "S. K. Lee",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Top+Educator+Course+3",
      isStaffPick: true,
      rating: 4.9,
      students: "9,800",
      duration: "3h 25m",
    },
    {
      _id: 4,
      title: "Storytelling in Photography",
      instructor: "A. Miller",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Top+Educator+Course+4",
      isStaffPick: false,
      rating: 4.8,
      students: "14,500",
      duration: "4h 15m",
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Courses by Top Educators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topEducatorCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesByTopEducators;
