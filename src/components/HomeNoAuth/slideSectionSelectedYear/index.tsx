import { Button, Container } from "reactstrap";
import { CourseType } from "../../../services/courseService";
import styles from "./styles.module.scss";
import SlideComponent from "../../common/SlideComponent";
import Link from "next/link";

export interface props {
	newestCourses: CourseType[]
  selectedYear: string
}

export default function SlideSection ({ newestCourses, selectedYear }: props){
    return (
      <>
        <Container>
          <SlideComponent course={newestCourses} serie={selectedYear}/>
        </Container>
      </>
    );
}