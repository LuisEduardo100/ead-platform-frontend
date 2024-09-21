import { Button, Spinner } from "reactstrap";

export default function BufferingSpinner() {
    return (<>
        <div className="h-auto bg-transparent d-flex align-items-center">
            <div>
                    <Spinner type='border' color="light" style={{width: '4rem', height: '4rem'}}>
                        Loading...
                    </Spinner>
            </div>
        </div>

    </>)
}