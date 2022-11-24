const router = require("express").Router();
const db = require("../tools/authdb");

router.post("/create", async (req, res) => {
  console.log(req.body);
  const {
    name,
    goal,
    people,
    price,
    url,
    category,
    portion,
    unit,
    ends,
    createdby,
    content,
    tags,
    fileList,
  } = req.body;
  console.log(fileList);
  try {
    const [result] = await db.query(
      `INSERT INTO product(name, goal, people, price, url, category, portion, unit, ends, tags, createdby) values ('${name}', ${goal}, ${people}, ${price}, '${url}', ${category}, ${portion}, '${unit}', '${ends}',  '${tags}', '${createdby}')`
    );

    const productId = result.insertId;

    //사진 쿼리

    await db.query(
      `INSERT INTO contents(product_id, content) values (${productId}, '${content}')`
    );

    await db.query(
      `INSERT INTO image(product_id, type, path) values (${productId}, 1, '${fileList[0]}')`
    );
    fileList.slice(1).forEach((x) => {
      db.query(
        `INSERT INTO image(product_id, type, path) values (${productId}, 2, '${x}')`
      );
    });

    res.json({
      message: "Success!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    console.log(req.body);

    await db.query(
      `UPDATE contents SET content = '${req.body.content}' WHERE product_id = ${product_id}`
    );
    await db.query(
      `UPDATE product SET tags = '${req.body.tags}' WHERE id = ${product_id}`
    );

    await db.query(`DELETE from image WHERE product_id = ${product_id}`);

    await db.query(
      `INSERT INTO image(product_id, type, path) values (${product_id}, 1, '${req.body.fileList[0]}')`
    );
    req.body.fileList.slice(1).forEach((x) => {
      db.query(
        `INSERT INTO image(product_id, type, path) values (${product_id}, 2, '${x}')`
      );
    });

    res.status(200).json({
      rsp: "ok",
    });
  } catch (error) {
    console.log(error);
    res.send("Update error. Check server log.");
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    await db.query(`UPDATE product SET deleted = 1 WHERE id = ${product_id}`);
    await db.query(
      `UPDATE image SET type = 2 WHERE product_id = ${product_id} AND type = 1`
    );

    await db.query(
      `INSERT INTO image(product_id, type, path) VALUES (${product_id}, 1, 'deleted.jpg')`
    );

    res.status(200).json({
      status: 0,
    });
  } catch (error) {
    console.log(error);
    res.send("Update error. Check server log.");
  }
});

router.get("/list", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT product.*, image.type, image.path
            FROM product JOIN image
            ON product.id = image.product_id
            WHERE image.type = 1;`
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const [result] = await db.query(
      `SELECT product.*, contents.content
            FROM product JOIN contents
            ON ${product_id} = product.id
            AND product.id = contents.product_id;`
    );
    const [images] = await db.query(
      `SELECT path
      FROM image
      WHERE image.product_id=${product_id}`
    );

    result[0].fileList = [];
    images.forEach((x) => result[0].fileList.push(x.path));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

module.exports = router;
