import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuizzType } from '../../../services/courseService'
import Styles from './styles.module.scss'
import { faSquare } from '@fortawesome/free-solid-svg-icons'

interface QuizzProps {
    quizz: QuizzType[]
} 

export default function QuizzList({ quizz }: QuizzProps) {
    return (
        <>
            {quizz?.map((quizItem, index) => (
                <div className={Styles.quizz_container} key={index}>
                    <div className={Styles.nivel_container}>
                        <p className={Styles.nivel}>{quizItem.dificuldade}</p>
                        <p className={Styles.serie}>{quizItem.serie}</p>
                    </div>
                    <p className={Styles.question}>{`${quizItem.order} - ${quizItem.question}`}</p>
                    {quizItem.fileUrl && (
                        <div className={Styles.img_container}>
                            <img src={`${process.env.NEXT_PUBLIC_BASEURL}/${quizItem.fileUrl}`} alt="Questão relacionada" />
                        </div>
                    )}
                    {quizItem.answers.map((answer, answerIndex) => (
                        <p className={Styles.answers} key={answerIndex}>
                            <FontAwesomeIcon icon={faSquare} style={{ fontSize: '24px', color: '#183153' }} />
                            {answer}
                        </p>
                    ))}
                </div>
            ))}
        </>
    );
};