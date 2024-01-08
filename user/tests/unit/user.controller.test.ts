import UserController from "../../src/controllers/user";
import {expect} from '@jest/globals';
import axios from 'axios';

const controller = new UserController();

/** Function Test - Start */
describe('Test User Functions', () => {
  beforeAll(() => {
  });
  
  afterAll(() => {
  });

  it("ping::should return pong message", async () => {
    const response = await controller.getMessage();
    expect(response.message).toBe("user->pong");
  });

  it("login::should return OK", async () => {
    const response = await controller.login("123@gmail.com", "123");
    expect(response).toBe("OK");
  });

  it("login::should return NOT OK", async () => {
    const response = await controller.login("123@gmail.com", "");
    expect(response).toBe("NOT OK");
  });

  it("register::should return OK", async () => {
    const response = await controller.register("123@gmail.com", "123");
    expect(response).toBe("OK");
  });

  it("register::should return NOT OK", async () => {
    const response = await controller.register("123@gmail.com", "");
    expect(response).toBe("NOT OK");
  });
});

/** Function Test - End */

/** Api Test - Start */
describe('Test User Login APIs', () => {
  let apiUrl = "";

  beforeAll(() => {
    console.log("beforeAll called");
    apiUrl = "http://localhost:8000/api/v1/user/login";
  });
  
  afterAll(() => {
    console.log("afterAll called");
  });

  it('User Login::Get successful result', async() => {
    const json = JSON.stringify({ email: "123@gmail.com", password: "!23" });
    console.log("testing "+apiUrl);
    await axios.post(apiUrl, json, {
      headers: {'content-type': 'application/json'}
    }).then(r => {
        console.log("result=>",r.data);
        expect(r.data).toBeDefined();
        expect(r.status).toBeGreaterThanOrEqual(200);
        expect(r.status).toBeLessThan(300);
        expect(r.data).toBe("OK");
      })
      .catch(e => {
        throw e;
      });
  });

  const loginThatThrowsAsync = async (apiUrl:string) =>{
    const json = JSON.stringify({ email: "123@gmail.com"});
    console.log("testing "+apiUrl);
    await axios.post(apiUrl, json, {
      headers: {'content-type': 'application/json'}
    }).then(r => {
        console.log("result=>",r.data);
        return Promise.resolve();
      })
      .catch(e => {
        throw e;
      });
  }

  it('User Login::Should throw an error if password is missing', () => {
    expect(async () => {
      await loginThatThrowsAsync(apiUrl);
    }).rejects.toThrow();
  });
  

});

describe('Test User Register APIs', () => {
  let apiUrl = "";

  beforeAll(() => {
    console.log("beforeAll called");
    apiUrl = "http://localhost:8000/ms_1/api/v1/user/register";
  });
  
  afterAll(() => {
    console.log("afterAll called");
  });

  it('User Login::Get successful result', async() => {
    const json = JSON.stringify({ email: "123@gmail.com", password: "!23" });
    console.log("testing "+apiUrl);
    await axios.post(apiUrl, json, {
      headers: {'content-type': 'application/json'}
    }).then(r => {
        console.log("result=>",r.data);
        expect(r.data).toBeDefined();
        expect(r.status).toBeGreaterThanOrEqual(200);
        expect(r.status).toBeLessThan(300);
        expect(r.data).toBe("OK");
      })
      .catch(e => {
        throw e;
      });
  });

  const loginThatThrowsAsync = async (apiUrl:string) =>{
    const json = JSON.stringify({ email: "123@gmail.com"});
    console.log("testing "+apiUrl);
    await axios.post(apiUrl, json, {
      headers: {'content-type': 'application/json'}
    }).then(r => {
        console.log("result=>",r.data);
        return Promise.resolve();
      })
      .catch(e => {
        throw e;
      });
  }

  it('User Login::Should throw an error if password is missing', () => {
    expect(async () => {
      await loginThatThrowsAsync(apiUrl);
    }).rejects.toThrow();
  });
  

});


/** Api Test - End */
