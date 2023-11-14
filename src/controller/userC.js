const db = require("../../connections");
const response = require("../../response");
require("dotenv").config();
// const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;

const registrasi = (req, res) => {
    const { username, password, email, profile_pict, token, role } = req.body;
    console.log(req.body);
    const sql = `SELECT email FROM users WHERE email = '${email}'`;
    db.query(sql, (error, result) => {
        if (error) {
            return response(500, "", "Users server error!", res);
        } else if (result.length > 0) {
            return response(500, "", "Your account has been registered!", res);
        } else {
            const insertSql = `INSERT INTO users (username,  password, email, profile_pict, token, role) VALUES ('${username}', '${password}','${email}','${profile_pict}','${token}','${role}')`;

            db.query(insertSql, (error, result) => {
                if (error) {
                    return response(
                        500,
                        error,
                        "Register user unsuccessful!",
                        res
                    );
                } else if (result.affectedRows > 0) {
                    return response(
                        200,
                        { isRegist: result.affectedRows },
                        "Register user successful!",
                        res
                    );
                }
            });
        }
    });
};
// naruto@gmail.com
// Naruto123

const getUsers = async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const sql = "SELECT * FROM users";
            db.query(sql, (error, result) => {
                console.log(error);
                if (error) {
                    return response(500, "error", "User sever error", res);
                } else response(200, result, "Get all data from users", res);
            });
        } else {
            response(400, "access denaid", "your account not admin", res);
        }
    } catch (error) {
        response(500, error, "User sever error", res);
    }
};

const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Menggunakan parameterized query
      const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
      db.query(sql, [email, password], async (error, result) => {
          if (error) {
              return response(500, "error", "User server error", res);
          } else if (result.length === 0) {
              return response(400, "unvalid account", "Incorrect email or password", res);
          } else {
              const dataToken = {
                  id: result[0].id,
                  email: result[0].email,
                  role: result[0].role,
              };

              const dataResponseLogin = {
                  id: result[0].id,
                  username: result[0].username,
                  email: result[0].email,
                  role: result[0].role,
              };

              const token = JWT.sign(dataToken, secret, {
                  expiresIn: 60 * 60 * 24 * 2,
              });

              // Menggunakan parameterized query untuk update token
              const updateSql = 'UPDATE users SET token = ? WHERE id = ?';
              db.query(updateSql, [token, result[0].id], (updateError, updateResult) => {
                  if (updateError) {
                      return response(500, "error", "User server error", res);
                  } else {
                      const payload = {
                          token,
                          dataResponseLogin,
                      };
                      return response(200, payload, "Login user success", res);
                  }
              });
          }
      });
  } catch (error) {
      return response(400, error, "User server error", res);
  }
};

const logout = async (req, res) => {
    try {
        const { email } = req.body;

        const sql = `UPDATE users SET token = "" WHERE email = '${email}'`;
        db.query(sql, (error, result) => {
            if (error) {
                return response(500, "error", "User sever error", res);
            } else {
                return response(200, "Success", "Logout user success", res);
            }
        });
    } catch (error) {
        response(400, error, "User server error", res);
    }
};

const keepLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const sql = `SELECT * FROM users WHERE token ='${token}'`;
        db.query(sql, (error, result) => {
            if (error) {
                return response(500, null, "User server error", res);
            } else if (result.length === 0) {
                return response(
                    400,
                    null,
                    "Token expired, please relogin!",
                    res
                );
            } else {
                const dataResponseLogin = {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                    role: result[0].role,
                };
                const payload = {
                    token,
                    dataResponseLogin,
                };
                return response(200, payload, "Re-Login user success", res);
            }
        });
    } catch (error) {
        response(400, null, "User server error", res);
    }
};

module.exports = {
    registrasi,
    getUsers,
    login,
    logout,
    keepLogin,
};
