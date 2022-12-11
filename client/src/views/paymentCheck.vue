<template></template>
<script setup>
import useAxios from "@/modules/axios";
import { useRouter, useRoute } from "vue-router";
import { useUserInfoStore } from "/@stores/userInfo";

const userStore = useUserInfoStore();
const { axiosGet, axiosPost } = useAxios();
const router = useRouter();
const route = useRoute();

function onPayCreate(resp) {
  router.push("/payment");
}
function onPayCreateFail(resp) {
  console.log("Pay create error", resp);
}

function onSuccess(resp) {
  if (route.query.to !== undefined && route.query.amount !== undefined) {
    router.push({ name: "paymentMain", query: { to: route.query.to, amount: route.query.amount } });
  } else {
    router.push("/payment");
  }
}

function onFail(resp) {
  console.log(resp);
  if (confirm("지갑 정보가 없습니다. 새로 생성하시겠습니까?")) {
    axiosPost("http://gonggu-alb-test-333249785.ap-northeast-2.elb.amazonaws.com/payment", userStore.JWT, null, onPayCreate, onPayCreateFail);
  } else {
    router.push("/");
  }
}

function checkPayment() {
  console.log(userStore.JWT);
  axiosGet("http://gonggu-alb-test-333249785.ap-northeast-2.elb.amazonaws.com/payment", userStore.JWT, null, onSuccess, onFail);
}

checkPayment();
</script>
