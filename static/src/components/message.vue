<template>
  <div class="message" :class="{ viewer: yours }">
    <div class="message-model" :class="{ viewer: yours }">
      <div class="message-head" :class="{ viewer: yours }">
        <div><i class="fa-regular fa-face-smile"></i></div>
        <p v-if="!yours" class="sender">{{ message.sender }}</p>
      </div>
      <div class="content-body" :class="{ viewer: yours }">
        <span class="content" :class="{ viewer: yours }">{{
          message.content
        }}</span>
        <div class="date-body">
          <span class="date">{{ formatDate(new Date(message.time)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message", "yours"],
  methods: {
    formatDate(date) {
      const padZero = (num) => {
        if (num < 10) {
          return "0" + String(num);
        } else return String(num);
      };
      let hour = Number(date.getHours());
      const mm = hour > 11 ? "오후" : "오전";
      hour = hour > 12 ? hour - 12 : hour;
      let minute = Number(date.getMinutes());
      return `${mm} ${padZero(hour)}:${padZero(minute)}`;
    },
  },
};
</script>

<style scoped>
div.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}
div.message.viewer {
  margin: 0px;
}
div.message-head {
  height: 20px;
  display: flex;
  align-items: center;
}
div.message.viewer,
div.message-head.viewer {
  justify-content: flex-end;
}
div.message-head p.sender {
  margin-right: 0.65rem;
  font-size: 1rem;
  font-weight: 600;
}
div.content-body {
  display: flex;
}
div.content-body.viewer {
  flex-direction: row-reverse;
}
div.date-body {
  display: flex;
  align-items: flex-end;
}
span.content {
  background-color: dimgray;
  padding: 5px 10px;
  border-radius: 10px;
  float: left;
}
span.content.viewer {
  float: right;
}
span.date {
  color: rgb(172, 170, 170);
  font-size: 0.65rem;
  margin: 0px 5px;
}
</style>
