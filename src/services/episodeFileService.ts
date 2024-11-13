import api from "./api"
import { EpisodeType } from "./courseService"



const episodeFileService = {
    getEpisodeFile: async (episodeId: number | string) => {
        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.get(`/episodes/${episodeId}/file`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/pdf"
                }
            })
            return res.data
        } catch (err: any) {
            return err.response
        }
    },
    getEpisodeWithQuizz: async (episodeId: number | string) => {
        try {
            const token = sessionStorage.getItem('vocenotadez-token')
            const res = await api.get(`/episodes/${episodeId}/questoes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res
        } catch (error: any) {
            return error.response
        }
    },
    getEpisodeWithFile: async (episodeId: number | string) => {
        try {
            const token = sessionStorage.getItem("vocenotadez-token")
            const res = await api.get(`/episodes/${episodeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (err: any) {
            return err.response
        }
    }
}

export default episodeFileService