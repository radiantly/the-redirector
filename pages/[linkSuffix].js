import Head from "next/head"
import {useRouter} from "next/router"
import styles from "../styles/Home.module.css"

export default function Post({ linkSuffix, linkRedirect, linkTitle, linkName, linkDesc, linkImageUrl }) {
  console.log(linkSuffix);
  const router = useRouter()
  if (router.isFallback) 
    return <div className={styles.container}><h1>Generating your link..</h1></div>
  return (
    <div className={styles.container}>
      <Head>
        <title>{linkName || "Redirecting.."}</title>
        <link rel="icon" href="/favicon.ico" />
        {linkName ? <meta property="og:site_name" content={linkName} /> : null }
        {linkDesc ? <meta property="og:site_name" content={linkDesc} /> : null }
        {linkTitle ? <meta property="og:site_name" content={linkTitle} /> : null }
        {linkImageUrl ? <meta property="og:site_name" content={linkImageUrl} /> : null }
      </Head>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params: {linkSuffix} }) {
  const airtableFilter = encodeURIComponent(`{linkSuffix} = '${linkSuffix}'`);
  const airTableResponse = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}?maxRecords=1&filterByFormula=${airtableFilter}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
        "Content-Type": "application/json",
      },
    }
  ).then(res => res.json());

  if (!airTableResponse.records.length)
    return { props: {}, revalidate: 5 }

  return {
    props: airTableResponse.records[0].fields
  }
}
