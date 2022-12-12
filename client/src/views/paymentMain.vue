<template>
  <div class="container col-xl-10 col-xxl-8 px-4 py-0 py-md-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-4 fw-bold lh-1 mb-3">우리동네 공구페이</h1>
        <div class="h-100 p-5 mt-5 text-bg-dark rounded-3">
          <h2><img src="../assets/savings_FILL0_wght400_GRAD0_opsz48.svg" alt="" /> 현재 잔액</h2>
          <h1>{{ new Intl.NumberFormat("ko").format(balance) }}원</h1>
        </div>
        <div class="row my-3 g-2">
          <div class="col-12 col-md-6">
            <button class="w-100 btn btn-lg btn-secondary" type="submit">충전하기</button>
          </div>
          <div class="col-12 col-md-6">
            <button class="w-100 btn btn-lg btn-secondary" type="submit">환전하기</button>
          </div>
        </div>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form class="p-4 px-md-5 pt-md-0 border rounded-3 bg-light" @submit.prevent="doTransaction">
          <h3 class="pb-3 pt-md-4 pb-md-3" style="font-weight: bold">송금하기</h3>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingReceiver" placeholder="송금받는 자" v-model="receiver" />
            <label for="floatingReceiver">송금받는 자</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingAmount" placeholder="금액" @input="checkPrice" v-model="amount" />
            <label for="floatingAmount">금액</label>
          </div>
          <button class="w-100 btn btn-lg btn-dark" type="submit" v-if="amount > balance" disabled>잔액이 부족합니다</button>
          <button class="w-100 btn btn-lg btn-dark" type="submit" v-else>송금하기</button>
          <hr class="my-4" />
          <small class="text-muted">우리동네 공구마켓은 회원간의 송금에 책임을 지지 않으며, 실물 거래 현장에서 송금할 것을 강력히 권장합니다.</small>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import useAxios from "@/modules/axios";
import { useRouter, useRoute } from "vue-router";
import { useUserInfoStore } from "/@stores/userInfo";

const userStore = useUserInfoStore();
const { axiosGet, axiosPost } = useAxios();
const router = useRouter();
const route = useRoute();

const balance = ref(0);
const receiver = ref("");
const amount = ref("");

function onSuccess(resp) {
  balance.value = resp.balance;
}
function onFail(resp) {
  console.log(resp);
}

function onTransactionSuccess(resp) {
  router.go(0);
}

function onTransactionFail(resp) {
  console.log("transactionFail", resp);
}

function getBalance() {
  axiosGet("https://09market.site/payment", userStore.JWT, null, onSuccess, onFail);
}

function checkPrice(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
}

function doTransaction() {
  if (receiver.value === "" || amount.value === "" || amount.value <= 0) {
    alert("유효하지 않은 송금 정보입니다. 입력값을 다시 확인해주세요");
  } else if (confirm(`송금받는 자 : ${receiver.value}\n금액 : ${new Intl.NumberFormat("ko").format(amount.value)}원\n\n 위 정보가 맞으면 확인 버튼을 누르세요`)) {
    const payload = {
      to: receiver.value,
      amount: amount.value,
    };
    axiosPost("https://09market.site/payment/remit", userStore.JWT, payload, onTransactionSuccess, onTransactionFail);
  }
}

//onCreate
getBalance();
receiver.value = route.query.to === undefined ? "" : route.query.to;
amount.value = route.query.amount === undefined ? "" : route.query.amount;
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap");
* {
  font-family: "Noto Sans KR", sans-serif;
}
</style>
