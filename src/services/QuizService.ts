import api from "./api";

type QuizResultParams = {
    episodeId: number;
    score: number;
  };
const quizService = {
    getQuizResults: async({episodeId}: QuizResultParams) =>{
        const courseId = episodeId

        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.get(`episodes/${episodeId}/quizzResult`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res
        } catch (error: any) {
            return error.response
        }
    },
    setQuizResults: async({episodeId, score}: QuizResultParams) =>{
        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.post(
                `/episodes/${episodeId}/quizzResult`,
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