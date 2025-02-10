"use client";
import { useEffect, useState, useCallback } from "react";
import { Button, Container } from "reactstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton, styled } from "@mui/material";
import {
  ArrowBackIosNew,
  Favorite,
  FavoriteBorder,
  CheckCircle,
  AddCircleOutline
} from "@mui/icons-material";

import courseService, { CourseType } from "../../../src/services/courseService";
import PageSpinner from "../../../src/components/common/pageSpinner";
import HeaderAuth from "../../../src/components/HomeAuth/header";
import EpisodeList from "../../../src/components/Course/episodeList";
import ToastComponent from "../../../src/components/common/toastComponent";
import FooterAuth from "../../../src/components/HomeAuth/footerAuth";
import { useMenu } from "../../../src/components/common/menu/menuProvider";

import styles from "./styles.module.scss";

// Estilização do botão de ícone usando MUI e a paleta do site.
const IconBtn = styled(IconButton)({
  color: "#1C1C1C",
  padding: "0px 6px",
  "&:hover": {
    opacity: 0.8,
  },
  "@media (max-width: 300px)": {
    padding: "0px 4px",
  },
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
  const paramsUrl = useSearchParams();
  const { isMenuOpen } = useMenu();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseType>();
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [firstEpisodeId, setFirstEpisodeId] = useState(0);
  const [firstEpisodeOrder, setFirstEpisodeOrder] = useState(0);
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const courseId = params.id;

  // Função para buscar os dados do curso e atualizar os estados
  const getCourseData = useCallback(async () => {
    const courseData = await getCourseId({ params });
    setCourse(courseData);
    if (courseData) {
      setLiked(courseData.liked);
      setFavorited(courseData.favorited);
    }
  }, [params]);

  useEffect(() => {
    getCourseData();
  }, [getCourseData, courseId]);

  // Captura o primeiro episódio para o botão "ASSISTIR"
  useEffect(() => {
    if (course?.Episodes && course.Episodes.length > 0) {
      const firstEpisode = course.Episodes[0];
      setFirstEpisodeOrder(firstEpisode.order);
      setFirstEpisodeId(firstEpisode.id);
    }
  }, [course]);

  // Navega para a página do primeiro episódio
  const handleFirstEpisode = () => {
    router.push(
      `/courses/episodes/${firstEpisodeOrder - 1}?courseid=${course?.id}&episodeid=${firstEpisodeId}`
    );
  };

  // Botões de navegação e interação
  const handleBackRouter = () => {
    const previousPage = sessionStorage.getItem("previousPage") || "/home";
    router.push(previousPage);
  };

  const handleLikeCourse = async () => {
    if (liked) {
      await courseService.removeLike(courseId);
      setLiked(false);
    } else {
      await courseService.like(courseId);
      setLiked(true);
    }
  };

  const handleFavCourse = async () => {
    if (favorited) {
      await courseService.removeFav(courseId);
      setFavorited(false);
    } else {
      await courseService.addToFav(courseId);
      setFavorited(true);
    }
  };

  // Validação de acesso e exibição de Toast
  useEffect(() => {
    const access = paramsUrl.get("access");
    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login?access=denied");
    } else {
      setLoading(false);
    }
    if (access === "false") {
      setToastIsOpen(true);
      setToastColor("bg-danger");
      setToastMessage("Acesso negado");
      setTimeout(() => {
        setToastIsOpen(false);
      }, 2500);
    }
  }, [paramsUrl, router]);

  if (!course || loading) {
    return <PageSpinner />;
  }

  return (
    <>
      <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
        <div style={{flex: '1'}}>
          <div
            className={styles.hero}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(28,28,28,0.2), #E8E8E8), url(${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "600px",
            }}
          >
            <HeaderAuth/>
          </div>

          {/* Informações do Curso */}
          <Container className={styles.courseInfo}>
            <div className={styles.headerRow}>
              <IconBtn onClick={handleBackRouter}>
                <ArrowBackIosNew style={{ fontSize: "32px", marginRight: "10px" }} />
              </IconBtn>
              {/* Container com Título e Interações */}
              <div className={styles.headerTitleContainer}>
                <h1 className={styles.courseTitle}>{course.name}</h1>
                <div className={styles.interactions}>
                  {liked ? (
                    <Favorite
                      style={{ color: "#D42428", fontSize: "32px", cursor: "pointer" }}
                      onClick={handleLikeCourse}
                    />
                  ) : (
                    <FavoriteBorder
                      style={{ color: "#D42428", fontSize: "32px", cursor: "pointer" }}
                      onClick={handleLikeCourse}
                    />
                  )}
                  {favorited ? (
                    <CheckCircle
                      style={{ color: "#DEB66B", fontSize: "32px", cursor: "pointer" }}
                      onClick={handleFavCourse}
                    />
                  ) : (
                    <AddCircleOutline
                      style={{ color: "#DEB66B", fontSize: "32px", cursor: "pointer" }}
                      onClick={handleFavCourse}
                    />
                  )}
                </div>
              </div>
            </div>
            <p className={styles.courseDescription}>{course.synopsis}</p>
            <p className={styles.episodesLength}>Episódios: {course.Episodes?.length}</p>
          </Container>

          {/* Lista de Episódios */}
          <Container className={styles.episodeInfo}>
            {course.Episodes?.length === 0 ? (
              <p className={styles.noEpisodes}>
                <strong>
                  Não temos episódios ainda, volte outra hora! &#x1F606;&#x1F918;
                </strong>
              </p>
            ) : (
              <div className={styles.episodeList}>
                {course.Episodes?.map((episode) => (
                  <EpisodeList key={episode.id} episode={episode} course={course} />
                ))}
              </div>
            )}
          </Container>
          <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
        </div>
        <FooterAuth />
      </main>
    </>
  );
}
