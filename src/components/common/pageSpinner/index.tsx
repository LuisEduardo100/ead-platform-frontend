import { Button, Spinner } from "reactstrap";
import styles from './styles.module.scss'

export default function PageSpinner() {
    return (<>
        <div className="vh-100 bg-transparent d-flex align-items-center">
            <div className={styles.wrapper}>
                <Button
                    color="light"
                    disabled
                >
                    <Spinner animation='border' size="sm">
                        Carregando...
                    </Spinner>
                    <span>
                        {' '}Carregando
                    </span>
                </Button>
            </div>
        </div>

    </>)
}