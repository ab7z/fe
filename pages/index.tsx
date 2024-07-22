import type { Page } from "@/payload-types"
import styles from "@/styles/Home.module.css"
import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { Inter } from "next/font/google"
import qs from "qs"

const inter = Inter({ subsets: ["latin"] })

export const getStaticProps = (async () => {
  if (process.env.STAGE === undefined) throw new Error("stage not defined")
  if (process.env.CMS_URL_DEV === undefined) throw new Error("CMS_URL_DEV not defined")
  if (process.env.CMS_URL_REV === undefined) throw new Error("CMS_URL_REV not defined")
  if (process.env.CMS_URL_MAIN === undefined) throw new Error("CMS_URL_MAIN not defined")

  let cmsURL
  if (process.env.NODE_ENV === "development") {
    cmsURL = process.env.CMS_URL_LOCAL
  } else {
    if (process.env.STAGE === "rev") {
      cmsURL = process.env.CMS_URL_REV
    } else if (process.env.STAGE === "dev") {
      cmsURL = process.env.CMS_URL_DEV
    } else {
      cmsURL = process.env.CMS_URL_MAIN
    }
  }

  const query = qs.stringify(
    {
      where: {
        identifier: { equals: "home" },
      },
    },
    { addQueryPrefix: true }
  )

  const resp = await fetch(`${cmsURL}/api/pages${query}`, {
    method: "GET",
    headers: new Headers({ Accept: "application/json" }),
  })
  if (resp.status !== 200) throw new Error(`${resp.status} ${resp.statusText}`)
  const data = await resp.json()

  return {
    props: {
      page: data.docs[0] as Page,
    },
  }
}) satisfies GetStaticProps<{ page: Page }>

export default function Home({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main
      className={`${styles.main} ${inter.className}`}
      dangerouslySetInnerHTML={{ __html: page.content_html! }}
    />
  )
}
