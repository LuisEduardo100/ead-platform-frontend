import { Button, Container } from "reactstrap";
import { CourseType } from "../../../services/courseService";
import SlideComponentNoYear from "../../common/SlideComponentNoYear";

export interface props {
	newestCourses: CourseType[]
}

export default function SlideSectionNoYear ({ newestCourses }: props){
    return (
      <>
        <Container>
          <SlideComponentNoYear course={newestCourses} />
        </Container>
      </>
    );
}