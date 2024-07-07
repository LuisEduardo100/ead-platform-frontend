import { Metadata } from "next";
import SearchComponents from "../../src/components/Search";

export const generateMetadata = async ({ searchParams }: { searchParams: { name: string } }): Promise<Metadata> => {
  return {
    title: `Você Nota Dez - "${searchParams.name}"`,
  };
};

export default async function Search({ searchParams }: { searchParams: { name: string } }) {

  return (
    <>
      <main>
        <SearchComponents searchParams={searchParams} />
      </main>
    </>
  );
}