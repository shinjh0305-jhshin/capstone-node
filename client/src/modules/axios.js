import { axios } from "@bundled-es-modules/axios";

export default function () {
  const { VITE_BASE_URL } = import.meta.env;

  const axiosGet = (
    URL,
    JWT = null,
    params = null,
    onSuccess = null,
    onFailed = null
  ) => {
    const final_URL = URL.startsWith("http") ? URL : VITE_BASE_URL + URL;
    console.log("axiosGet", final_URL, params);
    axios
      .get(
        final_URL,
        { params },
        {
          headers: {
            "X-AUTH-TOKEN": JWT,
          },
        }
      )
      .then((resp) => {
        if (resp.status === 200 || resp.data.ok === true) {
          if (onSuccess) onSuccess(resp.data);
          else if (onFailed) onFailed(resp.data);
        }
      });
  };

  const axiosPost = (
    URL,
    JWT = null,
    Data,
    onSuccess = null,
    onFailed = null
  ) => {
    const final_URL = URL.startsWith("http") ? URL : VITE_BASE_URL + URL;
    console.log("axiosPost", final_URL, Data);
    console.log(`JWT : ${JWT}`);
    axios
      .post(final_URL, JSON.stringify(Data), {
        headers: {
          "Content-Type": `application/json`,
          "X-AUTH-TOKEN": JWT,
        },
      })
      .then((resp) => {
        if (resp.status === 200 || resp.data.ok === true) {
          if (onSuccess) onSuccess(resp.data);
        } else {
          if (onFailed) onFailed(resp.data);
        }
      })
      .catch((err) => {
        onFailed(err.response.data.message); //for loginprompt
      });
  };
  return { axiosGet, axiosPost };
}
