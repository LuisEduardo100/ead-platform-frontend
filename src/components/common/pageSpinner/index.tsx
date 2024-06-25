import { Button, Spinner } from "reactstrap";
export default function PageSpinner() {
    return (<>
        <div className="vh-100 bg-dark d-flex justify-content-center align-items-center">

            <Button
                color="light"
                disabled
            >
                <Spinner animation='border' size="sm">
                    Loading...
                </Spinner>
                <span>
                    {' '}LOADING
                </span>
            </Button>
        </div>

    </>)
}