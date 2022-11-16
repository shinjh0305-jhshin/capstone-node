<template>
  <section class="room-page">
    <section class="left">
      <div class="room-container">
        <div class="room-header">Just Header</div>
        <div class="room-box">
          <div
            class="room"
            v-for="myRoom in myRoomList"
            :class="{
              picked: String(myRoom.roomId) === String($route.params.roomId),
            }"
            @click="changeRoom(myRoom.roomId)"
          >
            <router-link
              :to="{ name: 'room', params: { roomId: myRoom.roomId } }"
              ><div class="room-name">
                <p>{{ myRoom.roomName }}</p>
              </div></router-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="right">
      <div class="room-right-container">
        <div v-for="message in messages">
          <div>{{ message.sender }}</div>
          <div>{{ message.content }}</div>
          <div>{{ message.time }}</div>
          <br />
        </div>
        <div class="col-sm-8">
          <form>
            <input
              type="text"
              class="form-control"
              v-model="newMessageObj.content"
              id="message"
              placeholder="send message"
            />
            <button type="button" @click="sendMessage()">Send</button>
          </form>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { io } from "socket.io-client";
import { useUserInfoStore } from "../stores/userInfo";
import axios from "axios";
import useAxios from "../modules/axios";
import { reactive } from "vue";
import roomList from "./myRoom.vue";
const { axiosGet, axiosPost } = useAxios();
export default {
  name: "room",
  data() {
    return {
      myRoomList: [],
      userNick: "",
      socket: null,
      newMessageObj: {
        content: "",
        time: "",
        sender: "",
        imgPath: "",
        roomId: null,
      },
      roomObject: {},
      messages: [],
    };
  },
  async beforeMount() {
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
  mounted() {
    this.socket = io("http://localhost:8080");
    this.socket.on("connect", () => {
      console.log("✅ connected");
    });
    this.socket.on("messageReceived", (msgObjFromServer) => {
      console.log("✅ Received data:", msgObjFromServer);
      this.messages.push(msgObjFromServer);
    });
    this.socket.emit("joinRoom", { roomId: this.$route.params.roomId });
  },
  methods: {
    onSaveSuccess(resp) {
      console.log("✅ Msg Save Success");
    },
    sendMessage() {
      const store = useUserInfoStore();
      this.newMessageObj.roomId = this.$route.params.roomId;
      this.newMessageObj.time = Date.now();
      this.newMessageObj.sender = store.userNick;
      this.socket.emit("messageSent", this.newMessageObj);
      axiosPost("/rooms/saveChat", this.newMessageObj, this.onSaveSuccess);
      this.newMessageObj.content = "";
    },
    changeRoom(id) {
      console.log("⭐️ CHANGE ROOM...", id);
      this.messages = [];
      const { axiosGet, axiosPost } = useAxios();
      const getMsgSucceed = async (resp) => {
        const { msgList } = resp;
        console.log("✅ Get Msg", msgList);
        for (const msg of msgList) {
          this.messages.push({
            content: msg.content,
            sender: msg.nickname,
            time: msg.createdAt,
            roomId: msg.roomId,
          });
        }
      };
      axiosGet(`/rooms/getChat/${id}`, getMsgSucceed);
    },
  },
};
</script>

<style scoped>
section.room-page {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  overflow: hidden;
  background-color: white;
}
section.left {
  width: 25%;
  height: 100%;
  transition: all ease 0.5s;
  position: relative;
  z-index: 50;
}
section.right {
  width: 75%;
  height: 100%;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin-left: auto;
}
div.room-container {
  height: 100%;
  position: relative;
  background-color: #6246ea;
}
div.room-header,
div.room,
div.room-name {
  display: flex;
  align-items: center;
}
div.room-header {
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-bottom: 3px solid;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}
div.room {
  width: 90%;
  margin: auto;
  justify-content: space-between;
  position: relative;
}
div.room :hover {
  color: white;
}
div.room.picked {
  background-color: white;
  color: #6246ea;
}
div.room-box {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: scroll;
  max-height: 100%;
  padding: 2rem 0rem;
}
div.room-box::-webkit-scrollbar {
  display: none;
}

div.room-name {
  width: 90%;
}
a {
  text-decoration: none;
  color: var(--button-text);
  width: 100%;
}
</style>
