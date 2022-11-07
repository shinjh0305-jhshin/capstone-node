import { defineStore } from "pinia";

export const useUserInfoStore = defineStore("userInfo", {
  state: () => ({ username: "", userNick: "" }),
  actions: {
    setInfo(name, nick) {
      this.username = name;
      this.userNick = nick;
    },
  },
  getters: {
    getInfo(state) {
      return [state.username, state.userNick];
    },
  },
});
