<template>
  <nav class="navbar navbar-expand-lg" v-if="userStore.loggedIn">
    <div class="container-fluid text-white">
      <a href="#" class="navbar-brand text-white">우리동네 공유마켓</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon navbar-dark"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav" :key="reRender">
        <ul
          :class="{ 'navbar-nav': true, 'me-auto': menu.me_auto }"
          v-for="menu in menus_category"
          :key="menu.id"
        >
          <li
            class="nav-item"
            v-for="menu_object in menu.value"
            :key="menu_object.key"
          >
            <router-link
              v-if="menu_object.key == 'nick'"
              :class="{
                'nav-link': true,
                active: menu == menu_object.key,
                'text-white': true,
              }"
              @click="onMovePage($event, menu_object)"
              :to="menu_object.URL"
              >{{ userStore.userNick }}
            </router-link>
            <router-link
              v-else
              :class="{
                'nav-link': true,
                active: menu == menu_object.key,
                'text-white': true,
              }"
              @click="onMovePage($event, menu_object)"
              :to="menu_object.URL"
              >{{ menu_object.value }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
};
</script>

<script setup>
import { ref, computed, reactive } from "vue";
import { useUserInfoStore } from "/@stores/userInfo";

const userStore = useUserInfoStore();

const menu = ref("home");
const reRender = ref(0);
const tempMenus = [
  { key: "home", value: "홈", URL: "/", position: "left" },
  {
    key: "chat",
    value: "채팅",
    URL: "/room",
    position: "left",
  },
  {
    key: "login",
    value: "로그인",
    URL: "/login",
    position: "right",
  },
];

const menus = [
  { key: "home", value: "홈", URL: "/", position: "left" },
  {
    key: "chat",
    value: "전체 채팅",
    URL: "/allRoom",
    position: "left",
  },
  {
    key: "raiseDeal",
    value: "공구 등록",
    URL: "/raised",
    position: "left",
  },
  {
    key: "mychat",
    value: "공구 채팅",
    URL: `/room/0`,
    position: "left",
  },
  {
    key: "nick",
    URL: "/profile",
    value: userStore.userNick,
    position: "right",
  },
  {
    key: "logout",
    value: "로그아웃",
    URL: "/login",
    position: "right",
  },
];

const left_menus = computed(() => menus.filter((i) => i.position == "left"));
const right_menus = computed(() => menus.filter((i) => i.position == "right"));

const onMovePage = (evt, menu_object) => {
  if (menu_object.key === "logout") {
    userStore.setInfo("", "", false);
  }
  console.log(menu_object);
  if (evt) {
    //evt.preventDefault();
  }
  menu.value = menu_object.key;
};

const menus_category = [
  { id: 1, me_auto: true, value: left_menus.value },
  { id: 2, me_auto: false, value: right_menus.value },
];

const menu_category = [
  { id: 1, me_auto: true, value: left_menus.value },
  { id: 2, me_auto: false, value: right_menus.value },
];
</script>

<style>
nav {
  background-color: #0b2239;
  color: white;
}
</style>
