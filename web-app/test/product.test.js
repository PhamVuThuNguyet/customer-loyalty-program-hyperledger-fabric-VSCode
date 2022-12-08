/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index');

chai.use(chaiHttp);

describe('Testing product API', () => {
    describe('[POST] /api/products', () => {
        it('[Fail]: No token provider', (done) => {
            const product = {
                partnerId: '',
                name: 'Product',
                price: 12,
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(401);
                    expect(res.statusMessage).to.equal('No token provider');
                    done();
                });
        });

        it('[Fail]: Forbidden', (done) => {
            const product = {
                partnerId: '',
                name: 'Product',
                price: 12,
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMTIzMTIzIiwiY2FyZGlkIjoiMTIzMTIzIiwicm9sZSI6Im1lbWJlciJ9LCJpYXQiOjE2NzAwNDk4MjksImV4cCI6MTY3MDY1NDYyOX0.Of0cm3lxn_-4VeawZMVEnedM5puQrzbVj-JD-U2tHJE'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(403);
                    expect(res.statusMessage).to.equal('Forbidden');
                    done();
                });
        });

        it('[Fail]: Enter partner id', (done) => {
            const product = {
                partnerId: '',
                name: 'Product',
                price: 12,
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNhcmRpZCI6IjEyMzEyMyIsInJvbGUiOiJwYXJ0bmVyIn0sImlhdCI6MTY3MDA1Mjc1NiwiZXhwIjoxNjcwNjU3NTU2fQ.x5Cqnidj98rI41kyt6V5oFVjFfQIyaeEPkBEnyF5-Ao'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter partner id');
                    done();
                });
        });

        it('[Fail]: Enter product name', (done) => {
            const product = {
                partnerId: 123123,
                name: '',
                price: 12,
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNhcmRpZCI6IjEyMzEyMyIsInJvbGUiOiJwYXJ0bmVyIn0sImlhdCI6MTY3MDA1Mjc1NiwiZXhwIjoxNjcwNjU3NTU2fQ.x5Cqnidj98rI41kyt6V5oFVjFfQIyaeEPkBEnyF5-Ao'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter product name');
                    done();
                });
        });

        it('[Fail]: Price must be number', (done) => {
            const product = {
                partnerId: 123123,
                name: 'Product',
                price: '123a',
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNhcmRpZCI6IjEyMzEyMyIsInJvbGUiOiJwYXJ0bmVyIn0sImlhdCI6MTY3MDA1Mjc1NiwiZXhwIjoxNjcwNjU3NTU2fQ.x5Cqnidj98rI41kyt6V5oFVjFfQIyaeEPkBEnyF5-Ao'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Price must be number');
                    done();
                });
        });

        it('[Fail]: Enter image url', (done) => {
            const product = {
                partnerId: 123123,
                name: 'Product',
                price: 12,
                image: '',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNhcmRpZCI6IjEyMzEyMyIsInJvbGUiOiJwYXJ0bmVyIn0sImlhdCI6MTY3MDA1Mjc1NiwiZXhwIjoxNjcwNjU3NTU2fQ.x5Cqnidj98rI41kyt6V5oFVjFfQIyaeEPkBEnyF5-Ao'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter image url');
                    done();
                });
        });

        it('[OK]: Upload new product successful', (done) => {
            const product = {
                partnerId: 123123,
                name: 'Product',
                price: 12,
                image: 'https://image.png',
            };

            chai.request(server)
                .post('/api/products')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNhcmRpZCI6IjEyMzEyMyIsInJvbGUiOiJwYXJ0bmVyIn0sImlhdCI6MTY3MDA1Mjc1NiwiZXhwIjoxNjcwNjU3NTU2fQ.x5Cqnidj98rI41kyt6V5oFVjFfQIyaeEPkBEnyF5-Ao'
                )
                .send(product)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(201);
                    expect(res.statusMessage).to.equal('Created');
                    done();
                });
        });
    });

    describe('[GET] /api/products/partner/:partnerId', () => {
        it('[OK]: Get product successful', (done) => {
            chai.request(server)
                .get('/api/products/partner/123123')
                .end((err, { res }) => {
                    expect(Array.isArray(JSON.parse(res.text))).to.be.true;
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });
});
