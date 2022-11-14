<template>
  <h1>ROOMS!!</h1>
  <div>
    <ul v-for="room in roomList">
      <li>
        <a :href="`http://localhost:5173/room/` + room.roomId">{{
          room.roomname
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import useAxios from "../modules/axios";
export default {
  name: "room",
  data() {
    return {
      roomList: [],
    };
  },
  beforeMount() {
    const { axiosGet, axiosPost } = useAxios();

    const getRoomSuccess = (respData) => {
      console.log("✅ Get Rooms - Success");
      console.log(respData);
      this.roomList = respData.rooms;
    };

    const getRoomFail = (respData) => {
      console.log("❌ Get Rooms - Fail");
    };

    axiosGet("/rooms", getRoomSuccess, getRoomFail);
  },
};
</script>
