import api from './api'

export type EpisodeType = {
    id: number;
    name: string;
    synopsis: string;
    order: number;
    videoUrl: string;
    secondsLong: number;
    Files: EpisodeFileType[];
}

export type CourseType = {
    id: number;
    name: string;
    thumbnailUrl: string;
    synopsis: string;
    Episodes?: EpisodeType[];
}

export type EpisodeFileType = {
    id: number;
    episodeId: EpisodeFileType;
    name: string;
    fileUrl: string;
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
        const res = await api // talvez tenha que ter interrogação no final 'featured?'
            .get('/courses/featured', {
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
    getSearch: async (name: string) => {
        const res = await api.get(`/courses/search?name=${name}`).catch((error) => { return error.message })
        return res
    },
    // getSearchNoAuth: async (name: string) => {
    //     const res = await api.get(`/courses/search?name=${name}`).catch((error) => { return error.message })
    //     return res
    // },
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