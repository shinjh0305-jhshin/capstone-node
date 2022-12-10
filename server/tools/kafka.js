const { Kafka, Partitioners } = require("kafkajs");
import io from "../server";
const db = require("../tools/db");

const kafka = new Kafka({
  clientId: "kafka-my-app",
  brokers: ["13.209.40.90:9092"],
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const consumerJoin = kafka.consumer({ groupId: "gonggu" });

const initKafka = async () => {
  //await producer.connect();
  await consumerJoin.connect();
};

export const chatKafka = async () => {
  await consumerJoin.subscribe({
    topics: ["chatJoin", "chatExit", "chatMessage"],
    fromBeginning: true,
  });
  await consumerJoin.run({
    eachMessage: async ({ topic, partition, message }) => {
      /*
      console.log("⭐️ Kafka Consume", {
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      */
      console.log("⭐️ Kafka - ", {
        topic,
        value: message.value.toString(),
      });
      if (topic === "chatJoin" || topic === "chatExit") {
        // send Notification
        const info = JSON.parse(message.value.toString());
        const msgObj = new Object();
        msgObj.chatType = "notification";
        msgObj.time = new Date(Date.now());
        msgObj.sender = info.nickName;
        msgObj.roomId = String(info.dealId);
        msgObj.imgPath = "";
        msgObj.content =
          topic === "chatJoin"
            ? `${info.nickName}님이 들어왔습니다.`
            : `${info.nickName}님이 나갔습니다.`;
        // emit notification
        io.to(String(info.dealId)).emit("notify", { msg: msgObj });
        // db insert
        await db.query(
          `INSERT INTO chat(deal_id,nickname,chat_type,content,img_path) VALUES('${info.dealId}','${info.nickName}','${msgObj.chatType}','${msgObj.content}','${msgObj.imgPath}');`
        );
      } else if (topic === "chatMessage") {
        // 푸시 알림 구현
      }
    },
  });
};

initKafka();
//runKafka().catch(console.error);
