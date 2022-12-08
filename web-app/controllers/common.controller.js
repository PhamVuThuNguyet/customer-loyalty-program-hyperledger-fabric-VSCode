/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

class CommonController {

    /**
   * @dev [GET] /api/user-info
   * @notice API to get user infor
   * @param {*} req Request from client
   * @param {*} res Response to client
   * @returns status 200 if successful, 500 if error
   */
    async userInfo(req, res) {
        try {
            res.json(req.user);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = new CommonController();
