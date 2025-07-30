window.addEventListener("load", () => {
  // Wait a bit to ensure the DOM loads
  setTimeout(() => {
    try {
      const name = document.querySelector("h1")?.innerText || "";
      const bioLine =
        document.querySelector(".text-body-medium.break-words")?.innerText ||
        "";
      const location =
        document.querySelector(".text-body-small.inline")?.innerText || "";
      const url = window.location.href;

      const connectionText =
        document.querySelector(" span.t-bold")?.innerText || "";
      console.log(connectionText);

      const connectionCount = parseInt(connectionText.replace(/\D/g, "")) || 0;

      fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          bio: bioLine,
          location,
          url,
          connectionCount,
       
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Profile data sent:", data))
        .catch((err) => console.error("API Error:", err));
    } catch (err) {
      console.error("Scraping error:", err);
    }
  }, 3000);
});
