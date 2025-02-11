"use client";
import styles from "./styles.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import courseService, { CourseType, EpisodeFileType, QuizzType } from "../../../../src/services/courseService";
import watchEpisodeService from "../../../../src/services/episodeService";
import episodeFileService from "../../../../src/services/episodeFileService";
import profileService from "../../../../src/services/profileService";
import PageSpinner from "../../../../src/components/common/pageSpinner";
import Control from "../../../../src/components/common/videoControls";
import EpisodeAdaptedList from "../../../../src/components/common/episodeListAdapted";
import FileListToEpisode from "../../../../src/components/common/filePageToEpisode";
import { Close, FileOpen } from "@mui/icons-material";

type EpisodeTypeAdapted = {
  id: number;
  name: string;
  synopsis: string;
  order: number;
  videoUrl: string;
  quizz: QuizzType[];
  secondsLong: number;
  Files: EpisodeFileType[];
};

export default function EpisodePlayer({
  params,
  searchParams,
}: {
  params: { id: number | string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  // Estados essenciais
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseType>();
  const [watchTime, setWatchTime] = useState(0);
  const [episodeTime, setEpisodeTime] = useState(0);
  const [episodeFiles, setEpisodeFiles] = useState<EpisodeTypeAdapted | null>(null);
  const [episodeQuizz, setEpisodeQuizz] = useState<EpisodeTypeAdapted | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  
  // Estado do player
  const [videoState, setVideoState] = useState({
    playing: false, // Inicia sem tocar
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  
  // Estado para indicar quando o player está pronto
  const [playerReady, setPlayerReady] = useState(false);
  const [hasSetInitialPlayback, setHasSetInitialPlayback] = useState(false);
  
  // Referências
  const videoPlayerRef = useRef<ReactPlayer>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  // Parâmetros extraídos da URL
  const episodeOrder = Number(params.id);
  const episodeId = Number(searchParams?.episodeid);
  const courseId = (searchParams?.courseid as string) || "";

  // ****************************************************
  // BUSCA DOS DADOS (watchTime, detalhes do episódio e curso)
  // ****************************************************

  // Busca o watchTime para o episódio
  useEffect(() => {
    const fetchWatchTime = async () => {
      const res = await watchEpisodeService.getWatchTime(episodeId);
      if (res.data) {
        setWatchTime(res.data.seconds);
      }
    };
    fetchWatchTime();
  }, [episodeId]);

  // Quando o player estiver pronto e o watchTime carregado, busca para o tempo salvo.
  useEffect(() => {
    if (playerReady && !hasSetInitialPlayback && videoPlayerRef.current) {
      if (watchTime > 0) {
        videoPlayerRef.current.seekTo(watchTime, "seconds");
      }

      setVideoState((prev) => ({ ...prev, playing: true }));
      setHasSetInitialPlayback(true);
    }
  }, [playerReady, watchTime, hasSetInitialPlayback]);

  // Busca arquivos e quizz do episódio
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      try {
        const filesRes = await episodeFileService.getEpisodeWithFile(episodeId);
        setEpisodeFiles(filesRes);
        const quizzRes = await episodeFileService.getEpisodeWithQuizz(episodeId);
        setEpisodeQuizz(quizzRes);
      } catch (error) {
        console.error("Erro ao buscar detalhes do episódio:", error);
      }
    };
    fetchEpisodeDetails();
  }, [episodeId]);

  // Busca dados do curso
  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        const res = await courseService.getEpisodes(courseId);
        if (res.status === 200) {
          setCourse(res.data);
        }
      }
    };
    fetchCourse();
  }, [courseId]);

  // Validação de acesso (token e acesso completo)
  useEffect(() => {
    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      if (courseId !== "1") {
        profileService.fetchCurrent().then((user) => {
          if (!user.hasFullAccess) {
            router.push(`/courses/${courseId}?access=${user.hasFullAccess}`);
          } else {
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    }
  }, [courseId, router]);

  // ****************************************************
  // ATUALIZAÇÃO PERIÓDICA DO WATCHTIME
  // ****************************************************

  // Enquanto o vídeo estiver tocando, atualiza periodicamente o watchTime no backend.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (videoState.playing) {
      interval = setInterval(() => {
        const current = videoPlayerRef.current?.getCurrentTime() || 0;
        setEpisodeTime(current);

        watchEpisodeService.setWatchTime({ episodeId, seconds: Math.round(current) });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [videoState.playing, episodeId]);

  // Se o episódio foi concluído, navega para o próximo.
  useEffect(() => {
    if (course?.Episodes && course.Episodes[episodeOrder]) {
      if (Math.round(episodeTime) >= course.Episodes[episodeOrder].secondsLong) {
        if (episodeOrder < course.Episodes.length - 1) {
          const intervalID = setInterval(()=> {
            router.push(
              `/courses/episodes/${episodeOrder + 1}?courseid=${course.id}&episodeid=${episodeId + 1}`
            );
          }, 3000)

          return () => clearInterval(intervalID)
        }
      }
    }
  }, [episodeTime, course, episodeOrder, episodeId, router]);

  // ****************************************************
  // HANDLERS DOS CONTROLES DO PLAYER
  // ****************************************************

  const togglePlayPause = () =>
    setVideoState((prev) => ({ ...prev, playing: !prev.playing }));

  const rewind = () => {
    const current = videoPlayerRef.current?.getCurrentTime() || 0;
    videoPlayerRef.current?.seekTo(current - 10, "seconds");
  };

  const fastForward = () => {
    const current = videoPlayerRef.current?.getCurrentTime() || 0;
    videoPlayerRef.current?.seekTo(current + 10, "seconds");
  };

  // --- HANDLERS DO SLIDER DE SEEK ---

  const onSeekMouseDownHandler = () =>
    setVideoState((prev) => ({ ...prev, seeking: true }));

  const handleSeekChange = (
    event: Event,
    value: number | number[],
    activeThumb?: number
  ) => {
    const sliderValue = Array.isArray(value) ? value[0] : value;
    const fraction = sliderValue / 100;
    setVideoState((prev) => ({
      ...prev,
      played: isFinite(fraction) ? fraction : prev.played
    }));
  };

  const handleSeekMouseUp = (
    event: React.SyntheticEvent,
    value: number | number[]
  ) => {
    setVideoState((prev) => ({ ...prev, seeking: false }));

    const sliderValue = Array.isArray(value) ? value[0] : value;

    // Verificação de segurança
    if (typeof sliderValue !== 'number' || isNaN(sliderValue)) {
      console.error('Valor inválido:', sliderValue);
      return;
    }

    const fraction = sliderValue / 100;
    const safeFraction = Math.max(0, Math.min(1, fraction));

    if (isFinite(safeFraction)) {
      videoPlayerRef.current?.seekTo(safeFraction, "fraction");
    } else {
      console.error('Valor de seek inválido:', safeFraction);
    }
  };

  // --- HANDLERS DO VOLUME ---

  const handleVolumeChange = (valueOrEvent: any) => {
    let value: number;
    if (typeof valueOrEvent === "number") {
      value = valueOrEvent;
    } else if (valueOrEvent && valueOrEvent.target && valueOrEvent.target.value !== undefined) {
      value = parseFloat(valueOrEvent.target.value);
    } else {
      return;
    }

    const newVolume = value > 1 ? value / 100 : value;
    if (!isFinite(newVolume)) return;
    setVideoState((prev) => ({
      ...prev,
      volume: newVolume,
      muted: newVolume === 0,
    }));
  };

  const toggleMute = () =>
    setVideoState((prev) => ({ ...prev, muted: !prev.muted }));

  // --- HANDLER DA PLAYBACK RATE ---

  const changePlaybackRate = () =>
    setVideoState((prev) => {
      let newRate = prev.playbackRate + 0.25;
      if (newRate > 2) newRate = 0.25;
      return { ...prev, playbackRate: newRate };
    });

  // --- UTILITÁRIO: FORMATAÇÃO DO TEMPO (mm:ss) ---

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const date = new Date(time * 1000);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // ****************************************************
  // RENDERIZAÇÃO
  // ****************************************************

  if (loading || !course?.Episodes) return <PageSpinner />;

  const calculateProgress = () => {
    const totalEpisodes = course.Episodes?.length;
    const watchedEpisodes = course.watchStatus?.length || 0;
    const progressPercent = totalEpisodes! > 0 ? (watchedEpisodes / totalEpisodes!) * 100 : 0;
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;
    return { progressPercent, strokeDasharray: `${circumference - offset}, ${circumference}` };
  };

  const { progressPercent, strokeDasharray } = calculateProgress();

  return (
    <main className={styles.mainDiv}>
      <div className={styles.video_container}>
        <div className={styles.video_description_container}>
          <div className={styles.player_wrapper}>
            <ReactPlayer
              ref={videoPlayerRef}
              className={styles.player}
              url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.Episodes[episodeOrder]?.videoUrl}&token=${sessionStorage.getItem(
                "vocenotadez-token"
              )}`}
              width="100%"
              height="100%"
              playing={videoState.playing}
              volume={videoState.volume}
              playbackRate={videoState.playbackRate}
              muted={videoState.muted}
              onProgress={(state) => {
                if (!videoState.seeking) {
                  setVideoState((prev) => ({ ...prev, played: state.played }));
                  setEpisodeTime(state.playedSeconds);
                }
              }}
              onReady={() => setPlayerReady(true)}
            />
            <Control
              playerRef={videoPlayerRef}
              onPlayPause={togglePlayPause}
              playing={videoState.playing}
              onRewind={rewind}
              onForward={fastForward}
              played={videoState.played}
              onMouseSeekDown={onSeekMouseDownHandler}
              onSeek={handleSeekChange}
              onSeekMouseUp={handleSeekMouseUp}
              onVolumeChangeHandler={handleVolumeChange}
              volume={videoState.volume}
              mute={videoState.muted}
              onMute={toggleMute}
              duration={formatTime(videoPlayerRef.current?.getDuration() || 0)}
              currentTime={formatTime(episodeTime)}
              controlRef={controlRef}
              playbackSpeedHandler={changePlaybackRate}
              playrateValue={videoState.playbackRate}
              handleNextEpisode={() =>
                router.push(
                  `/courses/episodes/${episodeOrder + 1}?courseid=${course.id}&episodeid=${episodeId + 1}`
                )
              }
              nextEpisodeAvailable={
                course.Episodes.length > 1 && episodeOrder < course.Episodes.length - 1
              }
              videoTitle={course.Episodes[episodeOrder].name}
              routerPush={() => router.push(`/courses/${courseId}`)}
            />
          </div>
          <div className={styles.fileAndButtons}>
            <div className={styles.divFileUrl}>
              {episodeFiles?.Files && episodeFiles.Files.length > 0 ? (
                <FileListToEpisode files={episodeFiles.Files} onFileClick={setSelectedFileUrl} />
              ) : (
                <p className={styles.pSemDownload}>Sem material para download.</p>
              )}
            </div>
            <div className={styles.divSinopse}>
              <p className={styles.pSinopse}>{course.Episodes[episodeOrder].synopsis}</p>
            </div>
          </div>
          {selectedFileUrl && (
            <div
              className={styles.overlay}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              {selectedFileUrl.endsWith(".pdf") ? (
                <>
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`}
                    width="80%"
                    height="80%"
                    allowFullScreen
                    style={{ border: "none" }}
                  />
                  <div style={{
                    position: 'fixed',
                    top: 20,
                  }}>
                    <button
                      style={{
                        padding: '8px',
                        border: 'none'
                      }}
                      onClick={() =>
                        window.open(`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`)
                      }
                    >
                      Abrir em nova aba <FileOpen fontSize={"small"} />
                    </button>
                    <button
                      style={{
                        padding: '8px',
                        color: 'white',
                        backgroundColor: '#E50914',
                        marginLeft: 10,
                        border: 'none'
                      }}
                      onClick={() => setSelectedFileUrl(null)}><Close /></button>
                  </div>
                </>
              ) : (
                <>
                  <ReactPlayer
                    url={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`}
                    width="80%"
                    height="60%"
                    controls
                  />
                  <button onClick={() => setSelectedFileUrl(null)}>Close</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className={styles.episodeContent}>
          <div className={styles.progress}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.progress_circle}>
                <svg className={styles.svg} viewBox="0 0 36 36">
                  <path
                    className={styles.circle_bg}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.circle}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{ strokeDasharray }}
                  />
                </svg>
              </div>
              <div>
                <h4 className={styles.titulo}>
                  Meu progresso - {progressPercent.toFixed(0)}%
                </h4>
                <p className={styles.pQtdAulas}>{`${course.watchStatus?.length || 0} de ${course.Episodes.length} aulas`}</p>
              </div>
            </div>
          </div>
          <div className={styles.div_episode_list}>
            {course.Episodes.map((episode) => (
              <EpisodeAdaptedList key={episode.id} episode={episode} course={course} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
