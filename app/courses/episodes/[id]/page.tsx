"use client";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { Button, Container } from "reactstrap";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import courseService, { CourseType, EpisodeType } from "../../../../src/services/courseService";
import watchEpisodeService from "../../../../src/services/episodeService";
import PageSpinner from "../../../../src/components/common/pageSpinner";
import HeaderGeneric from "../../../../src/components/common/headerGeneric";
import episodeFileService from "../../../../src/services/episodeFileService";
import Link from "next/link";

type ParamsProps = {
  params: { id: number | string };
};

const getCourseId = async ({ params }: ParamsProps) => {
  const courseId = params.id;

  if (typeof courseId !== "string") return;

  const res = await courseService.getEpisodes(courseId);
  if (res.status === 200) {
    return res.data;
  }
}

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

  const playerRef = useRef<ReactPlayer>(null);

  const handleEpisodeFile = async () => {
    try {
      const res = await episodeFileService.getEpisodeWithFile(episodeId);
      if (res && res.Files && res.Files.length > 0) {
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

  if (episodeOrder + 1 < course.Episodes.length) {
    if (Math.round(episodeTime) === course.Episodes[episodeOrder].secondsLong) {
      handleNextEpisode();
    }
  }


  const hasFiles = getEpisodeFile?.Files && getEpisodeFile.Files.length > 0;
  const file = hasFiles ? getEpisodeFile.Files[0] : null;
  return (
    <>
      <main>
        <HeaderGeneric logoUrl="/home" btnContent={`Voltar para o curso`} btnUrl={`/courses/${courseId}`} />
        <Container className="d-flex flex-column align-items-center gap-3 pt-5">
          <p className={styles.episodeTitle}>{course.Episodes[episodeOrder].name}</p>
          {typeof window == "undefined" ? null : (
            <ReactPlayer
              className={styles.player}
              url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.Episodes[episodeOrder].videoUrl
                }&token=${sessionStorage.getItem("vocenotadez-token")}`}
              controls
              ref={playerRef}
              onStart={() => handlePlayerTime()}
              onProgress={(progress) => {
                setEpisodeTime(progress.playedSeconds);
              }}
            />
          )}
          <div className={styles.divFileUrl}>
            {hasFiles ? (
              <div className={styles.divFileUrl}>
                <Link
                  className={styles.linkStyleFile}
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_BASEURL}/${file?.fileUrl}`}
                  passHref
                >
                  <Button className={styles.btn} color="danger" outline>
                    <img className={styles.pdfviewer} src="/pdfviewer.png" alt="pdfimg" />
                  </Button>
                  <p className={styles.nameFile}>{file?.name}</p>
                </Link>
              </div>
            ): (
              <p>Sem material para download.</p>
            )} 
          </div>
          <div className={styles.episodeButtonDiv}>
            <Button
              className={styles.episodeButton}
              disabled={episodeOrder === 0 ? true : false}
              onClick={() => handleLastEpisode()}
            >
              <img src="/episode/iconArrowLeft.svg" alt="setaEsquerda" className={styles.arrowImg} />
            </Button>
            <Button
              className={styles.episodeButton}
              disabled={episodeOrder + 1 === course.Episodes.length ? true : false}
              onClick={() => handleNextEpisode()}
            >
              <img src="/episode/iconArrowRight.svg" alt="setaDireita" className={styles.arrowImg} />
            </Button>
          </div>

          <p className={styles.pSinopse}>{course.Episodes[episodeOrder].synopsis}</p>

        </Container>
      </main>
    </>
  );
}