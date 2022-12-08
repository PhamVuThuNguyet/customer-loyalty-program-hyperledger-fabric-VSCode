'use strict';

import { toast } from './toast.js';

async function updateMember() {
    try {
        const accountnumber = $('.account-number input').val();
        const cardid = $('.card-id input').val();
        const inputData = {
            accountnumber,
            cardid,
        };
        document.getElementById('loader').style.display = 'flex';
        const { data } = await axios.post('/api/members/data', inputData);
        localStorage.setItem('token', data.token);

        toggleLogoutButton();
        
        document.getElementById('loader').style.display = 'none';
        $('.heading').html(function () {
            let str =
                '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
            str = str + '<h2><b>' + data.accountNumber + '</b></h2>';
            str = str + '<h2><b>' + data.points + '</b></h2>';

            return str;
        });

        //update partners dropdown for earn points transaction
        $('.earn-partner select').html(function () {
            let str =
                '<option value="" disabled="" selected="">select</option>';
            let partnersData = data.partnersData;
            for (let i = 0; i < partnersData.length; i++) {
                str =
                    str +
                    '<option partner-id=' +
                    partnersData[i].id +
                    '> ' +
                    partnersData[i].name +
                    '</option>';
            }
            return str;
        });

        //update partners dropdown for use points transaction
        $('.use-partner select').html(function () {
            let str =
                '<option value="" disabled="" selected="">select</option>';
            let partnersData = data.partnersData;
            for (let i = 0; i < partnersData.length; i++) {
                str =
                    str +
                    '<option partner-id=' +
                    partnersData[i].id +
                    '> ' +
                    partnersData[i].name +
                    '</option>';
            }
            return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions table tbody').html(function () {
            let str = '';
            let transactionData = data.earnPointsResult;

            for (let i = 0; i < transactionData.length; i++) {
                str += `
                    <tr>
                        <th scope="row"></th>
                        <td>${transactionData[i].timestamp}</td>
                        <td>${transactionData[i].partner}</td>
                        <td>${transactionData[i].member}</td>
                        <td>${transactionData[i].points}</td>
                        <td>${transactionData[i].transactionId}</td>
                    </tr>
                    `;
            }
            return str;
        });

        //update use points transaction
        $('.points-redeemed-transactions table tbody').html(function () {
            let str = '';

            let transactionData = data.usePointsResults;

            for (let i = 0; i < transactionData.length; i++) {
                str += `
                    <tr>
                        <th scope="row"></th>
                        <td>${transactionData[i].timestamp}</td>
                        <td>${transactionData[i].partner}</td>
                        <td>${transactionData[i].member}</td>
                        <td>${transactionData[i].points}</td>
                        <td>${transactionData[i].transactionId}</td>
                    </tr>
                    `;
            }
            return str;
        });

        //remove login section and display member page
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('transactionSection').style.display = 'block';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        alert(error.response.statusText || 'An error has occurred!');
    }
}

//check user input and call server
$('.sign-in-member').click(function () {
    updateMember();
});

async function earnPoints(points) {
    try {
        const accountnumber = $('.account-number input').val();
        const cardid = $('.card-id input').val();
        const partnerid = $('.earn-partner select')
            .find(':selected')
            .attr('partner-id');
        if (!partnerid) {
            alert('Select partner first');
            return;
        }

        const inputData = {
            accountnumber,
            cardid,
            partnerid,
            points,
        };
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('infoSection').style.display = 'none';
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
            return;
        }
        await axios.post('/api/members/earn-points', inputData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        updateMember();
        alert('Transaction successful');
        document.getElementById('loader').style.display = 'none';
        document.getElementById('infoSection').style.display = 'block';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('infoSection').style.display = 'block';
        alert(error.response.statusText || 'An error has occurred!');
    }
}

$('.earn-partner select').on('change', async function () {
    //update items
    const partnerid = $('.earn-partner select').find(':selected').attr('partner-id');

    if (!partnerid) {
        return;
    }

    let productData = await axios.get('api/products/partner' + partnerid);

    productData = productData.data;

    $('items').html(function () {
        let str = '';
        for (let i = 0; i < productData.length; i++) {
            str += `<div class="item col-md-4 mb-3">
                        <label class="product-label" for="${productData[i]._id}">
                            <div class="card card-${productData[i]._id}">
                                <img class="group list-group-image" src="${productData[i].image}" alt="" />
                                <div class="card-header">
                                    <h5 class="card-title">
                                        ${productData[i].name}
                                    </h5>
                                </div>
                                <div class="card-body p-3">
                                    <h5 class="price-text card-text font-weight-bold">
                                        Price: $${productData[i].price}
                                    </h5>
                                    <input class="product-checkbox" data-id="${productData[i]._id}" type="checkbox" id="${productData[i]._id}" name="${productData[i].name}" value="${productData[i].price}" hidden/>
                                </div>
                            </div>
                        </label>
                    </div>`;
        }
        return str;
    });

    $('.product-checkbox').on('change', function () {
        const productId = $(this).attr('data-id');
        const isChecked = $(this).prop('checked');
        if (isChecked) {
            $(`.card-${productId}`).addClass('active');
        } else {
            $(`.card-${productId}`).removeClass('active');
        }
        if ($('.items input[type=checkbox]:checked').length > 0) {
            $('#purchase-btn').prop('disabled', false);
        } else {
            $('#purchase-btn').prop('disabled', true);
        }
    });

});

