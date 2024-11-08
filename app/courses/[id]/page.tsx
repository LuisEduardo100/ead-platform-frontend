"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";
import { useRouter, useSearchParams } from "next/navigation";
import courseService, { CourseQuizzType, CourseType, EpisodeType, WatchStatus } from "../../../src/services/courseService";
import PageSpinner from "../../../src/components/common/pageSpinner";
import HeaderAuth from "../../../src/components/HomeAuth/header";
import EpisodeList from "../../../src/components/Course";
import Footer from "../../../src/components/common/footer";
import QuizzList from "../../../src/components/common/quizzPage";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import quizService from "../../../src/services/QuizService";
import ToastComponent from "../../../src/components/common/toastComponent";
import { IconButton, styled } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import profileService from "../../../src/services/profileService";
import { useYear } from "../../../src/components/HomeAuth/selectBox/yearProvider";

const IconBtn = styled(IconButton)({
  color: "#000",
  padding: "0px 6px",
  "&:hover": {
    opacity: 0.80,
  },

  '@media (max-width: 300px)': {
    padding: "0px 4px",
  }
});

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
};

export default function Course({ params }: ParamsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<CourseType>();
  const [liked, setLiked] = useState(Boolean);
  const [favorited, setFavorited] = useState(Boolean);
  const [firstEpisodeId, setFirstEpisodeId] = useState(0)
  const [firstEpisodeOrder, setFirstEpisodeOrder] = useState(0)
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { selectedYear, onYearChange } = useYear();




  const paramsUrl = useSearchParams()
  const courseId = params.id;

  const getCourse = async () => {
    const course = await getCourseId({ params });
    setCourse(course);
    setLiked(course.liked);
    setFavorited(course.favorited);
  };
  useEffect(() => {
    getCourse();
  }, [courseId]);

  const handleBackRouter = () => {
    router.push('/home')
  }

  const handleLikeCourse = async () => {
    if (liked === true) {
      await courseService.removeLike(courseId);
      setLiked(false);
    } else {
      await courseService.like(courseId);
      setLiked(true);
    }
  };

  const handleFavCourse = async () => {
    if (favorited === true) {
      await courseService.removeFav(courseId);
      setFavorited(false);
    } else {
      await courseService.addToFav(courseId);
      setFavorited(true);
    }
  };

  useEffect(() => {
    if (course?.Episodes && course.Episodes.length > 0) {
      const firstEpisode = course.Episodes[0].id;
      const episodeOrder = course.Episodes[0].order
      setFirstEpisodeOrder(episodeOrder);
      setFirstEpisodeId(firstEpisode)
    }
  }, [course])

  const handleFirstEpisode = () => {
    router.push(`/courses/episodes/${firstEpisodeOrder! - 1}?courseid=${course?.id}&episodeid=${firstEpisodeId}`);
  };

  useEffect(() => {
    const access = paramsUrl.get("access")

    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }

    if (access === "false") {
      setToastIsOpen(true)
      setToastColor('bg-danger')
      setTimeout(() => {
        setToastIsOpen(false)
      }, 2500)

      setToastMessage("Acesso negado")
    }
  }, []);


  if (loading) {
    return <PageSpinner />;
  }

  return (
    <>
      <main>
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom, #dadada04, #E8E8E8), url(${process.env.NEXT_PUBLIC_BASEURL}/${course?.thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "600px",
          }}>
          <HeaderAuth selectedYear={selectedYear} onYearChange={onYearChange} />
        </div>
        <Container className={styles.courseInfo}>
          <div className="d-flex align-items-center">
            <IconBtn onClick={handleBackRouter}>
              <ArrowBackIosNew style={{fontSize: '32px', marginRight: '5px'}}/>
            </IconBtn>
            <p className={styles.courseTitle}>{course?.name}</p>
            <div className={styles.interactions}>
              {liked === true ? (
                <img src="/course/iconLiked.svg" alt="likedImage" className={styles.interactionImagesTrue} onClick={() => handleLikeCourse()} />
              ) : (
                <img src="/course/iconLike.svg" alt="likeImage" className={styles.interactionImages} onClick={() => handleLikeCourse()} />
              )}
              {favorited === true ? (
                <img onClick={() => handleFavCourse()} src="/course/iconFavorited.svg" alt="favorited" className={styles.interactionImagesTrue} />
              ) : (
                <img onClick={() => handleFavCourse()} src="/course/iconAddFav.svg" alt="addFav" className={styles.interactionImages} />
              )}
            </div>
          </div>
          <p className={styles.courseDescription}>{course?.synopsis}</p>
            <p className={styles.episodesLength}>Episódios:&nbsp;&nbsp;{`${course?.Episodes?.length}`} </p>
          <div className={styles.divBtnImg}>
            <Button
              outline
              className={styles.courseBtn}
              disabled={course?.Episodes?.length === 0 ? true : false}
              onClick={(handleFirstEpisode)}
            >
              ASSISTIR
              <img src="/buttonPlay.svg" alt="buttonImg" className={styles.buttonImg} />
            </Button>
          </div>
        </Container>
        <Container className={styles.episodeInfo}>
          {course?.Episodes?.length === 0 ? (
            <p>
              <strong>Não temos episódios ainda, volte outra hora! &#x1F606;&#x1F918;</strong>
            </p>
          ) : (
            course?.Episodes?.map((episode) =>
              <EpisodeList key={episode.id} episode={episode} course={course} />)
          )}
        </Container>
        <Footer />
        <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
      </main>
    </>
  );
}