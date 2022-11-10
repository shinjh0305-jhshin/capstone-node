import { defineStore } from "pinia";
import { watch, ref } from "vue";

export const useUserInfoStore = defineStore("userInfo", {
  state: () => ({ username: "", userNick: "", loggedIn: false }),
  actions: {
    setInfo(name, nick, isLoggedIn) {
      this.username = name;
      this.userNick = nick;
      this.loggedIn = isLoggedIn;
    },
  },
  getters: {
    getInfo(state) {
      return [state.username, state.userNick, state.loggedIn];
    },
  },
  persist: {
    storage: localStorage,
  },
});