//check user input and call server
$('.earn-points-transaction').click(async function () {
    const partnerid = $('.earn-partner select').find(':selected').attr('partner-id');

    if (!partnerid) {
        return;
    }

    let productData = await axios.get('/api/products/partner/' + partnerid);
    productData = productData.data;
    let totalPoint = 0;
    for (let i = 0; i < productData.length; i++) {
        if ($('#' + productData[i]._id).is(':checked')) {
            totalPoint += parseInt(productData[i].price);
        }
    }
    if (totalPoint > 0) {
        earnPoints(totalPoint);
    } else {
        alert('Please choose product to buy');
    }
});

async function usePoints(points) {
    try {
        const accountnumber = $('.account-number input').val();
        const cardid = $('.card-id input').val();
        const partnerid = $('.use-partner select')
            .find(':selected')
            .attr('partner-id');

        if (!partnerid) {
            alert('Select partner first');
            return;
        }

        const inputData = {
            accountnumber,
            cardid,
            partnerid,
            points,
        };
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('infoSection').style.display = 'none';
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
            return;
        }
        await axios.post('/api/members/use-points', inputData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        document.getElementById('loader').style.display = 'none';
        document.getElementById('infoSection').style.display = 'block';
        updateMember();
        alert('Transaction successful');
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('infoSection').style.display = 'block';
        alert(error.response.statusText || 'An error has occurred!');
    }
}

$('.use-partner select').on('change', async function () {
    //update items
    const partnerid = $('.use-partner select')
        .find(':selected')
        .attr('partner-id');
    if (!partnerid) {
        return;
    }

    let productData = await axios.get('/api/products/partner/' + partnerid);

    productData = productData.data;

    console.log(productData[0]);

    $('.items-redeem').html(function () {
        let str = '';

        for (let i = 0; i < productData.length; i++) {
            str += `<div class="item col-md-4 mb-3">
                        <label class="product-label" for="${productData[i]._id}">
                            <div class="card card-${productData[i]._id}">
                                <img class="group list-group-image" src="${productData[i].image}" alt="" />
                                <div class="card-header">
                                    <h5 class="card-title">
                                        ${productData[i].name}
                                    </h5>
                                </div>
                                <div class="card-body p-3">
                                    <h5 class="point-text card-text font-weight-bold">
                                        Points: ${productData[i].price * 10}
                                    </h5>
                                    <input class="product-checkbox-redeem" data-id="${productData[i]._id}" type="checkbox" id="${productData[i]._id}" name="${productData[i].name}" value="${productData[i].price}" hidden/>
                                </div>
                            </div>
                        </label>
                    </div>`;
        }
        return str;
    });

    $('.product-checkbox-redeem').on('change', function () {
        const productId = $(this).attr('data-id');
        const isChecked = $(this).prop('checked');
        if (isChecked) {
            $(`.card-${productId}`).addClass('active');
        } else {
            $(`.card-${productId}`).removeClass('active');
        }
        if ($('.items-redeem input[type=checkbox]:checked').length > 0) {
            $('#redeem-btn').prop('disabled', false);
        } else {
            $('#redeem-btn').prop('disabled', true);
        }
    });

});


//check user input and call server
$('.use-points-transaction').click(async function () {
    const partnerid = $('.use-partner select')
        .find(':selected')
        .attr('partner-id');
    if (!partnerid) {
        return;
    }

    let productData = await axios.get('/api/products/partner/' + partnerid);

    productData = productData.data;
    let totalPoint = 0;
    for (let i = 0; i < productData.length; i++) {
        if ($('#' + productData[i]._id).is(':checked')) {
            totalPoint += parseInt(productData[i].price);
        }
    }
    if (totalPoint > 0) {
        usePoints(totalPoint);
    } else {
        alert('Please choose product to get');
    }
});

async function checkLogin() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const { data } = await axios.post(
                '/api/user-info',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (data.role === 'member') {
                $('.account-number input').val(data.id);
                $('.card-id input').val(data.cardid);
                await updateMember();
                document.querySelector('body').style.display = 'block';
            } else {
                window.location.replace('/partner');
            }
        } catch (error) {
            localStorage.removeItem('token');
            alert('Your session is expired');
            document.querySelector('body').display = 'block';
        }
    } else {
        document.querySelector('body').style.display = 'block';
    }
}

checkLogin();

$('#logout-button > a').on('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.replace('/');
});

function toggleLogoutButton() {
    const token = localStorage.getItem('token');
    if (token) {
        $('#logout-button').css({ display: 'block' });
        $('#login-button').css({ display: 'none' });
    } else {
        $('#logout-button').css({ display: 'none' });
        $('#login-button').css({ display: 'block' });
    }
}