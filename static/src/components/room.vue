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
      <button
        type="button"
        @click.stop.prevent="sendMessage($route.params.roomId)"
        :disabled="newMessage == ''"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:8080");
export default {
  name: "room",
  data() {
    return {
      newMessage: null,
      roomObject: {},
      messages: [],
    };
  },
  beforeCreate() {
    const curId = this.$route.params.roomId;
  },
  updated() {
    socket.on("messageReceived", (content) => {
      console.log("got new message:", content);
      this.messages.push(content);
    });
  },
  methods: {
    sendMessage(roomId) {
      this.messages.push({ content: this.newMessage });
      socket.emit("messageSent", { roomId: roomId, content: this.newMessage });
    },
  },
};
</script>

<script setup></script>
