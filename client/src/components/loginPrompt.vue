<template>
  <div id="outer" class="container">
    <div class="row justify-content-center">
      <div class="col-md-12 col-lg-10">
        <div class="wrap d-md-flex">
          <div class="img" style="background-image: url('https://gongu-image.s3.ap-northeast-2.amazonaws.com/soganguniv.jpg')"></div>
          <div class="login-wrap p-4 p-md-5">
            <div class="d-flex">
              <div class="w-100">
                <h3 class="mb-4">Sign In</h3>
              </div>
            </div>
            <form>
              <div class="mb-3">
                <label class="label" for="name">ID</label>
                <input type="text" class="form-control" placeholder="ID" v-model="userInfo.userID" required />
              </div>
              <div class="mb-3">
                <label class="label" for="password">Password</label>
                <input type="password" class="form-control" placeholder="Password" v-model="userInfo.userPWD" required />
              </div>
              <div>
                <button type="submit" class="form-control btn btn-primary rounded submit px-3" @click="loginSubmit">Sign In</button>
              </div>
            </form>
            <div class="form-group d-md-flex">
              <div class="w-50 text-left" />
              <div class="w-50 text-md-right">
                <a href="#">Forgot Password</a>
              </div>
            </div>
            <p class="text-center">Not a member? <span @click="goToJoin">Sign Up</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useAxios from "../modules/axios";
import { useUserInfoStore } from "/@stores/userInfo";
import { reactive } from "vue";
import router from "../routers";

const { axiosGet, axiosPost } = useAxios();

const userInfo = reactive({
  userID: "",
  userPWD: "",
});

const goToJoin = () => {
  router.push("join");
};

const onLoginSuccess = (respData) => {
  const userStore = useUserInfoStore();
  userStore.setInfo(respData.data.userID, respData.data.userNick, true);
  console.log("✅ userStore", userStore.getInfo);
  if (userStore.loggedIn) {
    router.push("/");
  }
};

const onLoginFail = (respData = null) => {
  console.log(`❌ ${respData}`);
  if (respData === "user does not exist") {
    alert("아이디를 다시 확인하세요");
  } else {
    alert("패스워드를 다시 확인하세요");
  }
};

const loginSubmit = () => {
  axiosPost("/users/login", userInfo, onLoginSuccess, onLoginFail);
};
</script>

<style scoped>
@import "../assets/login.css";
#outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

span {
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
  color: #e3b04b;
  cursor: pointer;
}

span:hover,
span:focus {
  color: navy !important;
  outline: none !important;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
