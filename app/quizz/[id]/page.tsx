"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import courseService, { CourseQuizzType, CourseType } from "../../../src/services/courseService";
import QuizzList from "../../../src/components/common/quizzPage";
import quizService from "../../../src/services/QuizService";

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
  const [quizz, setQuizz] = useState<CourseQuizzType>();

  const courseId = params.id;

  const getCourse = async () => {
    const course = await getCourseId({ params });
    setCourse(course);
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

 
  const getQuizz = async () => {
    try {
      const response = await quizService.getQuizz(courseId);
  
      if (!response) {
        console.error("Erro em getQuizz na página de curso: quizz não encontrado.");
        return;
      }
  
      if (response.status === 200) {
        setQuizz(response.data); 
      }
    } catch (error) {
      console.error("Erro ao chamar getQuizz:", error);
    }
  };
  useEffect(() => {
      getQuizz();
  }, [quizz]);
  
  useEffect(() => {
    if (!sessionStorage.getItem("vocenotadez-token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);
  
  return (
    <main className={styles.main_container}>
      {(quizz) && <QuizzList quizz={quizz.Quizzes}/>}
    </main>
  );
}