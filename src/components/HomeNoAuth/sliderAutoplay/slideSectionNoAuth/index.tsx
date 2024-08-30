import { Button, Container } from "reactstrap";
import { CourseType } from "../../../../services/courseService";
import styles from "./styles.module.scss";
import SlideComponent from "../../../common/SlideComponent";
import Link from "next/link";
import SlideComponentNoAuth from "../SlideComponent";

export interface props {
	newestCourses: CourseType[]
}

export default function SlideSectionNoAuth ({ newestCourses }: props){
    return (
      <>
        <Container fluid className="d-flex flex-column align-items-center pb-2">
          <SlideComponentNoAuth course={newestCourses} />
        </Container>
      </>
    );
}