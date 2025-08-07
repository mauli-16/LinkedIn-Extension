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

    if (likeCount === 0 && commentCount === 0) return;

    let liked = 0;
    let commented = 0;
    const postsNeeded = Math.max(likeCount, commentCount);

    let posts = [];
    let scrollAttempts = 0;
    
    while (true) {
      posts = document.querySelectorAll("div[data-urn]");
      if (posts.length >= postsNeeded) break;

      window.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, 2000));
      scrollAttempts++;

      if (scrollAttempts > 15) break;
    }

    const maxPosts = Math.min(posts.length, postsNeeded);
    
    for (let i = 0; i < maxPosts && (liked < likeCount || commented < commentCount); i++) {
      const post = posts[i];

      try {
        if (liked < likeCount) {
          let likeBtn = post.querySelector('button[aria-label*="Like"]') ||
                       post.querySelector('button[aria-label*="like"]');

          if (!likeBtn) {
            const buttons = post.querySelectorAll("button");
            for (const btn of buttons) {
              if (btn.textContent.toLowerCase().includes("like") && 
                  !btn.textContent.toLowerCase().includes("unlike")) {
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

        if (commented < commentCount) {
          const commentBtn = post.querySelector('button[aria-label*="Comment"]') ||
                            post.querySelector('button[aria-label*="comment"]');

          if (commentBtn) {
            commentBtn.click();
            await new Promise((r) => setTimeout(r, 2500));

            const commentBox = document.querySelector('div[role="textbox"]') ||
                              document.querySelector('div[contenteditable="true"]');

            if (commentBox) {
              commentBox.focus();
              commentBox.textContent = "CFBR";
              commentBox.dispatchEvent(new Event("input", { bubbles: true }));
              await new Promise((r) => setTimeout(r, 1500));

              let submitBtn = null;
              const commentSection = commentBox.closest('[role="dialog"]') ||
                                   commentBox.closest(".comments-comment-box") ||
                                   commentBox.parentElement;

              if (commentSection) {
                submitBtn = commentSection.querySelector('button[aria-label*="Post"]');

                if (!submitBtn) {
                  const commentSpan = Array.from(commentSection.querySelectorAll("span.artdeco-button__text"))
                    .find(span => span.textContent.trim().toLowerCase() === "comment");
                  
                  if (commentSpan) {
                    submitBtn = commentSpan.closest("button");
                  }
                }
              }

              if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
                commented++;
                await new Promise((r) => setTimeout(r, 2500))
                const closeBtn = document.querySelector('button[aria-label*="Close"]') ||
                               document.querySelector('button[aria-label*="close"]') ||
                               document.querySelector('.artdeco-modal__dismiss');
                               
                if (closeBtn) {
                  closeBtn.click();
                  await new Promise((r) => setTimeout(r, 500));
                }
                
                // Click outside to close any remaining modals
                document.body.click();
                await new Promise((r) => setTimeout(r, 500));
              
                
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }

      await new Promise((r) => setTimeout(r, 1000));
    }
  });
});