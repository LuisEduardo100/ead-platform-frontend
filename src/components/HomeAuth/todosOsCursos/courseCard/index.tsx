import Image from "next/image";
import { CourseType } from "../../../../services/courseService";
import styles from './style.module.scss'
import { useRouter } from "next/navigation";

export default function CourseCard({course}: {course: CourseType}) {
  const router = useRouter()

  return (
    <div 
      className={styles.card}
      onClick={() => router.push(`/courses/${course.id}`)}
    >
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
  )
}