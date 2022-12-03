import urlBase64ToUint8Array from "./vapidParser.js";
import useAxios from "@/modules/axios";
const { axiosGet, axiosPost } = useAxios();

//push server subscription 진행
function newSubscription(userNick) {
  navigator.serviceWorker.ready.then((swreg) => {
    const vapid_public = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC);
    //console.log(vapid_public);
    return swreg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapid_public,
      })
      .then((newsub) => {
        const filteredSub = JSON.parse(JSON.stringify(newsub));

        console.log(filteredSub);
        axiosPost(`/product/device/${userNick}`, filteredSub, onSuccess, onFail);
      });
  });
}

//Subscribe : 브라우저의 푸시 서버에 푸시 알림 구독 정보 저장
//subscribe 되었는지 확인하는 함수
export function checkIfSubscribed(userNick) {
  navigator.serviceWorker.ready
    .then((swreg) => {
      console.log("😍 Service Worker ready");
      return swreg.pushManager.getSubscription();
    })
    .then((sub) => {
      if (sub == null) {
        console.log("🤔 Not subscribed yet");
        console.log(import.meta.env);
        newSubscription(userNick);
      } else {
        console.log("🤔 Subscription exists");
      }
    });
}

function onSuccess(resp) {
  console.log("😆 Subscription Success!");
}
function onFail(resp) {
  console.log("Subscription failed");
  console.log(resp);
}
