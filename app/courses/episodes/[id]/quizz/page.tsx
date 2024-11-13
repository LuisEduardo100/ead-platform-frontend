import { ArrowBack } from '@mui/icons-material'
import { EpisodeType } from '../../../../../src/services/courseService'
import styles from './styles.module.scss'

type episodeWithQuizz = {
    episode: EpisodeType
}

export default function Quizz({episode}: episodeWithQuizz) {
    return <>
        <main>
            <div className={styles.limited_section}>
                <div className={styles.header}>
                    <p>curso de matemática {'>'} episódio 1. Operações {'>'} básicas {'>'} exercício</p>
                </div>
                <div className={styles.questionBox}>
                    <h1></h1>
                </div>
            </div>
        </main>
    </>
}