/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index');

chai.use(chaiHttp);

describe('Testing common API', () => {
    describe('[POST] /api/user-info', () => {
        it('[Fail]: No token provider', (done) => {
            chai.request(server)
                .get('/api/user-info')
                .end((err, { res }) => {
                    expect(res.statusCode).to.equal(401);
                    expect(res.statusMessage).to.equal('No token provider');
                    done();
                });
        });
    });
});
