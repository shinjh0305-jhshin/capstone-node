import jwt from '../tools/jwt';
//import client from '../tools/client';
const { redisClient } = require('../tools/cache');
const db = require('../tools/authdb');

export const login = async(req, res) => {
    const { username, password } = req.body;
    const [result] = await db.query(`SELECT * FROM user WHERE ID = '${username}'`);

    const user = result[0];

    if (user) {
        const chk = (password === user.password);
        if (chk) {
            const accessToken = jwt.sign(user);
            const refreshToken = jwt.refresh();
            redisClient.set(username, refreshToken);

            return res.status(200).send({
                ok: true,
                data: {
                    accessToken, refreshToken
                }
            });
        } else {
            return res.status(401).send({
                ok: false,
                message: 'password is incorrect'
            })
        }
    }
    else {
        return res.status(401).send({
            ok: false,
            message: 'user not exist'
        });
    }
}