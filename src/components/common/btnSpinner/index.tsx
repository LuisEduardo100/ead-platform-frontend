import { Button, Spinner } from "reactstrap";
import styles from './styles.module.scss'

export default function BtnSpinner() {
    return (<>
        <div className="bg-transparent d-flex align-items-center">
            <div className={styles.wrapper}>
                <Button
                    color="light"
                    disabled
                >
                    <Spinner type='border' size='sm'>
                        Loading...
                    </Spinner>
                </Button>
            </div>
        </div>

    </>)
}