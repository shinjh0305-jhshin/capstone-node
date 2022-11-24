<template>
  <main class="mt-3">
    <div class="container" :key="reRenderOnChange">
      <h2 class="text-center">공구 등록</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 제목</label>
        <div class="col-md-9">
          <el-input v-model="deal.name" disabled />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">모을 금액</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              v-model="deal.goal"
              @keyup="calculatePrice()"
              disabled
              readonly
            />
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">모일 인원</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input
              id="numPeople"
              type="text"
              class="form-control"
              v-model="deal.people"
              @keyup="calculatePrice()"
              disabled
              readonly
            />
            <span class="input-group-text">명</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">1인당 공구가격</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="deal.price" disabled readonly />
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">구매 사이트</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <el-input
              v-model="deal.url"
              placeholder="물품을 구매한 사이트를 적어주세요"
              disabled
              readonly
            />
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 단위</label>
        <div class="col-auto">
          <div class="input-group mb-3">
            <span class="input-group-text">1인당</span>
            <input type="text" class="form-control" v-model="deal.portion" disabled readonly />
            <select class="form-select" v-model="deal.unit" disabled>
              <option v-for="(name, i) in units" :key="i" v-text="name" :value="name"></option>
            </select>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">카테고리</label>
        <div class="col-auto">
          <select class="form-select" v-model="deal.category" disabled>
            <option v-for="(name, i) in categories" :key="i" v-text="name" :value="i"></option>
          </select>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">태그</label>
        <div class="col-md-9">
          <el-tag
            v-for="tag in deal.tags"
            :key="tag"
            :type="'success'"
            class="mr-1"
            closable
            :disable-transitions="false"
            size="large"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="col-auto"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag mr-1" @click="showInput"> + New Tag </el-button>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 마감일</label>
        <div class="col-md-9">
          <el-date-picker v-model="deal.ends" type="date" placeholder="Pick a day" disabled />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">썸네일 이미지</label>
        <div class="col-md-9">
          <el-upload
            v-model:file-list="uploadedFile"
            class="upload-demo"
            drag
            action="http://ec2-54-180-101-210.ap-northeast-2.compute.amazonaws.com:8081/images/upload"
            multiple
            name="image_upload"
            list-type="picture"
            :before-upload="beforeImageUpload"
            :limit="5"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip">
                이미지 파일 당 최대 크기 : 5MB | 최대 5개 파일 업로드 가능<br />
                가장 첫 이미지가 대표 이미지가 됩니다.
              </div>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">상품 설명</label>
        <div class="col-md-9">
          <div class="mb-3">
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="deal.content"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col-6 d-grid p-1">
          <router-link to="/raised">
            <button type="button" class="col-12 btn btn-block btn-lg btn-dark">취소하기</button>
          </router-link>
        </div>
        <div class="col-6 d-grid p-1">
          <button type="button" @click="submitDeal" class="btn btn-lg btn-danger">저장하기</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, nextTick, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UploadFilled } from "@element-plus/icons-vue";
import * as _ from "lodash";
import useAxios from "@/modules/axios";
import { categories, units } from "@/modules/selectData";
const { axiosPost, axiosGet } = useAxios();
const router = useRouter();
const route = useRoute();

const productId = route.query.deal_id;
let newDeal = {};

const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref({});
const uploadedFile = ref([]);
let deal = reactive(newDeal);

let reRenderOnChange = ref(0);

//tag 수정 부분
const handleClose = (tag) => {
  deal.tags.splice(deal.tags.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    deal.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
//tag 수정 부분

const calculatePrice = () => {
  deal.price = Math.floor(deal.goal / deal.people);
};

function beforeImageUpload(img) {
  const regex = /^image\/*/;
  if (!regex.test(img.type)) {
    ElMessage({
      message: "이미지 파일만 업로드 할 수 있습니다.",
      grouping: true,
      type: "error",
    });
    return false;
  } else if (img.size / 1024 / 1024 > 5) {
    ElMessage({
      message: "이미지 사이즈가 너무 큽니다.",
      grouping: true,
      type: "error",
    });
    return false;
  }
  return true;
}

function onSuccess(resp) {
  console.log(resp);
  router.push({ name: "Detail", query: { product_id: productId } });
}

async function submitDeal() {
  console.log(newDeal);
  const dealServer = `http://localhost:8080/product/update/${newDeal.id}`;
  newDeal.fileList = []; //fileList 포맷 변경

  for (var i = 0; i < uploadedFile.value.length; i++) {
    console.log(uploadedFile.value[i].url);
    if (uploadedFile.value[i].response) {
      //새로 업로드 되는 이미지일 경우
      newDeal.fileList.push(uploadedFile.value[i].response.fileName);
    } else {
      //이미 업로드 된 이미지로, url이 존재 할 경우
      newDeal.fileList.push(uploadedFile.value[i].name);
    }
  }

  const modifiedData = _.pick(newDeal, ["tags", "fileList", "content"]);
  modifiedData.tags = JSON.stringify(modifiedData.tags);

  await axiosPost(dealServer, modifiedData, onSuccess);
}

function saveDetail(resp) {
  newDeal.id = resp[0].id;
  newDeal.name = resp[0].name;
  newDeal.goal = resp[0].goal;
  newDeal.people = resp[0].people;
  newDeal.price = resp[0].price;
  newDeal.url = resp[0].url;
  newDeal.portion = resp[0].portion;
  newDeal.unit = resp[0].unit;
  newDeal.category = resp[0].category;
  newDeal.tags = JSON.parse(resp[0].tags);
  newDeal.ends = resp[0].ends;
  newDeal.content = resp[0].content;

  resp[0].fileList.forEach((x) => {
    const temp = {};
    temp.name = x;
    temp.url = `https://gongu-image.s3.ap-northeast-2.amazonaws.com/${x}`;
    uploadedFile.value.push(temp);
  });

  console.log(resp[0]);
  console.log(newDeal);
  reRenderOnChange.value++;
}

onMounted(async () => {
  await axiosGet(`/product/${productId}`, saveDetail);
});
</script>

<style scoped>
el-date-picker {
  width: 50vw;
}
</style>
