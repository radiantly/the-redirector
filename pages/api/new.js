// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const generateResponse = (heading, body, state = "error") => ({state, message: {heading, body}});
  console.log("Hit!")

  // Only allow POST requests
  if (req.method !== "POST") return res.status(405).send(generateResponse("Method Not Allowed", "Only POST requests are allowed to this endpoint."));

  try {
    // Test if the parameters we expect are sent in the request
    const expectedParams = ["reCaptchaResponse", "linkSuffix", "linkRedirect", "linkTitle", "linkName", "linkDesc", "linkImageUrl"];
    for (const expectedParam of expectedParams)
      if (typeof req.body[expectedParam] !== "string")
        return res.status(400).json(generateResponse("Parameter missing", `The parameter ${expectedParam} is missing from the response`));
      else if (req.body[expectedParam].length > 512)
        return res.status(413).json(generateResponse("Parameter too large", `The parameter ${expectedParam} is longer than 512 characters.`));


    // Test captcha response
    const { reCaptchaResponse } = req.body;

    const reCaptchaVerify = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${reCaptchaResponse}`,
      {
        method: "POST",
      }
    )

    if (!(await reCaptchaVerify.json()).success)
      return res.status(401).json(generateResponse("Invalid Captcha Response", "Please try again"))

    // Please 
    const { linkSuffix, linkRedirect, linkTitle, linkName, linkDesc, linkImageUrl } = req.body;
    if (!/^[a-z0-9_.~-]+$/i.exec(linkSuffix))
      return res.status(400).json(generateResponse("Invalid Link", "The link to your site must adhere to /^[a-z0-9_.~-]+$/i"));

    if (!/^https?:\/\/.+/.exec(linkRedirect)) 
      return res.status(400).json(generateResponse("Invalid Redirect URL", "Please fill in an URL to redirect to."));

    const airtableFilter = encodeURIComponent(`{linkSuffix} = '${linkSuffix}'`);
    const airTableCheckResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}?maxRecords=1&filterByFormula=${airtableFilter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json());

    if (airTableCheckResponse.records.length)
      res.status(400).json(generateResponse("Link Exists", "Please use another shortlink."));

    const airTableResponse = await fetch(
      "https://api.airtable.com/v0/app4SqAM1M6tcbMy4/redirector",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                linkSuffix,
                linkRedirect,
                linkTitle,
                linkName,
                linkDesc,
                linkImageUrl
              },
            },
          ],
        }),
      }
    ).then(res => res.json())

    if (airTableResponse.error)
      res.status(400).json(generateResponse(error.type, error.message));

    res.status(200).json(generateResponse("Submitted successfully!", "Your URL is ready!", "success"));
  } catch (ex) {
    console.error(ex)
    res.status(500).json(generateResponse("Internal Server Error", "Try again later", "warning"))
  }
}
