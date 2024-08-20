"use client";
import styles from "./styles.module.scss";
import "./styles.module.scss";

import { useEffect, useRef, useState } from "react";
import { Button, Container } from "reactstrap";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import classNames from 'classnames';
import courseService, { CourseType, EpisodeFileType, EpisodeType } from "../../../../src/services/courseService";
import watchEpisodeService from "../../../../src/services/episodeService";
import PageSpinner from "../../../../src/components/common/pageSpinner";
import HeaderGeneric from "../../../../src/components/common/headerGeneric";
import episodeFileService from "../../../../src/services/episodeFileService";
import Link from "next/link";
import EpisodeList from "../../../../src/components/Course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackwardStep, faCompress, faExpand, faForward, faForwardStep, faPause, faPlay, faVolumeHigh, faVolumeLow, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { faBackward } from "@fortawesome/free-solid-svg-icons/faBackward";
import EpisodeAdaptedList from "../../../../src/components/common/episodeListAdapted";
import FileList from "../../../../src/components/common/filePage";

export default function EpisodePlayer({ params, searchParams, }: {
  params: { id: number | string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseType>();

  const episodeOrder = parseFloat(params.id.toString() || "");
  const episodeId = parseFloat(searchParams?.episodeid?.toString() || "");
  const courseId = searchParams?.courseid?.toString() || "";

  const [getEpisodeTime, setGetEpisodeTime] = useState(0);
  const [getEpisodeFile, setGetEpisodeFile] = useState<EpisodeType>()
  const [episodeTime, setEpisodeTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [playing, setPlaying] = useState(false)
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0)

  const [volume, setVolume] = useState(1)
  const [volumeState, setVolumeState] = useState("high")
  const [changeVolumeState, setChangeVolumeState] = useState(true)
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)
  const playerRef = useRef<ReactPlayer>(null);

  const handleFileClick = (url: string) => {
    if (url.endsWith('.pdf')) {
      setSelectedFileUrl(url);
    } else {
      window.open(`${process.env.NEXT_PUBLIC_BASEURL}/${url}`, '_blank');
    }
  };

  const handleChangeVolumeState = () => {
    if (changeVolumeState) {
      setVolume(1)
      setVolumeState("high")
    } else {
      setVolume(0)
      setVolumeState("muted")
    }
    setChangeVolumeState(!changeVolumeState)
  }
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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setVolume(value);

    if (value === 0) {
      setVolumeState("muted");
    } else {
      if (value > 0 && value <= 0.5) {
        setVolumeState("low")
      } else {
        setVolumeState("high")
      }
    }
  }

  useEffect(() => {
    handleEpisodeFile();
  }, [episodeId]);

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
  useEffect(() => {
    handleGetEpisodeTime();
  }, [router]);

  const handlePlayerTime = () => {
    playerRef.current?.seekTo(getEpisodeTime);
    setIsReady(true);
  };

  if (isReady === true) {
    setTimeout(() => {
      handleSetEpisodeTime();
    }, 3000);
  }

  const getCourse = async () => {
    if (typeof courseId !== "string") return;
    const res = await courseService.getEpisodes(courseId);
    if (res.status === 200) {
      setCourse(res.data);
    }
  };

  const handleLastEpisode = () => {
    router.push(`/courses/episodes/${episodeOrder - 1}?courseid=${course?.id}&episodeid=${episodeId - 1}`);
  };
  const handleNextEpisode = () => {
    router.push(`/courses/episodes/${episodeOrder + 1}?courseid=${course?.id}&episodeid=${episodeId + 1}`);
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);
  useEffect(() => {
    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  if (course?.Episodes == undefined) return <PageSpinner />;

  if (episodeOrder + 1 <= course.Episodes.length) {
    if (Math.round(episodeTime) === course.Episodes[episodeOrder].secondsLong) {
      handleNextEpisode();
    }
  }

  // VIDEO PLAYER FUNCTIONALITY 


  const handleFullScreen = () => {
    const player = playerRef.current?.getInternalPlayer();
    if (!player) return;

    const container = player.parentElement?.parentElement; // Garante que o contêiner que inclui o player e os controles vai para fullscreen
    if (!document.fullscreenElement) {
      if (container?.requestFullscreen) {
        setFullscreen(true)
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        setFullscreen(false)
        document.exitFullscreen();
      }
    }
  };
  const handleDuration = () => {
    const duration = playerRef.current?.getDuration()
    return duration
  };

  const handleCurrentTime = () => {
    const duration = playerRef.current?.getCurrentTime()
    return duration
  }
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const onClickPlayPause = () => {
    setPlaying(!playing)
  }

  const handleForwardBtn = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    }
  }
  const handleBackwardBtn = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    }
  }

  // Ajustes de constantes
  const filteredEpisodes = course.Episodes?.filter((episode) => episode.id !== episodeId)
  // const hasFiles = getEpisodeFile?.Files && getEpisodeFile.Files.length > 0;
  const hasFiles = getEpisodeFile?.Files && getEpisodeFile.Files[0].fileUrl.length > 0;
  const file = hasFiles ? getEpisodeFile.Files.filter(e => e.fileUrl) : null;
  const confirmNextVideo = episodeOrder + 1 == course.Episodes.length ? true : false
  const confirmLastVideo = episodeOrder == 0 ? true : false

  return (
    <>
      <HeaderGeneric logoUrl="/home" btnContent={`Voltar para o curso`} btnUrl={`/courses/${courseId}`} />
      <main>
        <div className={styles.mainDiv}>
          <div className={styles.playerWrapper} onClick={onClickPlayPause} >
            <p className={styles.video_player_title}>{course.Episodes[episodeOrder].name}</p>
            <div className={styles.divProgressBar}>
              <input
                className={styles.progress_bar}
                type="range"
                min={0}
                max={1}
                step="any"
                onChange={(e) => {
                  const newTime = (parseFloat(e.target.value) / 100) * (playerRef.current?.getDuration() || 0);
                  playerRef.current?.seekTo(newTime);
                  setProgress(parseFloat(e.target.value));
                }
                }
                style={{ width: '100%' }}
              />
            </div>
            <ReactPlayer
              className={styles.player}
              url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.Episodes[episodeOrder].videoUrl
                }&token=${sessionStorage.getItem("vocenotadez-token")}`}
              controls={false}
              playing={playing}
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              volume={volume}
              muted={false}
              onStart={() => handlePlayerTime()}
              onProgress={(progress) => {
                setEpisodeTime(progress.playedSeconds);

              }}
            />
            <div className={styles.video_player_control}>
              <Button className={styles.control_btn} onClick={handleLastEpisode} disabled={confirmLastVideo}>
                <FontAwesomeIcon icon={faBackwardStep} style={{ fontSize: "24px" }} />
              </Button>
              <Button className={styles.control_btn} onClick={handlePlayPause}>
                {
                  !(playing) ? (
                    <div className="play-icon">
                      <FontAwesomeIcon icon={faPlay} style={{ fontSize: '24px' }} />
                    </div>
                  ) : (
                    <div className="pause-icon">
                      <FontAwesomeIcon icon={faPause} style={{ fontSize: '24px' }} />
                    </div>
                  )
                }
              </Button>
              <Button className={styles.control_btn} onClick={handleNextEpisode} disabled={confirmNextVideo}>
                <FontAwesomeIcon icon={faForwardStep} style={{ fontSize: "24px" }} />
              </Button>
              <div className={styles.div_volume_bar}>
                <div className={styles.volume_container} onClick={handleChangeVolumeState}>
                  {volumeState == "high" ? <FontAwesomeIcon icon={faVolumeHigh} style={{ color: "#fff", fontSize: '22px' }} /> :
                    volumeState == "low" ? <FontAwesomeIcon icon={faVolumeLow} style={{ color: "#fff", fontSize: '22px' }} /> :
                      <FontAwesomeIcon className={styles.volume_muted} icon={faVolumeMute} style={{ color: "#fff", fontSize: '22px' }} />
                  }
                </div>
                <input
                  className={styles.volume_bar}
                  type="range"
                  min={0}
                  max={1}
                  value={volume}
                  step="any"
                  onChange={handleVolumeChange}
                />
              </div>
              <Button className={styles.control_btn} onClick={handleBackwardBtn}>
                <FontAwesomeIcon icon={faBackward} style={{ fontSize: "24px" }} />
              </Button>
              <Button className={styles.control_btn} onClick={handleForwardBtn}>
                <FontAwesomeIcon icon={faForward} style={{ fontSize: "24px" }} />
              </Button>
              <div className={styles.duration_container}>
                <span style={{ marginLeft: '10px' }}>
                  {formatTime(handleCurrentTime()!)} / {formatTime(handleDuration()!)}
                </span>
              </div>
              <Button className={styles.control_btn} onClick={handleFullScreen}>
                {fullscreen ?
                  <div className={styles.fullscren_on}>
                    <FontAwesomeIcon icon={faCompress} style={{ fontSize: "24px" }} />
                  </div>
                  :
                  <div className={styles.fullscren_off}>
                    <FontAwesomeIcon icon={faExpand} style={{ fontSize: "24px" }} />
                  </div>
                }
              </Button>
            </div>

          </div>

          {/* EPISODE LIST  */}

          <div className={styles.div_episode_list}>
            <div className={styles.progress}>
              <h4>Meu progresso - {`${((course.watchStatus.length / course.Episodes?.length) * 100).toFixed(0)}%`}</h4>
              <p>{`${course.watchStatus.length} de ${course.Episodes.length}`}</p>
            </div>
            {
              course.Episodes?.map((episode) =>
                <EpisodeAdaptedList key={episode.id} episode={episode} course={course} />
              )
            }
          </div>

          {/* FILE BUTTON  */}

          <div className={styles.fileAndButtons}>
            <div className={styles.divFileUrl}>
              {hasFiles ? (
                <FileList files={getEpisodeFile.Files} onFileClick={handleFileClick} />
              ) : (
                <p className={styles.pSemDownload}>Sem material para download.</p>
              )}
            </div>
            {selectedFileUrl && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    zIndex: 100000000000000,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <iframe
                    key={selectedFileUrl} // Força o re-render quando o URL muda
                    src={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedFileUrl}`}
                    width="80%"
                    height="80%"
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
                </div>
              )}
            {/* SINOPSE  */}

            <div className={styles.divSinopse}>
              <p className={styles.pSinopse}>{course.Episodes[episodeOrder].synopsis}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}