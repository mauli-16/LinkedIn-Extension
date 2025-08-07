chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openProfiles") {
    const urls = message.urls;
    let delay = 0;
    console.log(urls);
    

    urls.forEach((url, index) => {
      setTimeout(() => {
        console.log(url);
        
        chrome.tabs.create({ url: url });
      }, delay);
      delay += 5000; 
    });
  }
   else if (message.action === "openFeed") {
    const url = message.url;
    console.log("Opening feed:", url);

    chrome.tabs.create({ url: url });
  }


})
