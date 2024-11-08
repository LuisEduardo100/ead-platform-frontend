import { Metadata } from "next";
import SearchComponents from "../../src/components/Search";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const generateMetadata = async ({ searchParams }: { searchParams: { name: string, serie: string}}): Promise<Metadata> => {
  const searchTitle = searchParams.name ? `"${searchParams.name}"` : `Todos os cursos do ${searchParams.serie}`;
  return {
    title: `Você Nota Dez - ${searchTitle}`,
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