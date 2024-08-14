"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";
import { useRouter } from "next/navigation";
import courseService, { CourseType, EpisodeType } from "../../../src/services/courseService";
import PageSpinner from "../../../src/components/common/pageSpinner";
import HeaderAuth from "../../../src/components/HomeAuth/header";
import EpisodeList from "../../../src/components/Course";
import Footer from "../../../src/components/common/footer";
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
};

export default function Course({ params }: ParamsProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<CourseType>();

  const [liked, setLiked] = useState(Boolean);
  const [favorited, setFavorited] = useState(Boolean);

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

  const handleLikeCourse = async () => {
    if (liked === true) {
      await courseService.removeLike(courseId);
      console.log("it's working to remove" + await courseService.removeLike(courseId))
      setLiked(false);
    } else {
      await courseService.like(courseId);
      console.log("it's working to" + await courseService.like(courseId))
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
    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      setLoading(false);
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
          <HeaderAuth />
        </div>
        <Container className={styles.courseInfo}>
          <p className={styles.courseTitle}>{course?.name}</p>
          <p className={styles.courseDescription}>{course?.synopsis}</p>
          <div className={styles.divBtnImg}>
            <Link href={'#titulo'}>
              <Button
                outline
                className={styles.courseBtn}
                disabled={course?.Episodes?.length === 0 ? true : false}
              >
                ASSISTIR
                <img src="/buttonPlay.svg" alt="buttonImg" className={styles.buttonImg} />
              </Button>
            </Link>
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
        </Container>
        <Container className={styles.episodeInfo}>
          <div className={styles.titleAndDescription} id={"titulo"}>
            <p className={styles.episodeDivision}>EPISÓDIOS</p>
            <p className={styles.episodeLength}>{`(${course?.Episodes?.length})`}</p>
          </div>
          {course?.Episodes?.length === 0 ? (
            <p>
              <strong>Não temos episódios ainda, volte outra hora! &#x1F606;&#x1F918;</strong>
            </p>
          ) : (
            course?.Episodes?.map((episode) => <EpisodeList key={episode.id} episode={episode} course={course} />)
          )}
        </Container>
        <Footer />
      </main>
    </>
  );
}