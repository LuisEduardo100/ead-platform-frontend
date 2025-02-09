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
  const [loading, setLoading] = useState(true)
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const freeCourseAccess = course.name.toLowerCase().trim() !== 'matemática básica'

  return (<>
    <div
      className={styles.card}
      onClick={() => {
        if (access || !freeCourseAccess) {
          router.push(`/courses/${course.id}`)
        } else {
          setToastIsOpen(true);
          setToastColor("bg-danger");
          setToastMessage("Matricule-se para ter acesso.");
          setTimeout(() => setToastIsOpen(false), 3000);
        }
      }}
    >
      {!access && freeCourseAccess && <div style={{
        backgroundColor: '#141414',
        borderRadius: '50%',
        padding: '4px 6px 8px 7px',
        position: 'absolute',
        right: 8,
        bottom: 5,
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
    <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
  </>
  )
}