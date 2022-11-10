const { client } = require("../tools/jwt");
const { redisCli, get, set } = require("../tools/cache");
const db = require("../tools/authdb");

const login = async (req, res) => {
  //const { username, password } = req.body;
  const obj = JSON.parse(Object.keys(req.body));

  const username = obj.userID;
  const password = obj.userPWD;
  const [result] = await db.query(
    `SELECT * FROM user WHERE ID = '${username}'`
  );
  //console.log(result);
  const user = result[0];

  if (user) {
    const chk = password === user.PWD;
    if (chk) {
      const accessToken = client.sign(user);
      //const refreshToken = client.refresh();
      //console.log(`refreshToken : ${refreshToken}`);
      //await set(username, refreshToken);
      console.log("✅ POST LOGIN RETRUN", user);

      return res.status(200).json({
        ok: true,
        data: {
          //accessToken: accessToken,
          //refreshToken,
          userID: user.ID,
          userNick: user.NICK,
        },
      });
    } else {
      return res.status(401).send({
        ok: false,
        message: "password is incorrect",
      });
    }
  } else {
    console.log("❌ Post Login - Fail");
    return res.status(401).send({
      ok: false,
      message: "user does not exist",
    });
  }
};

module.exports = { login };
