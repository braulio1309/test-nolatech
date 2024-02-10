const COL_PASS_USUARIO = "DES_PASS";
const COL_ESTATUS = "ESTATUS";
const paginate = require("node-mysql-paginate");

const pool = require("../database");
const promisePool = pool;

const login = (user, pass) => {
  let consulta = `SELECT * FROM users WHERE username = '${user}' AND '${COL_PASS_USUARIO}' = '${pass}' AND '${COL_ESTATUS}' > 0`;
  return consulta;
};

const get = (table, id) => {
  let consulta = `SELECT * FROM ${table} WHERE id = ${id}`;
  return promisePool.query(consulta);
};

const insert = async (tableName, params, res) => {
  try {
    return promisePool.query(`INSERT INTO ${tableName} SET ?`, params);
  } catch(err) {
    console.error("Error al insertar", err);
    return 0;
  }
};

const update = async (table, data) => {
  let consulta = `UPDATE ${table} SET ? WHERE id=?`;
  try {
    return promisePool.query(consulta, [data, data.ID]);
  } catch(err){
    console.log("Error al insertar");
    return err;
  }
};

const show = async (req, res, query, params) => {
  let limit = 10;
  if (req.params.limit) {
    limit = req.params.limit;
  }

  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  paginate.paginate(
    pool,
    query,
    {
      page: page,
      limit: limit,
      params: params,
    },
    function (err, rows) {
      if (err) {
        return res.status(400).send({
          message: "Datos incorrectos, intentelo de nuevo",
        });
      }

      return res.json(rows);
    }
  );
};

const remove = (table, id) => {
  let consulta = `DELETE FROM ${table} WHERE id = ${id}`;
  return consulta;
};

module.exports = {
  login,
  get,
  remove,
  show,
  update,
  insert
};
