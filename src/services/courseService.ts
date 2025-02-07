import api from './api'

export type EpisodeType = {
    id: number;
    name: string;
    synopsis: string;
    order: number;
    videoUrl: string;
    quizz: QuizzType[]
    secondsLong: number;
    Files: EpisodeFileType[];
}
export type EpisodeTypeAdapted = {
    id: number;
    name: string;
    synopsis: string;
    order: number;
    videoUrl: string;
    quizz: QuizzType[]
    secondsLong: number;
    files: EpisodeFileType[];
}
export type CourseType = {
    id: number;
    name: string;
    featuredName: string;
    synopsis: string;
    serie: string;
    thumbnailUrl: string;
    featuredImage: string;
    Episodes?: EpisodeType[];
    watchStatus?: WatchStatus[]
}
export type CourseQuizzType = {
    id: number
    name: string
    Quizzes: QuizzType[]
}
export type QuizzType = {
    order: number
    question: string
    answers: string[]
    fileUrl?: string
    correctAnswer: number
    serie: string
    dificuldade: string
}
export type WatchStatus = {
    isWatching: boolean
    episodeId: number
}
export type CourseTypeWithNoEps = {
    id: number;
    name: string;
    serie: string;
    featuredName: string;
    thumbnailUrl: string;
    synopsis: string;
}
export type EpisodeFileType = {
    id: number;
    episodeId: EpisodeFileType;
    name: string;
    url: string[]
    fileUrl: string[] // conferir se da erro em outras paginas
    course: string
    serie: string
}
export type EpisodeFileTypeAdapted = {
    id: number;
    episodeId: EpisodeFileType;
    name: string;
    fileUrl: string[]
    course: string
    serie: string
}


const courseService = {
    getNewestCourses: async () => {
        const res = await api.get("/courses/newest").catch((error) => {
            return error.response
        })
        return res
    },
    getFeaturedCourses: async () => {
        const token = sessionStorage.getItem("vocenotadez-token")
        const res = await api.get('/courses/featured', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .catch((error) => {
                return error.message
            })
        return res
    },
    addToFav: async (courseId: number | string) => {
        const token = sessionStorage.getItem("vocenotadez-token")
        const res = await api.post('/favorites' , {courseId}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {courseId}
        }).catch((error) => {
            return error.response
        })
        return res
    },
    removeFav: async (courseId: number | string) => {
        try {
          const token = sessionStorage.getItem("vocenotadez-token");
    
          const favorite = await api.delete(`/favorites/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return favorite;
        } catch (error: any) {
          return error.response;
        }
      },
    like: async (courseId: number | string) => {
        try {
            const token = sessionStorage.getItem("vocenotadez-token");
            const like = await api.post(
                "/likes",
                { courseId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return like;
        } catch (error: any) {
            return error.response;
        }
    },
    removeLike: async (courseId: number | string) => {
        try {
            const token = sessionStorage.getItem("vocenotadez-token");

            const like = await api.delete(`/likes/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {courseId}
            });
            return like;
        } catch (error: any) {
            return error.response;
        }
    },
    getFavCourses: async () => {
        const token = sessionStorage.getItem("vocenotadez-token")
        const res = api.get('/favorites', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => { return error.message })
        return res
    },
    getSearch: async (name: string, year: string | null) => {
        const query = name ? `/courses/search?name=${name}&serie=${year}` : `/courses/search?name=&serie=${year}`;
        const res = await api.get(query).catch((error) => { return "Erro aqui"+error.message });
        return res;
        
    },
    getSearchGeneral: async (name: string) => {
        const res = await api.get(`/courses/gsearch?name=${name}`).catch((error) => { return "Erro aqui"+error.message });
        return res;
        
    },
    getEpisodes: async (id: number | string) => {
        const token = sessionStorage.getItem("vocenotadez-token")

        const res = await api.get(`/courses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => { return error.message })
        return res
    }
}

export default courseService