<template>
  <h1>MY ROOMS!!</h1>
  <div>
    <ul v-for="myRoom in myRoomList">
      <li>
        <router-link
          :to="{ name: 'room', params: { roomId: myRoom.roomId } }"
          >{{ myRoom.roomName }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import useAxios from "../modules/axios";
import { useUserInfoStore } from "../stores/userInfo";
export default {
  name: "myRoom",
  data() {
    return {
      myRoomList: [],
      userNick: "",
    };
  },
  beforeCreate() {
    const store = useUserInfoStore();
    this.userNick = store.userNick;
  },
  beforeMount() {
    const { axiosGet, axiosPost } = useAxios();
    const getMyRoomSuccess = (respData) => {
      console.log("✅ Get My Rooms - Success");
      console.log(respData);
      this.myRoomList = respData.rooms;
    };
    const getMyRoomFail = (respData) => {
      console.log("❌ Get My Rooms - Fail");
    };
    const store = useUserInfoStore();
    const nickname = store.userNick;
    axiosGet(`/users/${nickname}/room`, getMyRoomSuccess, getMyRoomFail);
  },
};
</script>
