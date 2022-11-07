import { axios } from "@bundled-es-modules/axios";
export default function () {
  const BASE_URL = "http://localhost:8080";
  const axiosGet = (URL, onSuccess = null, onFailed = null) => {
    const final_URL = URL.startsWith("http") ? URL : BASE_URL + URL;
    axios.get(final_URL).then((resp) => {
      if (resp.status === 200 && resp.data.rsp === "ok") {
        if (onSuccess) onSuccess(resp.data);
        else if (onFailed) onFailed(resp.data);
      }
    });
  };

  const axiosPost = (URL, Data, onSuccess = null, onFailed = null) => {
    const final_URL = URL.startsWith("http") ? URL : BASE_URL + URL;
    console.log("axiosPost", final_URL, Data);
    axios.post(final_URL, Data).then((resp) => {
      console.log("RESP", resp);
      if (resp.status === 200 && resp.data.ok == true) {
        console.log("YES!!! STATUS - 200");
        console.log(resp.data.data);
        if (onSuccess) onSuccess(resp.data);
        else if (onFailed) onFailed(resp.data);
      }
    });
  };

  return { axiosGet, axiosPost };
}
