import api from "./api";

type QuizResultParams = {
    courseId: number;
    score: number;
  };
const quizService = {
    getQuizz: async (courseId: number | string) => {
        const token = sessionStorage.getItem("vocenotadez-token")
        try {
            const response = await api.get(`/course/quizz/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error: any) {
            return error.response
        }
        
    },
    getQuizResults: async(courseIdP: number | string) =>{
        const courseId = Number(courseIdP)
        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.get(`/courses/${courseId}/quizzREsult`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res
        } catch (error: any) {
            return error.response
        }
    },
    setQuizResults: async({courseId, score}: QuizResultParams) =>{
        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.post(
                `/courses/${courseId}/quizzResult`,
                { score },
                { 
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
            )
        } catch (error: any) {
            return error.response
        }
    }
}

export default quizService