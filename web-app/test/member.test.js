/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index');

const rn = require('random-number');
const gen = rn.generator({
    min: 100000,
    max: 999999999,
    integer: true,
});

chai.use(chaiHttp);

describe('Testing Member API', () => {
    describe('[POST] /api/members/register', () => {
        it('[Fail]: Account number must be at least six digits long', (done) => {
            const member = {
                accountnumber: 1234,
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Account number must be at least six digits long'
                    );
                    done();
                });
        });

        it('[Fail]: Account number must be all numbers', (done) => {
            const member = {
                accountnumber: 12312321.22,
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Account number must be all numbers'
                    );
                    done();
                });
        });

        it('[Fail]: Enter access key', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: '',
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter access key');
                    done();
                });
        });

        it('[Fail]: Card id can be letters and numbers only', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: '123123#a',
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Card id can be letters and numbers only'
                    );
                    done();
                });
        });

        it('[Fail]: Enter first name', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: '',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter first name');
                    done();
                });
        });

        it('[Fail]: First name must be letters only', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho123',
                lastname: 'Phong',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'First name must be letters only'
                    );
                    done();
                });
        });

        it('[Fail]: Enter last name', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: '',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter last name');
                    done();
                });
        });

        it('[Fail]: Last name must be letters only', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong123',
                email: 'test@example.com',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Last name must be letters only'
                    );
                    done();
                });
        });

        it('[Fail]: Enter email', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: '',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter email');
                    done();
                });
        });

        it('[Fail]: Enter valid email', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'ava2@@#om.co',
                phonenumber: 1231231234,
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter valid email');
                    done();
                });
        });

        it('[Fail]: Enter phone number', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'example@gmail.com',
                phonenumber: '',
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter phone number');
                    done();
                });
        });

        it('[Fail]: Enter valid phone number', (done) => {
            const member = {
                accountnumber: gen(),
                cardid: gen(),
                firstname: 'Ho',
                lastname: 'Phong',
                email: 'example@gmail.com',
                phonenumber: '123123a123a',
            };

            chai.request(server)
                .post('/api/members/register')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Enter valid phone number'
                    );
                    done();
                });
        });
    });

    describe('[POST] /api/members/data', () => {
        it('[Fail]: Password is not correct', (done) => {
            const member = {
                accountnumber: 123123,
                cardid: gen(),
            };

            chai.request(server)
                .post('/api/members/data')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });
    });

    describe('[POST] /api/members/earn-points', () => {
        it('[Fail]: No token provider', (done) => {
            const member = {
                accountnumber: 123123,
                cardid: gen(),
                partnerid: 111111,
                points: 12,
            };

            chai.request(server)
                .post('/api/members/earn-points')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(401);
                    expect(res.statusMessage).to.equal('No token provider');
                    done();
                });
        });

        it('[Fail]: Points must be number', (done) => {
            const member = {
                accountnumber: 123123,
                cardid: gen(),
                partnerid: 111111,
                points: 'ababa',
            };

            chai.request(server)
                .post('/api/members/earn-points')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMTIzMTIzIiwiY2FyZGlkIjoiMTIzMTIzIiwicm9sZSI6Im1lbWJlciJ9LCJpYXQiOjE2NzAwNDk4MjksImV4cCI6MTY3MDY1NDYyOX0.Of0cm3lxn_-4VeawZMVEnedM5puQrzbVj-JD-U2tHJE'
                )
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Points must be number');
                    done();
                });
        });
    });

    describe('[POST] /api/members/use-points', () => {
        it('[Fail]: No token provider', (done) => {
            const member = {
                accountnumber: 123123,
                cardid: gen(),
                partnerid: 111111,
                points: 12,
            };

            chai.request(server)
                .post('/api/members/use-points')
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(401);
                    expect(res.statusMessage).to.equal('No token provider');
                    done();
                });
        });

        it('[Fail]: Points must be number', (done) => {
            const member = {
                accountnumber: 123123,
                cardid: gen(),
                partnerid: 111111,
                points: 'ababa',
            };

            chai.request(server)
                .post('/api/members/use-points')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMTIzMTIzIiwiY2FyZGlkIjoiMTIzMTIzIiwicm9sZSI6Im1lbWJlciJ9LCJpYXQiOjE2NzAwNDk4MjksImV4cCI6MTY3MDY1NDYyOX0.Of0cm3lxn_-4VeawZMVEnedM5puQrzbVj-JD-U2tHJE'
                )
                .send(member)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Points must be number');
                    done();
                });
        });
    });
});
