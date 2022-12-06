//import { precacheAndRoute } from "workbox-precaching";

let data;

self.addEventListener("push", (event) => {
  if (event.data) {
    data = JSON.parse(event.data.text());
    console.log(data);
  } else {
    console.log("No data");
  }

  const options = {
    body: data.pMsg,
    tag: "Hello world",
  };
  try {
    self.registration.showNotification(data.pTitle, options);
    console.log("done");
  } catch (error) {
    console.log(error);
  }

  //   event.waitUntil(self.registration.showNotification(data.pTitle, options));
});
//precacheAndRoute(self.__WB_MANIFEST);
