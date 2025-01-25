import { Metadata } from "next";
import SearchComponents from "../../src/components/Search";

export const generateMetadata = async ({ searchParams }: { searchParams: { name: string, serie: string}}): Promise<Metadata> => {
  const searchTitle = searchParams.name ? `"${searchParams.name}"` : `Todos os cursos do ${searchParams.serie}`;
  return {
    title: `Pesquisa para: ${searchTitle}`,
  };
};

export default async function Search({ searchParams }: { searchParams: { name: string, serie: string } }) {

  return (
    <>
      <main>
        <SearchComponents searchParams={searchParams}/>
      </main>
    </>
  );
}