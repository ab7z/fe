import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

const inter = Inter({subsets: ["latin"]});

type CMS = {
  url: string
}

export const getStaticProps = (() => {
  const cmsURL = process.env.CMS_URL ?? "not defined";
  const cms: CMS = { url: cmsURL };

  return {
    props: {
      cms
    }
  }
}) satisfies GetStaticProps<{
  cms: CMS
}>

export default function Home({ cms }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>hello world</h1>
        <a href={ cms.url }>{ cms.url }</a>
      </main>
    </>
  );
}
