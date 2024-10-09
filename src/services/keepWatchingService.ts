import api from "./api";
import categoriesService, { CategoryType, CategoryWithNoCourse } from "./categoriesService"
import courseService, { CourseType, EpisodeType } from "./courseService"

export async function fetchCoursesByCategoryId(categoryId: number) {
    const token = sessionStorage.getItem('vocenotadez-token')

    const response = await api.get(`/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.Courses; // Retorna um array de cursos
}

export async function fetchCourseById(courseId: number) {
    const token = sessionStorage.getItem('vocenotadez-token')

    const response = await api.get(`/courses/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

const KeepWatchingService = {
    fectchingOnGoingCourses: async () => {
        try {
            const categories: CategoryWithNoCourse[] = await categoriesService.getCategories();
            const ongoingCourses: any = [];
            for (const category of categories) {
                const courses = await fetchCoursesByCategoryId(category.id);
                for (const course of courses) {
                    const courseDetails = await fetchCourseById(course.id);
                    
                    if(courseDetails.watchStatus.length > 0 && courseDetails.watchStatus.length < courseDetails.Episodes.length){
                        ongoingCourses.push(courseDetails)
                    }
                }
            }
            return ongoingCourses
        } catch (error) {
            console.error('Error fetching ongoing courses:', error);
            return [];
        }

    }
}

export default KeepWatchingService