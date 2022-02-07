addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { method, url } = request;
  const generateJSONResponse = (json, options = {}) =>
    new Response(JSON.stringify(json), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      ...options,
    });
  if (method === "GET") {
    const { pathname, origin } = new URL(url);
    if (pathname === "/")
      return new Response(`import public/index.html`, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    if (pathname === "/script.js")
      return new Response(`import public/script.js`, {
        headers: { "content-type": "application/javascript;charset=UTF-8" },
      });
    if (pathname === "/style.css")
      return new Response(`import public/style.css`, {
        headers: { "content-type": "text/css;charset=UTF-8" },
      });
    console.log(pathname);
    if (pathname.startsWith("/exists/")) {
      const query = pathname.split("/", 3)[2];
      if (!query) return generateJSONResponse({ success: false, error: "No query present" });
      const result = await REDIRECTS.get(query);
      console.log(query, result);
      return generateJSONResponse({ success: true, exists: !!result });
    }

    const linkParts = pathname.split("/", 3);
    const linkSuffix = linkParts[1];
    const linkInfo =
      (await REDIRECTS.get(linkSuffix, { type: "json" })) ??
      (linkSuffix != linkSuffix.toLowerCase()
        ? await REDIRECTS.get(linkSuffix.toLowerCase(), { type: "json" })
        : null);
    if (linkInfo === null)
      return generateJSONResponse({ success: false, error: "Page not found" }, { status: 404 });
    const { linkRedirect, linkTitle, linkName, linkDesc, linkImageUrl } = linkInfo;
    const finalRedirect = linkParts[2]
      ? new URL(linkParts[2], linkRedirect).toString()
      : encodeURI(linkRedirect);
    if (linkTitle || linkName || linkDesc || linkImageUrl)
      return new Response(`import public/redirect.html`, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    return Response.redirect(finalRedirect, 301);
  }
  if (method === "POST") {
    const paramMaxLens = {
      linkRedirect: 512,
      linkSuffix: 256,
      linkTitle: 64,
      linkName: 64,
      linkDesc: 512,
      linkImageUrl: 512,
    };
    const reqObj = await request.json();
    console.log(reqObj);
    for (const [param, maxLen] of Object.entries(paramMaxLens))
      if (typeof reqObj[param] !== "string" || reqObj[param].length > maxLen)
        return generateJSONResponse(
          { success: false, error: `${param} does not exist or is too large` },
          { status: 413 }
        );

    const { linkRedirect, linkSuffix, linkTitle, linkName, linkDesc, linkImageUrl } = reqObj;
    if (!linkRedirect || !linkSuffix)
      return generateJSONResponse({ success: false }, { status: 400 });

    if (linkSuffix.match(/[:/?]/))
      return generateJSONResponse(
        { success: false, error: "Invalid characters in link name" },
        { status: 400 }
      );

    if ((await REDIRECTS.get(linkSuffix)) !== null)
      return generateJSONResponse({ success: false, error: "Already exists" }, { status: 409 });
    await REDIRECTS.put(
      linkSuffix,
      JSON.stringify({ linkRedirect, linkTitle, linkName, linkDesc, linkImageUrl })
    );
    return generateJSONResponse({ success: true });
  }

  return generateJSONResponse(
    { success: "unsure" },
    {
      status: 418,
    }
  );
}
