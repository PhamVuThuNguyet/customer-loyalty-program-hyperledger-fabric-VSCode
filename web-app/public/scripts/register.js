/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//check user input and call server to create dataset
$('.register-member').click(async function () {
    try {
        const accountnumber = $('.account-number input').val();
        const cardid = $('.card-id input').val();
        const firstname = $('.first-name input').val();
        const lastname = $('.last-name input').val();
        const email = $('.email input').val();
        const phonenumber = $('.phone-number input').val();

        const inputData = {
            accountnumber,
            cardid,
            firstname,
            lastname,
            email,
            phonenumber,
        };
        document.getElementById('registration').style.display = 'none';
        document.getElementById('loader').style.display = 'flex';
        await axios.post('/api/members/register', inputData);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('successful-registration').style.display =
            'block';
        document.getElementById('registration-info').style.display = 'none';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        alert(error.response.statusText || 'An error has occurred!');
    }
});

//check user input and call server to create dataset
$('.register-partner').click(async function () {
    //get user input data
    const name = $('.name input').val();
    const partnerid = $('.partner-id input').val();
    const cardid = $('.card-id input').val();

    const data = {
        name,
        partnerid,
        cardid,
    };

    try {
        document.getElementById('registration').style.display = 'none';
        document.getElementById('loader').style.display = 'flex';
        await axios.post('/api/partners/register', data);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('successful-registration').style.display =
            'block';
        document.getElementById('registration-info').style.display = 'none';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('registration').style.display = 'block';
        alert(error.response.statusText || 'An error has occurred!');
    }
});
