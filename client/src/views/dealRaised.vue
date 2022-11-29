<template>
  <main class="mt-3 text-center">
    <div class="container">
      <h2 class="text-center mt-4 mb-1">
        {{ title === true ? "내가 개시한 공구" : "내가 참여한 공구" }}<br />
        <el-switch v-model="title" class="mb-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="내가 개시한 공구" inactive-text="내가 참여한 공구" />
      </h2>
      <div class="float-end mb-1">
        <router-link to="/create">
          <button type="button" class="btn btn-dark mb-2">공구 개시</button>
        </router-link>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>공구명</th>
            <th>공구가격</th>
            <th>모집현황</th>
            <th>마감일자</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, i) in productList" :key="i">
            <td><img :src="getImageUrl(product.path)" style="height: 50px; width: auto" /></td>
            <td>
              <router-link :to="{ name: 'Detail', query: { product_id: product.id } }">
                {{ product.name }}
              </router-link>
            </td>
            <td>{{ formatCurrency(product.price) }}원</td>
            <td>{{ product.ordered }} / {{ product.people }}</td>
            <td>{{ formatTime(product.ends) }}</td>
            <td>
              <router-link :to="{ name: 'Update', query: { deal_id: product.id } }" v-if="!product.deleted" class="me-3" style="text-decoration: none; color: inherit">
                <el-button type="warning" plain>수정하기</el-button>
                <!-- <button type="button" class="btn btn-warning me-1">수정</button> -->
              </router-link>
              <el-button type="danger" plain @click="confirmDelete(product.id)" v-if="!product.deleted">삭제하기</el-button>
              <!-- <button type="button" class="btn btn-danger" @click="confirmDelete(product.id)" v-if="!product.deleted">삭제</button> -->
              <el-button type="success" plain @click="confirmClose(product.id)" v-if="product.ordered === product.people">마감하기</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import useAxios from "@/modules/axios";
import currencyFormat from "@/modules/currencyFormatter.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
//import { ElMessage, ElMessageBox } from "element-plus";

const { axiosGet, axiosPost } = useAxios();
const router = useRouter();

const productList = ref([]);
const title = ref(false); //false : 내가 참여한 공구 / true : 내가 개시한 공구
const tempBool = false;

const saveResult = function (respData) {
  productList.value = respData;
};

function getProductList() {
  axiosGet("/product/list", saveResult);
}

const getImageUrl = (name) => {
  return `https://gongu-image.s3.ap-northeast-2.amazonaws.com/${name}`;
};

//금액을 #,### 형태로 포맷팅한다.
function formatCurrency(value) {
  return currencyFormat(value);
}

function formatTime(value) {
  var temp = value.split("T");
  return temp[0];
}

function onSuccess(resp) {
  console.log("yay!");
  console.log(resp);
  router.push("/");
}

//공구 삭제에 대한 사용자 프롬프트
const confirmDelete = async (productId) => {
  const doDelete = await ElMessageBox.confirm("공구를 삭제할까요?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  });

  if (doDelete) {
    try {
      await axiosPost(`/product/delete/${productId}`, {}, onSuccess);
    } catch (error) {
      console.error(error);
    }
  } else {
    ElMessage({
      type: "info",
      message: "Delete canceled",
    });
  }
};

//공구 마감에 대한 사용자 프롬프트
const confirmClose = async (productId) => {
  const doClose = await ElMessageBox.confirm("공구를 마감할까요?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  });

  if (doClose) {
    try {
      await axiosPost(`/product/delete/${productId}`, {}, onSuccess);
    } catch (error) {
      console.error(error);
    }
  } else {
    ElMessage({
      type: "info",
      message: "Delete canceled",
    });
  }
};

getProductList(); //script setup에서는 created를 안 써도 된다.
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap");
.text-center {
  font-family: "Noto Sans KR", sans-serif;
}
.card-img-top {
  height: 15rem;
  object-fit: contain;
  padding: 0.5rem;
}
.card {
  margin-bottom: 20px;
}
td {
  vertical-align: middle !important;
  width: 30px;
}
</style>
