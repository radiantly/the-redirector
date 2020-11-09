import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [domain, setDomain] = useState("");
  useEffect(() => setDomain(window.location.href.replace(/(^https?:\/\/[^/]*).*$/, "$1")));
  const [linkName, setLinkName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isProcessing, setProcessing] = useState(false);

  const handleSubmit = e => {
    setProcessing(true);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>The Redirector</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amatic+SC&family=Itim&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.css"></link>
      </Head>
      <h1>The Redirector</h1>
      <p>The Redirector is a custom metadata link redirect tool. Basically, it sets the meta tags that's used to show link previews in apps like WhatsApp, Discord or Slack. Hands down the easiest tool to prank your friends with.</p>
      <h2>Give it a try ;)</h2>
      <form className={`ui form ${isProcessing ? "loading": ""}`}>
        <div className="field required">
          <label>URL to redirect to</label>
          <input type="url" name="linkUrl" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" required={true} value={redirectUrl} onInput={e => setRedirectUrl(e.target.value.trim())}/>
        </div>
        <div className={"field required " + (/^[a-z0-9_.~-]*$/i.exec(linkName) ? "" : "error")}>
          <label>Link</label>
          <div class="ui labeled input">
            <div class="ui label">{domain}/</div>
            <input type="text" placeholder="link-name" value={linkName} onInput={e => setLinkName(e.target.value.replace(/ /g, "-"))} />
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label>Link Title</label>
            <input type="text" name="linkText" placeholder="twitter.com" />
          </div>
          <div className="eight wide field">
            <label>Link Name</label>
            <input type="url" name="linkImageUrl" placeholder="This is a totally legit site" />
          </div>
        </div>
        <div className="field">
          <label>Link Description</label>
          <input type="text" name="linkDescription" placeholder="After years of research, scientists have determined that we happen to be humans" />
        </div>
        <div className="field">
          <label>Image thumbnail</label>
          <input type="text" name="linkDescription" placeholder="https://totallylegit.com/real.png" />
        </div>
        <div className={"ui submit button " + (redirectUrl && linkName ? "" : "disabled")} onClick={handleSubmit}>Create link</div>
      </form>
    </div>
  )
}
