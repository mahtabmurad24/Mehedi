export default function SuccessStoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Success Stories</h1>
      <p className="text-lg mb-4">
        Hear from our students who have transformed their understanding of mathematics.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for success stories */}
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Student Success</h3>
          <p>"Mehedi's Math Academy helped me ace my exams!"</p>
        </div>
      </div>
    </div>
  );
}