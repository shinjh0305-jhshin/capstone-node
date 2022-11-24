<template>
  <main class="mt-3">
    <div class="container">
      <div class="row mb-2">
        <div class="col-12">
          <select class="form-select">
            <option v-for="(name, i) in categories" :key="i" v-text="name" :value="i"></option>
          </select>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-xl-3 col-lg-4 col-md-6" :key="i" v-for="(deal, i) in dealList">
          <div class="card" style="width: 18rem">
            <img :src="getImageUrl(deal.path)" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">{{ deal.name }}</h5>
              <p class="card-text">
                <span class="badge bg-dark me-1">{{ categories[deal.category] }}</span>
                <span class="badge bg-red me-1">{{ deal.ordered }}/{{ deal.people }}명</span>
                <span class="badge bg-blue me-1">{{ leftDays(deal.ends) }}일뒤 마감</span>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group" role="group" aria-label="Basic example">
                  <router-link :to="{ name: 'Detail', query: { product_id: deal.id } }">
                    <button type="button" class="btn btn-sm btn-outline-secondary">
                      공구 참여
                    </button>
                  </router-link>
                </div>
                <small class="text-dark">1인당 {{ deal.price }}원</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import useAxios from "@/modules/axios";
import { onBeforeMount, ref } from "vue";
import { categories, units } from "@/modules/selectData";
import * as moment from "moment";

const { axiosGet, axiosPost } = useAxios();

const dealList = ref([]);
const categorySelected = ref(-1);

const saveResult = function (respData) {
  dealList.value = respData;
  console.log("Get success");
};

onBeforeMount(async () => {
  await axiosGet("/product/list", saveResult);
  console.log(dealList);
});

const getImageUrl = (name) => {
  return `https://gongu-image.s3.ap-northeast-2.amazonaws.com/${name}`;
};

function leftDays(ends) {
  const endDate = moment(ends);
  const now = moment();
  return endDate.diff(now, "days");
}
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
