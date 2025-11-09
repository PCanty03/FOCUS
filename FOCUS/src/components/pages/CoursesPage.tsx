import { useState } from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

type Course = {
  id: string;
  title: string;
  progress: number;
};

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', title: 'React Advanced Patterns', progress: 65 },
    { id: '2', title: 'TypeScript Fundamentals', progress: 30 },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');

  const handleAddCourse = () => {
    if (newCourseTitle.trim()) {
      const course: Course = {
        id: Date.now().toString(),
        title: newCourseTitle,
        progress: 0,
      };
      setCourses([...courses, course]);
      setNewCourseTitle('');
      setShowAddForm(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, progress } : course)));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Courses</h1>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6 max-w-2xl">
          <h3 className="mb-3">Add New Course</h3>
          <div className="flex gap-2">
            <Input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCourse()}
              placeholder="Course title"
              className="flex-1"
            />
            <Button onClick={handleAddCourse}>Add</Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 max-w-4xl">
        {courses.map((course) => (
          <div key={course.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3>{course.title}</h3>
              </div>
              <button onClick={() => deleteCourse(course.id)} className="text-destructive hover:opacity-70">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => updateProgress(course.id, Math.min(100, course.progress + 10))}
                  variant="outline"
                  size="sm"
                >
                  +10%
                </Button>
                <Button
                  onClick={() => updateProgress(course.id, Math.max(0, course.progress - 10))}
                  variant="outline"
                  size="sm"
                >
                  -10%
                </Button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No courses yet. Add your first course to get started!
          </div>
        )}
      </div>
    </div>
  );
}