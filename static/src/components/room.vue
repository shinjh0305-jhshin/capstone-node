<template>
  <h1>Room {{ $route.params.roomId }}</h1>
  <div v-for="message in messages">
    <div>{{ message.content }}</div>
  </div>
  <div class="col-sm-8">
    <form>
      <input
        type="text"
        class="form-control"
        v-model="newMessage"
        id="message"
        placeholder="send message"
      />
      <button type="button" @click="sendMessage($route.params.roomId)">
        Send
      </button>
    </form>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { useUserInfoStore } from "../stores/userInfo";
export default {
  name: "room",
  data() {
    return {
      curRoomId: null,
      socket: null,
      newMessage: null,
      roomObject: {},
      messages: [],
    };
  },
  beforeCreate() {
    this.curRoomId = this.$route.params.roomId;
  },
  async created() {
    this.socket = io("http://localhost:8080");
    this.socket.on("connect", () => {
      console.log("✅ connected");
    });
    this.socket.on("messageReceived", (data) => {
      console.log("✅ Received data:", data);
      this.messages.push(data);
    });
    this.socket.emit("joinRoom", { roomId: this.$route.params.roomId });
  },
  methods: {
    sendMessage(roomId) {
      this.socket.emit("messageSent", {
        roomId: roomId,
        content: this.newMessage,
      });
      this.newMessage = "";
    },
  },
};
</script>

<script setup></script>
