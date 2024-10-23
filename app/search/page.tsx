import { Metadata } from "next";
import SearchComponents from "../../src/components/Search";

export const generateMetadata = async ({ searchParams }: { searchParams: { name: string } }): Promise<Metadata> => {
  return {
    title: `Você Nota Dez - "${searchParams.name}"`,
  };
};

export default async function Search({ searchParams, selectedYear, onYearChange}: { searchParams: { name: string }, selectedYear: string, onYearChange: (year:string) => void }) {

  return (
    <>
      <main>
        <SearchComponents selectedYear={selectedYear} onYearChange={onYearChange} searchParams={searchParams} />
      </main>
    </>
  );
}