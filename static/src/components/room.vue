<template>
  <h1>Room {{ $route.params.roomId }}</h1>
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
</template>

<script>
import { io } from "socket.io-client";
import { useUserInfoStore } from "../stores/userInfo";
import axios from "axios";
import useAxios from "../modules/axios";
import { reactive } from "vue";
const { axiosGet, axiosPost } = useAxios();
export default {
  name: "room",
  data() {
    return {
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
  async beforeCreate() {
    const getMsgSucceed = async (resp) => {
      const { msgList } = resp;
      console.log("✅ Get Msg", msgList);
      for (const msg of msgList) {
        this.messages.push({
          content: msg.content,
          sender: msg.nickname,
          time: msg.createdAt,
        });
      }
    };
    axiosGet(`/rooms/getChat/${this.$route.params.roomId}`, getMsgSucceed);
  },
  async created() {
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
  },
};
</script>

<script setup>
/*
import { io } from "socket.io-client";

const messageInfo = reactive({
  content: "",
  currentTime: Date.now(),
  sender: null,
});

const socket = io("http://localhost:8080");
const sendMessage = (roomId) => {
  socket.emit("messageSent", {
    roomId: roomId,
    content: this.newMessage,
  });
  this.newMessage = "";
};
*/
</script>
