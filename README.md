# The Redirector

> A blazingly fast link shortener built on CloudFlare Workers KV that also allows you to set custom metadata to the redirected link.

<details>
<summary><strong>History</strong></summary>

This project first started out as a repo for a list of internet pranks, aptly named `box-of-tricks`, and was built as a project for the MLH Hack-or-treat hackathon by Team Cheesy ([me](https://github.com/radiantly) and my friend [Jason](https://github.com/Jason13201)). We came up with 3 pranks, a fake mouse, an infinite app opener vb script, and the redirect prank (inspired from [jere-mie/routing-prank](https://github.com/jere-mie/routing-prank)). For the redirect prank, we used CockroachDB (one of the sponsor technologies) but never got it completely working.

I dearly wanted to get the redirect prank working, so I rewrote the logic with Next.js and Airtable. This just so happened to be the wrong tool for the job with multiple caveats. There were issues generating the redirect page, and it frankly wasn't fast enough.

The project was then moved to CloudFlare workers.

</details>
