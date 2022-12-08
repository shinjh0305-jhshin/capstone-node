<template>
  <section class="room-page">
    <section class="left">
      <div class="room-left-container">
        <div class="room-header">Rooms</div>
        <div class="room-box">
          <div
            class="room"
            v-for="myRoom in myRoomList"
            :class="{
              picked: String(myRoom.deal_id) === String($route.params.deal_id),
            }"
          >
            <router-link
              :to="{ name: 'room', params: { roomId: myRoom.deal_id } }"
              @click="changeRoom(myRoom.deal_id)"
            >
              <div class="room-name">
                <span>{{ myRoom.title }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section class="right">
      <div class="room-right-container">
        <div class="message-header"></div>
        <div class="message-container">
          <div class="message-body">
            <div v-for="(messageObj, idx) in messageObjList" :key="idx">
              <div class="divider" v-if="dayDivider(idx)">
                <div></div>
                <p>{{ getDividerDate(idx) }}</p>
                <div></div>
              </div>
              <message
                :message="messageObj"
                :yours="String(currentUser) === String(messageObj.sender)"
                :sameTime="isDisplayTime(idx)"
                :sameUser="isDisplaySender(idx)"
                :diffOtherUser="isDiffOther(idx)"
              />
            </div>
          </div>
        </div>

        <div class="send-container">
          <div class="send-body">
            <div class="input-container">
              <input
                type="text"
                class="form-control"
                v-model="newMessageObj.content"
                id="message"
                placeholder="send message"
                @keyup.enter="sendMessage()"
              />
            </div>
            <div class="click-container">
              <div class="send-click" @click="sendMessage()">
                <span>&rarr;</span>
              </div>
            </div>
            <div class="image-click-container">
              <div class="image-click">
                <label for="chat-img-upload">+</label>
                <input
                  type="file"
                  @change="sendImage()"
                  id="chat-img-upload"
                  ref="chatImage"
                  name="chatImg"
                />
              </div>
            </div>
          </div>
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
import message from "./message.vue";
import FormData from "form-data";
const { VITE_SOCKET_URL } = import.meta.env;
const { axiosGet, axiosPost } = useAxios();

export default {
  name: "room",
  components: {
    message: message,
  },
  data() {
    return {
      myRoomList: [],
      curRoomName: "",
      socket: io(VITE_SOCKET_URL),
      messageObj: {
        sender: "",
        content: "",
        time: "",
        imgPath: "",
        chatType: "",
      },
      newMessageObj: {
        chatType: "",
        content: "",
        time: "",
        sender: "",
        imgPath: "",
        roomId: null,
      },
      messageObjList: [],
      currentUser: "",
      msgScroll: null,
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
    this.currentUser = store.userNick;
    axiosGet(`/room/${nickname}`, null, null, getMyRoomSuccess, getMyRoomFail);
  },
  watch: {
    $route(to, from) {
      console.log("✅ Watch");
      this.updatePage(from.params.roomId, to.params.roomId);
      this.setRoomName(to.params.roomId);
    },
  },
  mounted() {
    this.socket.on("joined", (fromServer) => {
      console.log("✅ Joined Room:", fromServer);
    });
    this.socket.on("leaving", (fromServer) => {
      console.log("✅ Left Room:", fromServer);
    });
    this.socket.on("connect", () => {
      console.log("✅ connected");
    });
    this.socket.on("messageReceived", (msgObjFromServer) => {
      console.log("✅ Received Message:", msgObjFromServer);
      this.messageObjList.push(msgObjFromServer);
    });
    this.socket.on("notify", (resp) => {
      console.log("✅ Notification", resp.msg);
      this.messageObjList.push(resp.msg);
    });
    this.changeRoom(this.$route.params.roomId); // 현재 페이지 새로고침하는 경우
    this.setRoomName(this.$route.params.roomId);
  },
  updated() {
    this.msgScroll = document.querySelector("div.message-container");
    this.msgScroll.scrollTop = this.msgScroll.scrollHeight;
    console.log(this.msgScroll.scrollTop);
  },
  methods: {
    updatePage(prevRoomId, curRoomId) {
      //console.log("✅ prev -- UPDATE PAGE:", prevRoomId, curRoomId);
      //console.log("TYPE OF ROOMID:", typeof prevRoomId);
      this.socket.emit("leaveRoom", { roomId: String(prevRoomId) });
      this.socket.emit("joinRoom", { roomId: String(curRoomId) });
    },
    isDiffOther(idx) {
      if (idx === 0) return false;
      const prevUser = this.messageObjList[idx - 1].sender;
      const curUser = this.messageObjList[idx].sender;
      if (prevUser != this.currentUser && prevUser != curUser) return false;
      return true;
    },
    isDisplaySender(idx) {
      if (idx === 0) return true;
      const prevUser = this.messageObjList[idx - 1].sender;
      const curUser = this.messageObjList[idx].sender;
      const prev = new Date(this.messageObjList[idx].time).getDate();
      const today = new Date(this.messageObjList[idx - 1].time).getDate();
      const prevType = this.messageObjList[idx - 1].chatType;
      const curType = this.messageObjList[idx].chatType;
      if (prevType != curType) return true;
      if (prev != today) return true;
      if (prevUser === curUser) return false;
      return true;
    },
    isDisplayTime(idx) {
      if (idx + 1 === this.messageObjList.length) return true;
      const curMinute = new Date(this.messageObjList[idx].time).getMinutes();
      const nextMinute = new Date(
        this.messageObjList[idx + 1].time
      ).getMinutes();
      const curUser = this.messageObjList[idx].sender;
      const nextUser = this.messageObjList[idx + 1].sender;
      if (curUser != nextUser) return true;
      if (curMinute === nextMinute) return false;
      return true;
    },
    dayDivider(idx) {
      if (idx === 0) return true;
      const prev = new Date(this.messageObjList[idx].time).getDate();
      const today = new Date(this.messageObjList[idx - 1].time).getDate();
      if (prev != today) return true;
      return false;
    },
    getDividerDate(idx) {
      const week = ["일", "월", "화", "수", "목", "금", "토"];
      const today = new Date(this.messageObjList[idx].time);
      return `${today.getFullYear()}년 ${
        today.getMonth() + 1
      }월 ${today.getDate()}일 ${week[today.getDay()]}요일`;
    },
    setRoomName(id) {
      for (const myRoom of this.myRoomList) {
        if (String(myRoom.roomId) === String(id)) {
          this.curRoomName = myRoom.roomName;
          break;
        }
      }
    },
    sendImage() {
      const onSaveSuccess = (resp) => {
        console.log("✅ Msg Save Success");
      };
      let data = new FormData();
      const imgObj = this.$refs.chatImage.files[0];
      const store = useUserInfoStore();
      const { VITE_IMAGE_SERVER_URL } = import.meta.env;
      data.append("chatImg", imgObj);
      const imgConfig = {
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: VITE_IMAGE_SERVER_URL,
        data: data,
      };
      axios(imgConfig)
        .then((resp) => {
          console.log(resp);
          this.newMessageObj.chatType = "message";
          this.newMessageObj.roomId = String(this.$route.params.roomId);
          this.newMessageObj.time = new Date(Date.now());
          this.newMessageObj.sender = store.userNick;
          this.newMessageObj.content = "";
          this.newMessageObj.imgPath = resp.data.imgPath;
          this.socket.emit("messageSent", this.newMessageObj);
          axiosPost("/room/chat", this.newMessageObj, onSaveSuccess);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    sendMessage() {
      const onSaveSuccess = (resp) => {
        console.log("✅ Msg Save Success");
      };
      if (this.newMessageObj.content.length > 0) {
        const store = useUserInfoStore();
        const sendObj = new Object();
        sendObj.chatType = "message";
        sendObj.roomId = String(this.$route.params.roomId);
        sendObj.time = new Date(Date.now());
        sendObj.sender = store.userNick;
        sendObj.content = this.newMessageObj.content;
        sendObj.imgPath = "";
        this.socket.emit("messageSent", sendObj);
        axiosPost("/room/chat", sendObj, onSaveSuccess);
        this.newMessageObj.content = "";
      }
    },
    changeRoom(id) {
      if (Number(id) > 0) {
        console.log("⭐️ CHANGE ROOM...", id);
        this.messageObjList = [];
        const getMsgSucceed = async (resp) => {
          const { msgList } = resp;
          //console.log("✅ Get Msg", msgList);
          for (const msg of msgList) {
            const date = new Date(msg.created_at);
            this.messageObjList.push({
              content: msg.content,
              sender: msg.nickname,
              time: new Date(date.toISOString().slice(0, -1)),
              roomId: String(msg.deal_id),
              imgPath: msg.image_path,
              chatType: msg.chat_type,
            });
          }
        };
        axiosGet(`/room/${id}/chat/`, null, null, getMsgSucceed);
        this.socket.emit("joinRoom", { roomId: String(id) });
      }
    },
  },
};
</script>

<style scoped>
section.room-page {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 93vh;
  overflow: hidden;
  background-color: white;
}
section.left {
  width: 20%;
  height: 100%;
  transition: all ease 0.5s;
  position: relative;
  z-index: 50;
  color: rgb(192, 192, 184);
}
section.right {
  width: 80%;
  height: 100%;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin-left: auto;
  background-color: rgb(40, 37, 37);
  color: white;
}
div.room-left-container {
  height: 100%;
  position: relative;
  background-color: #353333;
}
div.room-header,
div.room,
div.room-name {
  display: flex;
  align-items: center;
}
div.room-header {
  justify-content: center;
  padding: 0.8rem 1rem;
  border-bottom: 3px solid black;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}
div.room {
  height: 60px;
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.room :hover {
  color: white;
}
div.room.picked {
  background-color: rgb(42, 40, 40);
  color: #7e71bb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 10px;
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
  display: flex;
  justify-content: center;
}
a {
  text-decoration: none;
  color: var(--button-text);
  width: 100%;
}
div.room-right-container {
  position: relative;
  height: 100%;
}
div.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  padding-left: 2.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  z-index: 10;
}
div.message-container {
  width: 100%;
  height: 85%;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
div.message-body {
  width: 89%;
  margin: auto;
}
div.divider {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}
div.divider p {
  margin: 0 0.3rem;
  font-size: 0.85rem;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  color: #7e71bb;
}
div.divider div {
  height: 1px;
  width: 100%;
  background: #7e71bb;
}
div.send-container {
  display: flex;
  align-items: center;
  border-radius: 0.3rem;
  width: 100%;
  position: absolute;
  bottom: 0;
}
div.send-body {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70%;
  background-color: rgb(19, 18, 18);
  border-radius: 10px;
  padding: 10px 20px;
}
div.input-container {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
}
div.click-container {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
}
div.send-body input {
  width: 100%;
  background: transparent;
  color: white;
}
div.send-click {
  padding: 5px;
  border: 1px solid white;
  border-radius: 5px;
  width: 90%;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
div.image-click-container {
  border-radius: 5px;
  width: 5%;
  height: 100%;
}
div.image-click label {
  padding: 5px;
  border: 1px solid white;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
