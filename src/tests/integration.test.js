/* eslint-disable no-prototype-builtins */
const axios = require('axios');
// eslint-disable-next-line prefer-destructuring
const port = require('../common/env.config').port;
const DiagnosticsHelper = require('../common/diagnostics.helper');
const UsersService = require('../api/users/users.service');
const DatapointsService = require('../api/datapoints/datapoints.service');

const host = `http://localhost:${port}`;
const test1Username = 'test1';
const test1Password = 'test1password';
let test1ValidToken = '';
let test1UserId = '';
const test2Username = 'test2';
const test2Password = 'test2password';
let test2ValidToken = '';
let test2UserId = '';

let datapointId = '';

beforeAll(async () => {
});

afterAll(async () => {
    await DatapointsService.deleteAll(test1UserId);
    await UsersService.delete(test1UserId);
    await DatapointsService.deleteAll(test2UserId);
    await UsersService.delete(test2UserId);
});

test('When I call GET /diag then I should get back to current appVersion', async () => {
    expect.assertions(2);
    const appVersion = DiagnosticsHelper.getAppVersion();
    const url = `${host}/diag`;
    let result;
    try {
        result = await axios.get(url);
        expect(result.data.hasOwnProperty('appVersion')).toBe(true);
        expect(result.data.appVersion).toEqual(appVersion);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I create user1, then I should get back the userId', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/users';
    const data = {
        email: test1Username,
        password: test1Password
    };
    const config = {
        url: `${host}${path}`,
        method,
        data
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(201);
        expect(result.data.hasOwnProperty('id')).toBe(true);
        test1UserId = result.data.id;
    } catch (err) {
        console.log(err.message);
    }
});

test('When I authenticate with user1, then I should get the JWT token', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/auth';
    const data = {
        email: test1Username,
        password: test1Password
    };
    const config = {
        url: `${host}${path}`,
        method,
        data
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('accessToken')).toBe(true);
        test1ValidToken = result.data.accessToken;
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get details of user1, then I should get status 200', async () => {
    expect.assertions(5);
    const method = 'GET';
    const path = `/users/${test1UserId}`;
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('_id')).toBe(true);
        expect(result.data.hasOwnProperty('email')).toBe(true);
        expect(result.data._id).toEqual(test1UserId);
        expect(result.data.email).toEqual(test1Username);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of users, then I should get status 200', async () => {
    expect.assertions(6);
    const method = 'GET';
    const path = '/users';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.resources.length).toBeGreaterThanOrEqual(1);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of datapoints, then I should get an empty list', async () => {
    expect.assertions(6);
    const method = 'GET';
    const path = '/datapoints';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.resources.length).toEqual(0);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I send 6 weight datapoints, then I should get status 200', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/datapoints';
    const data = {
        dataType: 'weight',
        value: 70,
        unitOfMeasure: 'kg'
    };
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` },
        data
    };
    let result;
    try {
        let n = 0;
        while (n < 6) {
            result = await axios(config);
            n++;
        }
        expect(result.status).toEqual(201);
        expect(result.data.hasOwnProperty('id')).toBe(true);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I send 8 blood-pressure datapoints, then I should get status 200', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/datapoints';
    const data = {
        dataType: 'blood_pressure',
        value: {
            systolic: 119,
            diastolic: 78
        },
        unitOfMeasure: 'mmHg'
    };
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` },
        data
    };
    let result;
    try {
        let n = 0;
        while (n < 8) {
            result = await axios(config);
            n++;
        }
        expect(result.status).toEqual(201);
        expect(result.data.hasOwnProperty('id')).toBe(true);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of datapoints, then I should get 14 entries in multiple pages', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(14);
        expect(result.data.limit).toEqual(10);
        expect(result.data.resources.length).toEqual(10);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of datapoints with limit of 20, then I should get 14 entries in one page', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints?limit=20';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(14);
        expect(result.data.limit).toEqual(20);
        expect(result.data.resources.length).toEqual(14);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of weight datapoints, then I should get 6 entries', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints?dataType=weight';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(6);
        expect(result.data.limit).toEqual(10);
        expect(result.data.resources.length).toEqual(6);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of blood-pressure datapoints, then I should get 8 entries', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints?dataType=blood_pressure';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(8);
        expect(result.data.limit).toEqual(10);
        expect(result.data.resources.length).toEqual(8);
        datapointId = result.data.resources[0]._id;
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get details of one datapoint, then I should get status 200', async () => {
    expect.assertions(9);
    const method = 'GET';
    const path = `/datapoints/${datapointId}`;
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('createdAt')).toBe(true);
        expect(result.data.hasOwnProperty('dataType')).toBe(true);
        expect(result.data.hasOwnProperty('unitOfMeasure')).toBe(true);
        expect(result.data.hasOwnProperty('userId')).toBe(true);
        expect(result.data.hasOwnProperty('value')).toBe(true);
        expect(result.data._id).toEqual(datapointId);
        expect(result.data.value).toBeTruthy();
        expect(result.data.dataType).toBeTruthy();
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get delete one datapoint, then I should get status 200', async () => {
    expect.assertions(2);
    const method = 'DELETE';
    const path = `/datapoints/${datapointId}`;
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data).toEqual('Successfully deleted');
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of blood-pressure datapoints, then I should get 7 entries', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints?dataType=blood_pressure';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(7);
        expect(result.data.limit).toEqual(10);
        expect(result.data.resources.length).toEqual(7);
    } catch (err) {
        console.log(err.message);
    }
});

//
// User2
//
test('When I create user2, then I should get back the userId', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/users';
    const data = {
        email: test2Username,
        password: test2Password
    };
    const config = {
        url: `${host}${path}`,
        method,
        data
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(201);
        expect(result.data.hasOwnProperty('id')).toBe(true);
        test2UserId = result.data.id;
    } catch (err) {
        console.log(err.message);
    }
});

test('When I authenticate with user2, then I should get the JWT token', async () => {
    expect.assertions(2);
    const method = 'POST';
    const path = '/auth';
    const data = {
        email: test2Username,
        password: test2Password
    };
    const config = {
        url: `${host}${path}`,
        method,
        data
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('accessToken')).toBe(true);
        test2ValidToken = result.data.accessToken;
    } catch (err) {
        console.log(err.message);
    }
});

test('When I get list of datapoints, then I should get 0 entries', async () => {
    expect.assertions(8);
    const method = 'GET';
    const path = '/datapoints';
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test2ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
        expect(result.data.hasOwnProperty('count')).toBe(true);
        expect(result.data.hasOwnProperty('limit')).toBe(true);
        expect(result.data.hasOwnProperty('page')).toBe(true);
        expect(result.data.hasOwnProperty('resources')).toBe(true);
        expect(result.data.count).toEqual(0);
        expect(result.data.limit).toEqual(10);
        expect(result.data.resources.length).toEqual(0);
    } catch (err) {
        console.log(err.message);
    }
});

//
// Delete users
//
test('When I delete user1, then I should get back status 200', async () => {
    expect.assertions(1);
    const method = 'DELETE';
    const path = `/users/${test1UserId}`;
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test1ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
    } catch (err) {
        console.log(err.message);
    }
});

test('When I delete user2, then I should get back status 200', async () => {
    expect.assertions(1);
    const method = 'DELETE';
    const path = `/users/${test2UserId}`;
    const config = {
        url: `${host}${path}`,
        method,
        headers: { Authorization: `Bearer ${test2ValidToken}` }
    };
    let result;
    try {
        result = await axios(config);
        expect(result.status).toEqual(200);
    } catch (err) {
        console.log(err.message);
    }
});
