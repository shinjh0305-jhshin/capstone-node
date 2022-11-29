<template>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th></th>
        <th>공구명</th>
        <th>구매가격</th>
        <th>구매수량</th>
        <th>마감일자</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, i) in productList" :key="i">
        <td style="width: 100px"><img :src="getImageUrl(product.path)" style="height: 50px; width: auto" /></td>
        <td>
          <router-link :to="{ name: 'Detail', query: { product_id: product.id } }">
            {{ product.name }}
          </router-link>
        </td>
        <td>{{ new Intl.NumberFormat("ko").format(product.price * product.quantity) }}원</td>
        <td>{{ product.portion * product.quantity }}{{ product.unit }}</td>
        <td>{{ formatTime(product.ends) }}</td>
        <td style="width: 300px">
          <el-button type="success" plain @click="confirmClose(product.id)" v-if="!product.deleted">송금하기</el-button>
          <el-button type="danger" plain @click="confirmDelete(product.id)" v-if="!product.deleted">공구취소</el-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
const props = defineProps({
  productList: Array,
});
const getImageUrl = (name) => {
  return `https://gongu-image.s3.ap-northeast-2.amazonaws.com/${name}`;
};
function formatTime(value) {
  var temp = value.split("T");
  return temp[0];
}
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
}
</style>
