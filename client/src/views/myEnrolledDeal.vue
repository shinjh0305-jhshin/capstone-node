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
        <td style="width: 100px"><img :src="getImageUrl(product)" style="height: 50px; width: auto" /></td>
        <td>
          <router-link :to="{ name: 'Detail', query: { id: product.id } }">
            {{ product.title }}
          </router-link>
        </td>
        <!-- <td>{{ new Intl.NumberFormat("ko").format(product.price * product.quantity) }}원</td> -->
        <td>{{ new Intl.NumberFormat("ko").format(0) }}원</td>
        <!-- <td>{{ product.portion * product.quantity }}{{ product.unit }}</td> -->
        <td>0개</td>
        <!-- <td>{{ formatTime(product.ends) }}</td> -->
        <td>9999-99-99</td>
        <td style="width: 300px" v-if="!product.deleted">
          <el-button type="success" plain @click="confirmClose(product.id)" v-if="!product.deleted">송금하기</el-button>
          <el-button type="danger" plain @click="confirmDelete(product.id)" v-if="!product.expired">공구취소</el-button>
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
  let fileName;
  if (name.deleted) {
    fileName = "deleted.jpg";
  } else {
    fileName = name.image.fileName;
  }
  return `https://gongu-image.s3.ap-northeast-2.amazonaws.com/${fileName}`;
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
