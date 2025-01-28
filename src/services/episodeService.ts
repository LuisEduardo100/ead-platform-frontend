import api from './api'

interface watchTimeParams {
  episodeId: number;
  seconds: number;
}

const watchEpisodeService = {
  getWatchTime: async (episodeId: number) => {
    try {
      const token = sessionStorage.getItem("vocenotadez-token");
      const res = await api.get(`/episodes/${episodeId}/watchTime`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res;
    } catch (error: any) {
      return error.response;
    }
  },
  getEpisodeWithQuizz: async (episodeId: number) => {
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
  setWatchTime: async ({ episodeId, seconds }: watchTimeParams) => {
    try {
      const token = sessionStorage.getItem("vocenotadez-token");
      const res = await api.post(
        `/episodes/${episodeId}/watchTime`,
        { seconds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { seconds }
        }
      );
      return res;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default watchEpisodeService;