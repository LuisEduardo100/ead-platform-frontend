import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuizzType } from '../../../services/courseService'
import styles from './styles.module.scss'
import { faSquare, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Button } from 'reactstrap'

interface QuizzProps {
    quizz: QuizzType[]
}

export default function QuizzList({ quizz }: QuizzProps) {

    /*
        Criar uma tabela no postgresql 
        Pegar o userCurrent logado, correctAnswer no final do quizz e fazer um put nessa tabela
        Fazer um get nessa tabela para conferir se o usuário atual logado bate com algum usuário de lá
        Se sim, o usuário n vai conseguir fazer o quizz
        Se não, o usuário consegue fazer o quizz
        Ao fazer, os dados são atualizados na tabela
    */
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizzCompleted, setQuizzCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const activeQuestionIndex = userAnswers.length

    const handleRetry = () => {
        setScore(0)
        setUserAnswers([])
        setQuizzCompleted(false)
    }
    const handleAnswer = (questionIndex: number, selectedAnswer: number) => {
        setUserAnswers((prevAnswers: number[]) => {
            return [...prevAnswers, selectedAnswer]
        });
        const correctAnswer = quizz[questionIndex].correctAnswer-1;
        if (selectedAnswer === correctAnswer) {
            setScore(score+1);
        }
    };


    const handleActualDate = () => {
        const date = new Date()
        return <p className='text-center'>
            Você terminou esse quiz em <br />
            {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
        </p>
    }



    const quizIsCompleted = quizz && activeQuestionIndex === quizz.length;
    useEffect(() => {
        if (quizIsCompleted) {
            setQuizzCompleted(true)
        }
    }, [activeQuestionIndex])

    const renderQuestions = () => {
        return (
            <div className={styles.quizz}>
                <div className={styles.question}>
                    <div className={styles.div_nivel}>
                        <p className={styles.p_serie}>{quizz[activeQuestionIndex]?.serie}</p>
                        {quizz[activeQuestionIndex]?.dificuldade === "Médio" ? (
                            <p className={styles.p_dificuldade_media}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                        ) : quizz[activeQuestionIndex]?.dificuldade === "Difícil" ? (
                            <p className={styles.p_dificuldade_dificil}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                        ) : (
                            <p className={styles.p_dificuldade_facil}>{quizz[activeQuestionIndex]?.dificuldade}</p>
                        )}
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
            {quizzCompleted ? (
                <div className='d-flex flex-column gap-3 align-items-center'>
                    <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '64px' }} />
                    <h2>Você completou esse quizz!</h2>
                    <h3>{`${score}/${quizz.length}`}</h3>
                    {handleActualDate()}
                    <Button onClick={handleRetry}>Tentar novamente</Button>
                </div>
            ) : (
                <div>
                    {renderQuestions()}
                </div>
            )}
        </div>
    );
}