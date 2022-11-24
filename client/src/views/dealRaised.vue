<template>
  <main class="mt-3 text-center">
    <div class="container">
      <div class="float-end mb-1">
        <router-link to="/create">
          <button type="button" class="btn btn-dark">제품 등록</button>
        </router-link>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>제품명</th>
            <th>제품가격</th>
            <th>모집현황</th>
            <th>마감일자</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, i) in productList" :key="i">
            <td><img :src="getImageUrl(product.path)" style="height: 50px; width: auto" /></td>
            <router-link :to="{ name: 'Detail', query: { product_id: product.id } }">
              <td>{{ product.name }}</td>
            </router-link>
            <td>{{ formatCurrency(product.price) }}원</td>
            <td>{{ product.ordered }} / {{ product.people }}</td>
            <td>{{ formatTime(product.ends) }}</td>
            <td>
              <router-link
                :to="{ name: 'Update', query: { deal_id: product.id } }"
                v-if="!product.deleted"
              >
                <button type="button" class="btn btn-warning me-1">수정</button>
              </router-link>
              <button
                type="button"
                class="btn btn-danger"
                @click="confirmDelete(product.id)"
                v-if="!product.deleted"
              >
                삭제
              </button>
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

const confirmDelete = async (productId) => {
  const doDelete = await ElMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  );

  if (doDelete) {
    try {
      await axiosPost(`/product/delete/${productId}`, {}, onSuccess);
    } catch (error) {
      console.error(error);
    }
    // ElMessage({
    //   type: "success",
    //   message: "Delete completed",
    // });
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
.card-img-top {
  height: 15rem;
  object-fit: contain;
  padding: 0.5rem;
}
.card {
  margin-bottom: 20px;
}
</style>
