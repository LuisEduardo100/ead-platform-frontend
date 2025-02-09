import { CourseType } from './courseService'; 
import api from './api';

export async function getKeepWatchingCourses(): Promise<CourseType[]> {
    const token = sessionStorage.getItem("vocenotadez-token");
    if (!token) {
        throw new Error("Token de autenticação não encontrado");
    }

    const response = await api.get(`/users/current/watching`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const courses: CourseType[] = response.data.map((item: any) => {
        return {
            ...item.Course, 
            progress: item.watchTime.seconds, 
            episodeId: item.id,             
            videoUrl: item.videoUrl,
            secondsLong: item.secondsLong,
        };
    });

    return courses;
}

export default { getKeepWatchingCourses };
