const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("400: Bad path errors", () => {
  test("400: Should respond with an appropriate error message if the user enters an invalid path", () => {
    return request(app)
      .get("/api/reviews/invalid_path")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad path");
      });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: Should respond with an array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length === 4).toBe(true);
          body.categories.forEach((categoryObject) => {
            expect(categoryObject).toHaveProperty("slug");
            expect(categoryObject).toHaveProperty("description");
          });
        });
    });
    describe("Error handling", () => {
      test("400: Should respond with an error if the user enters the path incorrectly", () => {
        return request(app)
          .get("/api/categoriez")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad path");
          });
      });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: responds with a review object with correct properties", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(typeof body).toBe("object");
          expect(body).toHaveProperty("review_id", 3);
          expect(body).toHaveProperty("title", "Ultimate Werewolf");
          expect(body).toHaveProperty("review_body", "We couldn't find the werewolf!");
          expect(body).toHaveProperty("designer", "Akihisa Okui");
          expect(body).toHaveProperty("review_img_url", "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png");
          expect(body).toHaveProperty("votes", 5);
          expect(body).toHaveProperty("category", "social deduction");
          expect(body).toHaveProperty("owner", "bainesface");
          expect(body).toHaveProperty("created_at", expect.any(String));
        });
    });
    describe("Error handling", () => {
      test("404: Should respond with an appropriate message if no review exists with the given ID.", () => {
        return request(app)
          .get("/api/reviews/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No review exists with that ID");
          });
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: Should respond with an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length === 4).toBe(true);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
