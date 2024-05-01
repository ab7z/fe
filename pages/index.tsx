import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import type {GetStaticProps, InferGetStaticPropsType} from "next";
import type {Page} from "@/payload-types";
import qs from "qs";

const inter = Inter({subsets: ["latin"]});

export const getStaticProps = (async () => {
  const cmsURL = process.env.NODE_ENV === "development" ? process.env.CMS_URL_LOCAL : process.env.CMS_URL_PROD;
  if (cmsURL === undefined) throw new Error("cms url not defined")

  const query = qs.stringify({
    where: {
      identifier: {equals: "home"}
    }
  }, {addQueryPrefix: true})

  const resp = await fetch(`${cmsURL}/pages${query}`, {
    method: "GET",
    headers: new Headers({"Accept": "application/json"})
  })
  if (resp.status !== 200) throw new Error(`${resp.status} ${resp.statusText}`)
  const data = await resp.json()

  return {
    props: {
      page: data.docs[0] as Page
    }
  }
}) satisfies GetStaticProps<{ page: Page }>

export default function Home({page}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={`${styles.main} ${inter.className}`} dangerouslySetInnerHTML={{__html: page.content_html!}}/>
  );
}
