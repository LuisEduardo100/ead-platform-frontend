import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import courseService, { CourseType, QuizzType } from '../../../services/courseService'
import styles from './styles.module.scss'
import { faSquare, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import api from '../../../services/api'
import quizService from '../../../services/QuizService'
import { useRouter, useParams } from 'next/navigation'
import { IconButton, styled } from '@mui/material'
import { ArrowBackIosNew } from '@mui/icons-material'

interface QuizzProps {
    quizz: QuizzType[]
}

const IconBtn = styled(IconButton)({
    color: "#F8F9FA",
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

export default function QuizzList({ quizz }: QuizzProps) {
    const router = useRouter()
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizzCompleted, setQuizzCompleted] = useState(false);
    const [date, setDate] = useState(Date)
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const activeQuestionIndex = userAnswers.length
    const { id } = useParams();

    const courseIdTeste = Array.isArray(id) ? id[0] : id;
    const courseId = courseIdTeste ? parseInt(courseIdTeste, 10) : null;

    const handleQuizResult = async () => {
        try {
            const res = await quizService.getQuizResults(courseId!);
            if (res.status === 200 && res.data.result) {
                setScore(res.data.result.score);
                setDate(res.data.result.createdAt)
                setQuizzCompleted(true);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            setError('Erro ao carregar o resultado do quiz');
            setLoading(false);
        }
    }

    useEffect(() => {
        handleQuizResult();
    }, [router]);

    const handleSetQuizResult = async () => {
        try {
            if (!courseId) { return error }
            const res = await quizService.setQuizResults({ courseId, score });
            if (res.status === 200) {
                setQuizzCompleted(true);
                return
            } else {
                console.error("Entrei aqui no else ")
            }
        } catch (err) {
            setError('Aqui em handleSetQuizResult :Erro ao salvar o resultado do quiz');
        }
    }


    const handleRetry = () => {
        setScore(0)
        setUserAnswers([])
        setQuizzCompleted(false)
    }

    const handleAnswer = (questionIndex: number, selectedAnswer: number) => {
        setUserAnswers((prevAnswers: number[]) => {
            return [...prevAnswers, selectedAnswer]
        });
        const correctAnswer = quizz[questionIndex].correctAnswer;
        if (selectedAnswer + 1 === correctAnswer) {
            setScore(score + 1);
        }

        if (questionIndex === quizz.length) {
            setQuizzCompleted(true)
            handleSetQuizResult()
        }
    };

    const routerPush = () => {
        router.push('/home')
    }
    const handleActualDate = () => {
        const dataInfo = date

        // Horas que foi terminado o quiz
        const hora = new Date(dataInfo)
        const optionsHora: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        }
        const horaInfo = hora.toLocaleTimeString('pt-BR', optionsHora)

        // Dia da semana e data
        const data = new Date(dataInfo)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        }
        const dataFormatada = data.toLocaleDateString('pt-BR', options)

        return <p className='text-center'>
            Você terminou esse quiz em <br />
            {`${dataFormatada}, às ${horaInfo}`}
        </p>
    }

    const quizIsCompleted = activeQuestionIndex === quizz.length;
    useEffect(() => {
        if (quizIsCompleted) {
            handleSetQuizResult()
            setQuizzCompleted(true)
        }
    }, [quizIsCompleted])

    const renderQuestions = () => {
        return (
            <div className={styles.quizz}>
                <div className={styles.question}>

                    <div className={styles.div_nivel}>
                        <IconBtn onClick={routerPush}>
                            <ArrowBackIosNew style={{ fontSize: '48px' }} />
                        </IconBtn>
                        <div className='d-flex gap-2'>
                            <p className={styles.p_serie}>{quizz[activeQuestionIndex]?.serie}</p>

                            {quizz[activeQuestionIndex]?.dificuldade === "Médio" ? (
                                <p className={styles.p_dificuldade_media}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                            ) : quizz[activeQuestionIndex]?.dificuldade === "Difícil" ? (
                                <p className={styles.p_dificuldade_dificil}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                            ) : (
                                <p className={styles.p_dificuldade_facil}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                            )}
                        </div>
                    </div>
                    <h2 className={styles.question_title}>{`${activeQuestionIndex + 1}/${quizz.length}`} - {quizz[activeQuestionIndex]?.question}</h2>
                    <div className={styles.div_image}>
                        {(quizz[activeQuestionIndex]?.fileUrl) && (
                            <div>
                                <img className={styles.img} src={`${process.env.NEXT_PUBLIC_BASEURL
                                    }/${quizz[activeQuestionIndex]?.fileUrl}`} />
                            </div>
                        )}
                    </div>
                    <ul className={styles.answers}>
                        {quizz[activeQuestionIndex]?.answers.map((answer: any, index: number) => (
                            <li key={index}>
                                <Button className={styles.btn_answer} onClick={() => handleAnswer(activeQuestionIndex, index)}>{answer}</Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
    return (
        <div>
            {loading ? (
                <p>Carregando...</p>
            ) : quizzCompleted ? (
                <div className='d-flex flex-column gap-3 align-items-center'>
                    <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '64px' }} />
                    <h2>Você completou esse quizz!</h2>
                    <h3>{`${score}/${quizz.length}`}</h3>
                    {handleActualDate()}
                    <Button onClick={handleRetry}>Tentar novamente</Button>
                </div>
            ) : (
                <div>{renderQuestions()}</div>
            )}
        </div>
    );
}