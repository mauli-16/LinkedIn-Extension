document.getElementById("btn").addEventListener("click", () => {
  const url1 = "https://www.linkedin.com/in/anu-sharma-2002/";
  const url2 = "https://www.linkedin.com/in/mauli-saxena16/";
  const url3 = "https://www.linkedin.com/in/kriti-jaiswal1-/";

  const urls = [url1, url2, url3].filter(Boolean);

  chrome.runtime.sendMessage({ action: "openProfiles", urls });
});
document.getElementById("startbtn").addEventListener("click", () => {
  const url = "https://www.linkedin.com/feed/";

  const likeVal = document.getElementById("lval").value;
  const commentVal = document.getElementById("cval").value;

  chrome.storage.local.set({
    likeCount: likeVal,
    commentCount: commentVal,
  });

  chrome.runtime.sendMessage({ action: "openFeed", url });
});
