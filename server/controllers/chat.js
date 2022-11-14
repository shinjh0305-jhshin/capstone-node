const db = require("../tools/authdb");
// db is a pool

export const createRoom = async (req, res) => {
  const { roomName } = req.body;
  const { nickname } = req.params;
  console.log("✅ Got RoomName: ", roomName);
  console.log("✅ Got NickName: ", nickname);

  if (roomName === undefined || nickname === undefined) {
    return res.status(401).json({
      ok: false,
    });
  }
  try {
    const result = await db.query(
      `INSERT INTO Room(nickname, roomName) VALUES('${nickname}','${roomName}');`
    );
    return res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      ok: false,
    });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await db.query(`SELECT roomId, roomname from Room;`);
    return res.status(200).json({ ok: true, rooms: rooms[0] });
  } catch (err) {
    console.log("❌ Failed to fetch Rooms from DB.");
    return res.status(401).json({});
  }
};
