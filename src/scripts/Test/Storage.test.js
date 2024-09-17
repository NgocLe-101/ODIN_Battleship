import Storage from "../Storage";

beforeAll(() => {
  Storage.initDB();
});

describe("Storage should be exist and can be queried", () => {
  test("Storage is exist", () => {
    expect(Storage).toBeTruthy();
  });
  test("Storage can get the player information", async () => {
    return Storage.get("playerInfo")
      .then((info) => {
        expect(info.ok).toBe(true);
        expect(info.status).toBe(200);
        expect(info.name).toBeTruthy();
        expect(info.score).toBeGreaterThanOrEqual(0);
      })
      .catch((err) => {
        throw err;
      });
  });
  test("Storage can be updated", async () => {
    const expected = {
      name: "Jonathan",
      score: 0,
    };
    return Storage.set("playerInfo", expected)
      .then(() => {
        return Storage.get("playerInfo");
      })
      .then((info) => {
        expect({
          name: info.name,
          score: info.score,
        }).toEqual(expected);
      })
      .catch((err) => {
        throw err;
      });
  });
  test("Storage can not change the database structure without class methods", () => {
    return Storage.set("playerInfo", {
      somethingNotRelated: "2123123",
    }).catch((err) => {
      expect(err.message).toMatch("Error");
    });
  });
});
