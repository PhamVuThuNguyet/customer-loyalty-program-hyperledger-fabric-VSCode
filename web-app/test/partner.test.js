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

describe('Testing partner API', () => {
    describe('[POST] /api/partners/register', () => {
        it('[Fail]: Enter access key', (done) => {
            const partner = {
                name: 'VKU',
                partnerid: 998877,
                cardid: '',
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter access key');
                    done();
                });
        });

        it('[Fail]: Access key can be letters and numbers only', (done) => {
            const partner = {
                name: 'VKU',
                partnerid: 998877,
                cardid: '123a@@1',
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Access key can be letters and numbers only'
                    );
                    done();
                });
        });

        it('[Fail]: Enter partner id', (done) => {
            const partner = {
                name: 'VKU',
                partnerid: '',
                cardid: '123abc',
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter partner id');
                    done();
                });
        });

        it('[Fail]: Partner id can be letters and numbers only', (done) => {
            const partner = {
                name: 'VKU',
                partnerid: '123@@',
                cardid: '123abc',
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Partner id can be letters and numbers only'
                    );
                    done();
                });
        });

        it('[Fail]: Enter company name', (done) => {
            const partner = {
                name: '',
                partnerid: gen(),
                cardid: gen(),
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal('Enter company name');
                    done();
                });
        });

        it('[Fail]: Company name must be letters only', (done) => {
            const partner = {
                name: 'ava@@1',
                partnerid: gen(),
                cardid: gen(),
            };

            chai.request(server)
                .post('/api/partners/register')
                .send(partner)
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(400);
                    expect(res.statusMessage).to.equal(
                        'Company name must be letters only'
                    );
                    done();
                });
        });
    });
});
