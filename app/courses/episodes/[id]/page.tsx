"use client";
import styles from "./styles.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import courseService, { CourseType, EpisodeType } from "../../../../src/services/courseService";
import watchEpisodeService from "../../../../src/services/episodeService";
import PageSpinner from "../../../../src/components/common/pageSpinner";
import HeaderGeneric from "../../../../src/components/common/headerGeneric";
import episodeFileService from "../../../../src/services/episodeFileService";
import EpisodeAdaptedList from "../../../../src/components/common/episodeListAdapted";
import FileList from "../../../../src/components/common/filePage";
import profileService from "../../../../src/services/profileService";

import { Container } from "@mui/material";
import Control from "../../../../src/components/common/videoControls";

let count = 0;

export default function EpisodePlayer({ params, searchParams, }: {
  params: { id: number | string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseType>();
  const [accessType, setAccessType] = useState(false)

  const episodeOrder = parseFloat(params.id.toString() || "");
  const episodeId = parseFloat(searchParams?.episodeid?.toString() || "");
  const courseId = searchParams?.courseid?.toString() || "";

  const [getEpisodeTime, setGetEpisodeTime] = useState(0);
  const [getEpisodeFile, setGetEpisodeFile] = useState<EpisodeType>()
  const [episodeTime, setEpisodeTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)

  const videoPlayerRef = useRef<ReactPlayer>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  const [videoState, setVideoState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    buffer: true,
  });

  //Destructuring the properties from the videoState
  const { playing, muted, volume, playbackRate, played, seeking, buffer } =
    videoState;

  const currentTime = videoPlayerRef.current
    ? videoPlayerRef.current.getCurrentTime()
    : "00:00";
  const duration = videoPlayerRef.current
    ? videoPlayerRef.current.getDuration()
    : "00:00";

  const formatTime = (time: number) => {
    //formarting duration of video
    if (isNaN(time)) {
      return "00:00";
    }

    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    if (hours) {
      //if video have hours
      return `${hours}:${minutes.toString().padStart(2, "0")} `;
    } else return `${minutes}:${seconds}`;
  };

  const formatCurrentTime = formatTime(Number(currentTime));
  const formatDuration = formatTime(Number(duration));

  const playPauseHandler = () => {
    setVideoState({ ...videoState, playing: !videoState.playing });
  };

  const rewindHandler = () => {
    videoPlayerRef.current!.seekTo(videoPlayerRef.current!.getCurrentTime() - 10);
  };

  const handleFastFoward = () => {
    videoPlayerRef.current!.seekTo(videoPlayerRef.current!.getCurrentTime() + 10);
  };

  //console.log("========", (controlRef.current.style.visibility = "false"));
  const progressHandler = (state: any) => {
    if (count > 1) {
      controlRef.current!.style.visibility = "hidden";
      setEpisodeTime(state.playedSeconds);
    } else if (controlRef.current!.style.visibility === "visible") {
      count += 1;
    }

    if (!seeking) {
      setVideoState({ ...videoState, ...state });
    }
  };

  const seekHandler = (e: any, value: any) => {
    setVideoState({ ...videoState, played: value / 100 });
    videoPlayerRef.current!.seekTo(value / 100);
  };

  const seekMouseUpHandler = (e: any, value: any) => {
    setVideoState({ ...videoState, seeking: false });
    videoPlayerRef.current!.seekTo(value / 100);
  };

  const handleGetEpisodeTime = async () => {
    const res = await watchEpisodeService.getWatchTime(episodeId);
    if (res.data !== null) {
      setGetEpisodeTime(res.data.seconds);
    }
  };

  const handleSetEpisodeTime = async () => {
    await watchEpisodeService.setWatchTime({
      episodeId: episodeId,
      seconds: Math.round(episodeTime),
    });
  };

  const handlePlayerTime = () => {
    videoPlayerRef.current?.seekTo(getEpisodeTime);
    setVideoState({ ...videoState, playing: true })
  };

  useEffect(() => {
    handleGetEpisodeTime();
  }, [router]);

  if (playing === true) {
    setTimeout(() => {
      handleSetEpisodeTime();
    }, 3000);
  }
  const volumeChangeHandler = (e: any, value: any) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
    });
  };

  const volumeSeekUpHandler = (e: any, value: any) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    });
  };

  const muteHandler = () => {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted });
  };

  const onSeekMouseDownHandler = (e: any) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    controlRef.current!.style.visibility = "visible";
    count = 0;
  };

  const bufferStartHandler = () => {
    setVideoState({ ...videoState, buffer: true});
  };

  const bufferEndHandler = () => {
    setVideoState({ ...videoState, buffer: false, playing: true});
  };

  const playbackRateHandler = () => {
    let newvalue = playbackRate + 0.25;
    if (newvalue > 2) {
      newvalue = 0.25
    }
    setVideoState({ ...videoState, playbackRate: newvalue })
  }

  // ////////////////////////////////////////////////////////////////// //

  const handleFileClick = (url: string) => {
    if (url.endsWith('.pdf')) {
      setSelectedFileUrl(url);
    } else {
      setSelectedFileUrl(url);
    }
  };


  const handleEpisodeFile = async () => {
    try {
      const res = await episodeFileService.getEpisodeWithFile(episodeId);
      if (res) {
        setGetEpisodeFile(res);
      } else {
        console.error('No files found in the response.');
      }
    } catch (error) {
      console.error('Error fetching episode file:', error);
    }
  };


  useEffect(() => {
    handleEpisodeFile();
  }, [episodeId]);

  const getCourse = async () => {
    if (typeof courseId !== "string") return;
    const res = await courseService.getEpisodes(courseId);
    if (res.status === 200) {
      setCourse(res.data);
    }
  };

  // const handleLastEpisode = () => {
  //   router.push(`/courses/episodes/${episodeOrder - 1}?courseid=${course?.id}&episodeid=${episodeId - 1}`);
  // };
  const handleNextEpisode = () => {
    router.push(`/courses/episodes/${episodeOrder + 1}?courseid=${course?.id}&episodeid=${episodeId + 1}`);
  };

  const routerPushToCourse = () => {
    router.push(`/courses/${courseId}`)
  }

  useEffect(() => {
    getCourse();
  }, [courseId]);

  useEffect(() => {
    if (courseId !== "1") {
      profileService.fetchCurrent().then((user) => {
        const hasFullAccess = user.hasFullAccess
        setAccessType(user.hasFullAccess)

        if (!hasFullAccess) {
          router.push(`/courses/${courseId}?access=${hasFullAccess}`)
        } else {
          setLoading(false)
        }
      })
    }

    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }

  }, [courseId,]);

  if (loading) {
    return <PageSpinner />;
  }

  if (course?.Episodes == undefined) return <PageSpinner />;


  // Ajustes de constantes
  const filteredEpisodes = course.Episodes?.filter((episode) => episode.id !== episodeId)
  const hasFiles = getEpisodeFile?.Files && getEpisodeFile.Files?.length != 0
  const confirmNextVideo = episodeOrder + 1 == course.Episodes[episodeOrder+1]?.order ? true : false
  const confirmLastVideo = episodeOrder == 0 ? true : false

  if (confirmNextVideo) {
    if (Math.round(episodeTime) === course.Episodes[episodeOrder].secondsLong) {
      handleNextEpisode();
    }
  }
  // Roda de progresso do aluno 

  const calculateProgress = () => {
    const totalEpisodes = course.Episodes?.length || 0;
    const watchedEpisodes = course.watchStatus.length;
    const progressPercent = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;

    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;

    return {
      progressPercent,
      strokeDasharray: `${circumference - offset}, ${circumference}`,
    };
  };

  const { progressPercent, strokeDasharray } = calculateProgress();

  return (
    <>
      <main className={styles.mainDiv}>
        <div className={styles.video_container}>
          <div className={styles.video_description_container}>
            <div className={styles.player_wrapper} onMouseMove={mouseMoveHandler}>
              <ReactPlayer
                ref={videoPlayerRef}
                className={styles.player}
                url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.Episodes[episodeOrder]?.videoUrl}&token=${sessionStorage.getItem("vocenotadez-token")}`}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                playbackRate={playbackRate}
                muted={muted}
                onStart={handlePlayerTime}
                onProgress={progressHandler}
                onBuffer={bufferStartHandler}
                onBufferEnd={bufferEndHandler}
              />
              <Control
                onPlayPause={playPauseHandler}
                playing={playing}
                onRewind={rewindHandler}
                onForward={handleFastFoward}
                played={played}
                onSeek={seekHandler}
                onSeekMouseUp={seekMouseUpHandler}
                onVolumeChangeHandler={volumeChangeHandler}
                onVolumeSeekUp={volumeSeekUpHandler}
                volume={volume}
                mute={muted}
                onMute={muteHandler}
                duration={formatDuration}
                currentTime={formatCurrentTime}
                onMouseSeekDown={onSeekMouseDownHandler}
                controlRef={controlRef}
                buffer={buffer}
                playerRef={videoPlayerRef}
                playbackSpeedHandler={playbackRateHandler}
                playrateValue={playbackRate}
                handleNextEpisode={handleNextEpisode}
                nextEpisodeAvailable={confirmNextVideo}
                videoTitle={course.Episodes[episodeOrder].name}
                routerPush={routerPushToCourse}
              />
            </div>
            <div className={styles.fileAndButtons}>
              <div className={styles.divFileUrl}>
                {hasFiles ? (
                  <FileList files={getEpisodeFile.Files} onFileClick={handleFileClick} />
                ) : (
                  <p className={styles.pSemDownload}>Sem material para download.</p>
                )}
              </div>
              <div className={styles.divSinopse}>
                <p className={styles.pSinopse}>{course.Episodes[episodeOrder].synopsis}</p>
              </div>
            </div>
            {selectedFileUrl && (
              <div>
                {selectedFileUrl.endsWith('.pdf') ? (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      zIndex: 1000,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <iframe
                      key={selectedFileUrl} // Força o re-render quando o URL muda
                      src={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`}
                      width="80%"
                      height="80%"
                      allowFullScreen
                      style={{
                        border: 'none',
                        position: 'relative',
                      }}
                    />
                    <button
                      onClick={() => setSelectedFileUrl(null)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#fff',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        zIndex: 1001,
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        window.open(`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`)
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '80px',
                        backgroundColor: '#fff',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        zIndex: 1001,
                      }}
                    >
                      Abrir em nova aba
                    </button>
                  </div>

                ) : (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    zIndex: 1000,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <ReactPlayer
                      url={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`}
                      width="80%"
                      height="60%"
                      controls={true}
                      style={{
                        border: 'none',
                        position: 'relative',
                        margin: '0 auto'
                      }}
                    />
                    <button
                      onClick={() => setSelectedFileUrl(null)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#fff',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        zIndex: 1001,
                      }}
                    >
                      Close
                    </button>
                  </div>
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
                  <h4 className={styles.titulo}>Meu progresso - {`${progressPercent.toFixed(0)}%`}</h4>
                  <p className={styles.pQtdAulas}>{`${course.watchStatus.length} de ${course.Episodes.length} aulas`}</p>
                </div>
              </div>
            </div>
            <div className={styles.div_episode_list}>

              {
                course.Episodes?.map((episode) =>
                  <EpisodeAdaptedList key={episode.id} episode={episode} course={course} />
                )
              }
            </div>
          </div>
        </div>
      </main>
    </>
  );
}