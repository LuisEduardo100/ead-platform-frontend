"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import courseService, { CourseQuizzType, CourseType } from "../../../src/services/courseService";
import quizService from "../../../src/services/QuizService";
import profileService from "../../../src/services/profileService";
import ToastComponent from "../../../src/components/common/toastComponent";

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
  const [accessType, setAccessType] = useState(false)
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
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
    
    profileService.fetchCurrent().then((user) => {
      const hasFullAccess = user.hasFullAccess
      setAccessType(user.hasFullAccess)

      if (!hasFullAccess) {
        router.push(`/courses/${courseId}?access=${accessType}`)
      } else {
        setLoading(false)
      }
    })
  }, [courseId, router]);

  return (
    <main className={styles.main_container}>
      {(quizz) && <QuizzList quizz={quizz.Quizzes} />}
      <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage}/>
    </main>
  );
}