import courseService from "../../../src/services/courseService";

export type ParamsProps = {
    params: { id: number | string };
};

export async function generateStaticParams({ params }: ParamsProps) {
    const courseId = params.id;

    if (typeof courseId !== "string") return;

    const res = await courseService.getEpisodes(courseId);

    if (res.status === 200) {
        return res.data;
    }
};