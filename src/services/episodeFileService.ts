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
    getEpisodeWithFile: async (episodeId: number | string) => {
        try {
            const res = await api.get(`/episodes/${episodeId}`)
            return res.data
        } catch (err: any) {
            return err.response
        }
    }
}

export default episodeFileService