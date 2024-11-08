import { Metadata } from "next";
import SearchComponents from "../../src/components/Search";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const generateMetadata = async ({ searchParams, selectedYear }: { searchParams: { name: string }, selectedYear: string }): Promise<Metadata> => {
  const searchTitle = searchParams.name ? `"${searchParams.name}"` : `Todos os cursos do ${selectedYear}`;
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