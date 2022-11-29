<template>
  <main class="mt-3">
    <div class="container">
      <h2 class="text-center my-4">공구 등록</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 제목<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <input type="text" class="form-control form-control-sm" v-model="deal.name" placeholder="공구 제목을 입력해 주세요" />
          <small id="nameError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">모을 금액<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" @input="checkGoal" @keyup="calculatePrice" />
            <span class="input-group-text">원</span>
          </div>
          <small id="goalError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">모일 인원<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <div class="input-group input-group-sm">
            <input id="numPeople" type="text" class="form-control" @input="checkPeople" v-model="deal.people" @keyup="calculatePrice" />
            <span class="input-group-text">명</span>
          </div>
          <small id="peopleError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">1인당 공구가격</label>
        <div class="col-md-9">
          <div class="input-group input-group-sm mb-3">
            <input type="text" class="form-control" v-model="deal.price" disabled readonly />
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">구매 사이트<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <input type="text" class="form-control form-control-sm" v-model="deal.url" placeholder="구매 예정인 사이트 링크를 입력해주세요" />
          <small id="urlError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 단위<sup class="requiredInput">*</sup></label>
        <div class="col-auto">
          <div class="input-group input-group-sm">
            <span class="input-group-text">1인당</span>
            <input type="text" class="form-control" v-model="deal.portion" />
            <select class="form-select from-select-sm" v-model="deal.unit">
              <option v-for="(name, i) in units" :key="i" v-text="name" :value="name"></option>
            </select>
          </div>
          <small id="portionError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">카테고리<sup class="requiredInput">*</sup></label>
        <div class="col-auto">
          <select class="form-select form-select-sm" v-model="deal.category">
            <option v-for="(name, i) in categories" :key="i" v-text="name" :value="i"></option>
          </select>
          <small id="categoryError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">태그</label>
        <div class="col-md-9">
          <el-tag v-for="tag in deal.tags" :key="tag" :type="'success'" class="mr-1" closable :disable-transitions="false" size="large" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="col-auto" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-tag mr-1" @click="showInput"> + New Tag </el-button>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">공구 마감일<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <el-date-picker v-model="deal.ends" type="date" placeholder="Pick a day" :disabled-date="disabledDate" />
          <small id="endsError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">썸네일 이미지<sup class="requiredInput">*</sup></label>
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
          <small id="fileListError"></small>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">상품 설명<sup class="requiredInput">*</sup></label>
        <div class="col-md-9">
          <div class="mb-3">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="deal.content"></textarea>
            <small id="contentError"></small>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col-6 d-grid p-1">
          <router-link to="/sales">
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
import { useRouter } from "vue-router";
import { UploadFilled } from "@element-plus/icons-vue";
import * as moment from "moment";
import useAxios from "@/modules/axios";
import { categories, units } from "@/modules/selectData";

const { axiosPost } = useAxios();
const router = useRouter();

const labelPosition = ref("top");

const newDeal = {
  name: "",
  goal: "",
  people: 2,
  price: 0,
  url: "",
  portion: "",
  unit: "개",
  category: "",
  tags: [],
  ends: "",
  fileList: [],
  content: "",
  createdby: "JaeHyun Shin",
};

function checkGoal(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  deal.goal = e.target.value;
}
function checkPeople(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  deal.people = e.target.value;
}

onMounted(() => {
  const userPrice = document.getElementById("numPeople");
  numPeople.addEventListener("focusout", checkData);

  function checkData(event) {
    if (deal.people < 2) {
      deal.people = 2;
      deal.price = Math.floor(deal.goal / deal.people);
    }
  }
});

const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref({});
const categoryVisible = ref(false);
const categoryName = ref("카테고리를 선택해주세요");
const uploadedFile = ref([]);
const deal = reactive(newDeal);
let allIsWell = true; //모든 데이터의 정합성이 만족되었는가

const disabledDate = (time) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  return time < new Date(year, month, day) || time > new Date(year, month, day + 7);
};

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

const calculatePrice = (event) => {
  deal.price = Math.floor(deal.goal / deal.people);
};

function showError(fieldName, message) {
  allIsWell = false;
  document.getElementById(fieldName + "Error").innerText = message;
}

function showSuccess(fieldName) {
  document.getElementById(fieldName + "Error").innerText = "";
}

function validateData() {
  console.log(newDeal);
  const toSkip = ["price", "unit", "tags", "createdby", "fileList"];

  Object.keys(newDeal).forEach((fieldName) => {
    if (toSkip.includes(fieldName)) return;
    if (newDeal[fieldName] == "") {
      showError(fieldName, "필수 항목입니다");
    } else {
      showSuccess(fieldName);
    }
  });

  const urlRegex = /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  if (!urlRegex.test(newDeal.url)) {
    showError("url", "잘못된 url입니다");
  } else {
    showSuccess("url");
  }

  if (newDeal.fileList.length === 0) {
    showError("fileList", "필수 항목입니다");
  } else {
    showSuccess("fileList");
  }
}

function onSuccess(resp) {
  router.push("/");
}

async function submitDeal() {
  const dealServer = "http://localhost:8080/product/create";
  newDeal.fileList = []; //fileList 포맷 변경
  for (var i = 0; i < uploadedFile.value.length; i++) {
    newDeal.fileList.push(uploadedFile.value[i].response.fileName);
  }

  allIsWell = true;
  validateData();

  if (!allIsWell) {
    console.log("😢Data validation failed");
  } else {
    newDeal.tags = JSON.stringify(newDeal.tags); //newDeal stringify
    newDeal.ends = moment(newDeal.ends).format("YYYY-MM-DD"); //endDate 포맷 변경
    await axiosPost(dealServer, newDeal, onSuccess);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap");
.text-center {
  font-family: "Noto Sans KR", sans-serif;
}
el-date-picker {
  width: 50vw;
}
small {
  color: red;
}
.requiredInput {
  color: crimson;
  font-size: 1em;
  margin-left: 0.3em;
}
</style>
