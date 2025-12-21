import { db } from '@/lib/db';

async function updateCourseOrders() {
  try {
    // Get all courses ordered by creation date
    const courses = await db.course.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Update each course with order starting from 1
    for (let i = 0; i < courses.length; i++) {
      await db.course.update({
        where: { id: courses[i].id },
        data: { order: i + 1 }
      });
    }

    console.log(`Updated ${courses.length} courses with order values`);
  } catch (error) {
    console.error('Error updating course orders:', error);
  } finally {
    await db.$disconnect();
  }
}

updateCourseOrders();