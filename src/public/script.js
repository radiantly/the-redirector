$(".ui.form").form({
  fields: {
    linkRedirect: ["empty", "url", "maxLength[512]"],
    linkSuffix: ["empty", "maxLength[256]"],
    linkTitle: ["maxLength[64]"],
    linkName: ["maxLength[64]"],
    linkDesc: ["maxLength[512]"],
    linkImageUrl: ["maxLength[512]"],
  },
  on: "blur",
  inline: true,
});

const linkForm = document.getElementById("linkForm");
const linkSuffix = document.getElementById("linkSuffix");
const linkSuffixWrapper = document.getElementById("linkSuffixWrapper");
const linkSuffixIcon = document.getElementById("linkSuffixIcon");

const errorMsgElem = document.getElementById("errorMsg");

let testLinkSuffixTimeout;

const testLinkSuffix = async query => {
  const response = await fetch(`/exists/${query}`).then(res => res.json());
  if (linkSuffix.value !== query) return;
  linkSuffixWrapper.classList.remove("loading");
  console.log(response);
  linkSuffixIcon.classList.remove("times", "red", "check", "green", "grey");
  if (response.success && response.exists === false) {
    linkSuffixIcon.classList.add("check", "green");
  } else {
    linkSuffixIcon.classList.add("times", "red");
    $(linkForm).form("add prompt", "linkSuffix", `Choose another link, ${query} has been taken`);
  }
};

linkSuffix.addEventListener("input", e => {
  e.target.value = e.target.value.replace(/[^a-z0-9_.~-]/gi, "-");
  if (!linkSuffix.value) {
    linkSuffixIcon.classList.remove("check", "times");
    linkSuffixWrapper.classList.remove("loading");
    return;
  }
  linkSuffixIcon.classList.add("times", "grey");
  linkSuffixWrapper.classList.add("loading");
  clearTimeout(testLinkSuffixTimeout);
  testLinkSuffixTimeout = setTimeout(testLinkSuffix, 750, linkSuffix.value);
});

linkForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!$(linkForm).form("is valid")) return false;
  linkForm.classList.remove("success", "error");
  linkForm.classList.add("loading");
  const formData = {};
  linkForm.querySelectorAll("input").forEach(elem => {
    formData[elem.id] = elem.value;
  });
  console.log(formData);
  const response = await fetch("/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(res => res.json());
  console.log(response);
  linkForm.classList.remove("loading", "success", "error");
  if (response.success !== true) {
    errorMsgElem.innerText = response.error || "An error occurred";
    linkForm.classList.add("error");
    return;
  }

  linkForm.classList.add("success");
  linkSuffix.readOnly = true;
  return false;
});

const copyLinkBtn = document.getElementById("copyLinkBtn");
copyLinkBtn.addEventListener("click", async e => {
  await navigator.clipboard.writeText(`${location.origin}/${linkSuffix.value}`);
  $("body").toast({
    title: "Success",
    message: "Link copied to clipboard",
    showProgress: "bottom",
  });
});

const resetFormBtn = document.getElementById("resetFormBtn");
resetFormBtn.addEventListener("click", async e => {
  linkForm.classList.remove("success", "error");
  linkSuffix.readOnly = false;
  $(".ui.form").form("reset");
});

console.info("A project by @radiantly");
