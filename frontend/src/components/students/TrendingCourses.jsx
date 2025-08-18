import CourseCard from "../user/CourseCard";

const TrendingCourses = () => {
  const trendingCourses = [
    {
      _id: 1,
      title: "AI for Artists: Image Generation",
      instructor: "N. Sharma",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Trending+Course+1",
      isStaffPick: false,
      rating: 4.9,
      students: "9,500",
      duration: "2h 15m",
    },
    {
      _id: 2,
      title: "Modern Calligraphy: Brush Pen Lettering",
      instructor: "C. Wright",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Trending+Course+2",
      isStaffPick: true,
      rating: 4.8,
      students: "16,000",
      duration: "3h 45m",
    },
    {
      _id: 3,
      title: "Introduction to Podcasting",
      instructor: "E. Rodriguez",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Trending+Course+3",
      isStaffPick: false,
      rating: 4.7,
      students: "6,200",
      duration: "4h 20m",
    },
    {
      _id: 4,
      title: "Logo Design Mastery in Procreate",
      instructor: "D. Evans",
      imageUrl:
        "https://placehold.co/400x250/1F2937/ffffff?text=Trending+Course+4",
      isStaffPick: true,
      rating: 4.9,
      students: "11,300",
      duration: "6h 10m",
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Trending Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default TrendingCourses;
