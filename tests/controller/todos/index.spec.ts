import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { login } from "../../../src/controllers/account";
import bcrypt from "bcrypt";
import User from "../../../src/models/user"; // Asumiendo que este es el modelo de usuario
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "@jest/globals";
import { getMockReq, getMockRes } from '@jest-mock/express'

let mongoServer: MongoMemoryServer;

process.env = { TOKEN_SECRET_KEY: 'mocked_secret_key' };

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 15000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Account Controller", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should login with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password", 10);
    await User.create({ username: "testuser", password: hashedPassword });

    const req = getMockReq({ body: { username: "testuser", password: "password" } });

    const { res } = getMockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: "testuser", token: expect.any(String) }));
  });

  it("should fail login with invalid credentials", async () => {
    const req = getMockReq({ body: { username: "invaliduser", password: "invalidpassword" } });

    const { res } = getMockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });
});
