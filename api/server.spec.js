const request = require("supertest");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConfig.js");
const server = require("./server.js");

const Users = require("../auth/auth-model.js");

let auth = {};

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it('testing running with DB_ENV = "testing" ', () => {
    expect(process.env.DB_ENV).toBe("testing");
  });

  describe("POST /api/auth/register", () => {
    it("return 200 OK", () => {
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "test",
          password: "1234"
        })
        .then(res => {
          expect(res.status).toBe(201);
        });
    });
    it("should insert a user in the db", () => {
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "test",
          password: "1234"
        })
        .then(res => {
          expect(res.body.length).toBe(1);
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 OK", () => {
      return request(server).post("/api/auth/loing");
    });
  });

  describe("GET /api/jokes", () => {
    it("should require authorization", () => {
      return request(server)
        .get("/api/jokes")
        .then(res => {
          expect(res.status).toBe(401);
        });
    });

    // beforeAll(loginUser(auth));

    // it("should respond with JSON", () => {
    //   console.log(auth);
    //   return request(server)
    //     .get("/api/jokes")
    //     .set("Authorization", `Bearer ${auth.token}`)

    //     .then(res => {
    //       expect(res.status).toBe(200);
    //       expect(res.type).toBe("application/json");
    //     });
    // });
  });
});

// function loginUser(auth) {
//   const user = { username: "testing", password: "12345" };
//   const hash = bcrypt.hashSync(user.password);
//   user.password = hash;
//   const testUser = request(server)
//     .post("/api/auth/register")
//     .send({
//       user
//     });
//   console.log(testUser);
//   console.log(user);
//   return function(done) {
//     request(server).post("/api/auth/login", (req, res) => {
//       Users.find(testUser.username).then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           const token = jwt(user);
//           console.log(token);
//           auth.token = token;
//           done();
//         } else {
//           done();
//         }
//       });
//     });
//   };
// }
