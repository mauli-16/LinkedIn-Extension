// window.addEventListener("load", () => {

//   setTimeout(() => {
//     try {
//       const name = document.querySelector("h1")?.innerText || "";
//       const bioLine =
//         document.querySelector(".text-body-medium.break-words")?.innerText ||
//         "";
//       const location =
//         document.querySelector(".text-body-small.inline")?.innerText || "";
//       const url = window.location.href;

//       const connectionText =
//         document.querySelector(" span.t-bold")?.innerText || "";
//       console.log(connectionText);

//       const connectionCount = parseInt(connectionText.replace(/\D/g, "")) || 0;

//       fetch("http://localhost:5000/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           bio: bioLine,
//           location,
//           url,
//           connectionCount,

//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => console.log("Profile data sent:", data))
//         .catch((err) => console.error("API Error:", err));
//     } catch (err) {
//       console.error("Scraping error:", err);
//     }
//   }, 3000);
// });

window.addEventListener("load", () => {
  chrome.storage.local.get(["likeCount", "commentCount"], async (result) => {
    const likeCount = parseInt(result.likeCount || "0");
    const commentCount = parseInt(result.commentCount || "0");

    if (likeCount === 0 && commentCount === 0) {
      console.log("No actions requested. Exiting.");
      return;
    }

    let liked = 0;
    let commented = 0;

    
    for (let i = 0; i < 1; i++) {
      window.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, 2000));
    }
    await new Promise((r) => setTimeout(r, 2000));

    const posts =
      document.querySelectorAll("div[data-urn]") ||
      document.querySelectorAll("div.feed-shared-update-v2");

    if (posts.length === 0) {
      console.log("No posts found!");
      return;
    }

    console.log(`Found ${posts.length} posts`);

    for (
      let i = 0;
      i < posts.length && (liked < likeCount || commented < commentCount);
      i++
    ) {
      const post = posts[i];
      console.log(`Processing post ${i + 1}...`);

      try {
        // LIKE LOGIC
        if (liked < likeCount) {
          let likeBtn =
            post.querySelector('button[aria-label*="Like"]') ||
            post.querySelector('button[aria-label*="like"]');

          if (!likeBtn) {
            const buttons = post.querySelectorAll("button");
            for (const btn of buttons) {
              if (
                btn.textContent.toLowerCase().includes("like") &&
                !btn.textContent.toLowerCase().includes("unlike")
              ) {
                likeBtn = btn;
                break;
              }
            }
          }

          if (likeBtn && !likeBtn.classList.contains("react-button--active")) {
            likeBtn.click();
            liked++;
            await new Promise((r) => setTimeout(r, 1000));
          }
        }

        // COMMENT LOGIC
        if (commented < commentCount) {
          const commentBtn =
            post.querySelector('button[aria-label*="Comment"]') ||
            post.querySelector('button[aria-label*="comment"]');

          if (commentBtn) {
            commentBtn.click();
            console.log(`Opened comment box for post ${i + 1}`);
            await new Promise((r) => setTimeout(r, 2500));

            const commentBox =
              document.querySelector('div[role="textbox"]') ||
              document.querySelector('div[contenteditable="true"]');

            if (commentBox) {
              commentBox.focus();
              commentBox.textContent = "CFBR";
              commentBox.dispatchEvent(new Event("input", { bubbles: true }));
              await new Promise((r) => setTimeout(r, 1500));

            
              let submitBtn = null;



            
              const commentSection =
                commentBox.closest('[role="dialog"]') ||
                commentBox.closest(".comments-comment-box") ||
                commentBox.parentElement;
             

              if (commentSection) {

                
                submitBtn = commentSection.querySelector(
                  'button[aria-label*="Post"]'
                );

                if (submitBtn) {
                  console.log("Found submit button via aria-label 'Post'");
                } else {
                
                  const commentSpan = Array.from(
                    commentSection.querySelectorAll("span.artdeco-button__text")
                  ).find(
                    (span) =>
                      span.textContent.trim().toLowerCase() === "comment"
                  );

                  if (commentSpan) {
                    submitBtn = commentSpan.closest("button");

                   
                  } else {
                    console.log(" No span with text 'Comment' found");
                  }
                }
              } else {
                console.log("Comment section not found");
              }

              if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
                commented++;
                console.log(` Commented on post ${i + 1}`);
                await new Promise((r) => setTimeout(r, 2500));
              } else {
                console.log("Submit button not found or is disabled");
              }
            } else {
              console.log("Comment box not found for post");
            }
          }
        }
      } catch (error) {
        console.error("Error on post:", error);
      }

      await new Promise((r) => setTimeout(r, 1000)); 
    }
  });
});
