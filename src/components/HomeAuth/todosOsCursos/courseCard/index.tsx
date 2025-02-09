import Image from "next/image";
import { CourseType } from "../../../../services/courseService";
import styles from './style.module.scss'
import { useRouter } from "next/navigation";
import { useState } from "react";
import ToastComponent from "../../../common/toastComponent";
import { Lock } from "@mui/icons-material";

interface Props {
  course: CourseType;
  access: boolean;
}

export default function CourseCard({ course, access }: Props) {
  const router = useRouter()
  const freeCourseAccess = course.name.toLowerCase().trim() !== 'matemática básica'

  return (<>

    <div
      className={styles.card}
      onClick={() => {
        if (access || !freeCourseAccess) {
          sessionStorage.setItem("previousPage", window.location.pathname);
          router.push(`/courses/${course.id}`)
        } 
      }}
    >
      {!access && freeCourseAccess && <div style={{
        position: 'absolute',
        right: 16,
        bottom: 12,
        color: '#ff3130'
      }}><Lock fontSize='small' /></div>}
      <Image
        src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
        style={{
          borderRadius: '20px',
          objectFit: 'cover'
        }}
        alt="course-thumb"
        width={140}
        height={90}
        quality={100}
      />
      <div>
        <p className={styles.course_name}>{course.name.toUpperCase()}</p>
        <p className={styles.qtd_aulas}>{`${course.Episodes!.length > 1 ? `${course.Episodes?.length} aulas` : `${course.Episodes?.length} aula`} `}</p>
      </div>
    </div>
  </>
  )
}