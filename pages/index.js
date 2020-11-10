import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import ReCAPTCHA from "react-google-recaptcha";
import styles from '../styles/Home.module.css'

export default function Home() {
  const [domain, setDomain] = useState("");
  useEffect(() => setDomain(window.location.href.replace(/(^https?:\/\/[^/]*).*$/, "$1")));
  
  // Form fields
  const [linkSuffix, setLinkSuffix] = useState("");
  const [linkRedirect, setLinkRedirect] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkDesc, setLinkDesc] = useState("");
  const [linkImageUrl, setLinkImageUrl] = useState("");

  // Form state
  const [formState, setFormState] = useState("");
  const [formMessage, setFormMessage] = useState();

  const reCaptchaRef = useRef();

  const handleSubmit = async e => {
    setFormState("loading");
    const reCaptchaResponse = await reCaptchaRef.current.executeAsync();
    console.log(reCaptchaResponse);
    setFormState("double loading");
    const response = await fetch("/api/new", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reCaptchaResponse, linkSuffix, linkRedirect, linkTitle, linkName, linkDesc, linkImageUrl }),
    }).then(res => res.json());
    reCaptchaRef.current.reset()
    setFormState(response.state);
    setFormMessage(response.message)
    console.log(response);
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
      <form className={`ui form ${formState}`}>
        <div className="field required">
          <label>URL to redirect to</label>
          <input type="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" required={true} value={linkRedirect} onInput={e => setLinkRedirect(e.target.value.trim())}/>
        </div>
        <div className={"field required " + (/^[a-z0-9_.~-]*$/i.exec(linkSuffix) ? "" : "error")}>
          <label>Link</label>
          <div className="ui labeled input">
            <div className="ui label">{domain}/</div>
            <input type="text" placeholder="link-name" value={linkSuffix} onInput={e => setLinkSuffix(e.target.value.replace(/ /g, "-"))} />
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label>Link Title</label>
            <input type="text" placeholder="twitter.com" value={linkTitle} onInput={e => setLinkTitle(e.target.value)} />
          </div>
          <div className="eight wide field">
            <label>Link Name</label>
            <input type="url" placeholder="This is a totally legit site" value={linkName} onInput={e => setLinkName(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Link Description</label>
          <input type="text" placeholder="After years of research, scientists have determined that we happen to be humans" value={linkDesc} onInput={e => setLinkDesc(e.target.value)} />
        </div>
        <div className="field">
          <label>Image thumbnail</label>
          <input type="text" placeholder="https://totallylegit.com/real.png" value={linkImageUrl} onInput={e => setLinkImageUrl(e.target.value)} />
        </div>
        {formMessage ? <div className={`ui message ${formState}`}><div className="header">{formMessage.heading}</div><p>{formMessage.body}</p></div> : null}
        <ReCAPTCHA ref={reCaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY} size="invisible" />
        <div className={"ui submit button " + (linkRedirect && linkSuffix ? "" : "disabled")} onClick={handleSubmit}>Create link</div>
      </form>
    </div>
  )
}
