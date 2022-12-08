/**
 * VKU_NPC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { toast } from './toast.js';

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1/htphong02/upload';
const CLOUDINARY_UPLOAD_PRESET = 'q64yqoyh';
const CLOUDINARY_FOLDER = 'hyperledger';

let fileInput = document.querySelector('.custom-file-input');
let fileLabel = document.querySelector('.custom-file-label');

fileInput.addEventListener('change', (e) => {
    const fileName = fileInput.value.split('\\').pop();
    fileLabel.textContent = fileName;
});

async function getProductList() {
    const partnerId = $('.partner-id input').val();
    const { data: productData } = await axios.get(
        '/api/products/partner/P' + partnerId
    );

    $('.items').html(function () {
        let str = '';
        for (let i = 0; i < productData.length; i++) {
            str += `<div class="item col-md-12 mb-1">
            <label class="product-label" for="${productData[i]._id}">
            <div class="card card-${productData[i]._id}">
              <div class="row no-gutters">
                <div class="row-md-4">
                  <img class="group list-group-image" src="${productData[i].image}" alt="" />
                </div>
                <div class="col-md-8">
                    <div class="card-body p-3">
                    <h5 class="card-title">
                        ${productData[i].name}
                    </h5>
                    <h5 class="price-text card-text font-weight-bold">
                      Price: ${productData[i].price} dollars or ${productData[i].price * 10} points
                    </h5>
                    <input class="product-checkbox" data-id="${productData[i]._id}" type="checkbox" id="${productData[i]._id}" name="${productData[i].name}" value="${productData[i].price}" hidden/>
                  </div>
                </div>
              </div>
            </div>
            </label>
          </div>`;
            // str =
            //   str +
            //   '<input type="checkbox" id="' +
            //   productData[i]._id +
            //   '" name="' +
            //   productData[i].name +
            //   '" value="' +
            //   productData[i].price +
            //   '">' +
            //   '<label for="' +
            //   productData[i]._id +
            //   '"> Buy ' +
            //   productData[i].name +
            //   " and get " +
            //   productData[i].price +
            //   " points</label><br>";
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

        if ($(".items input[type=checkbox]:checked").length > 0) {
            $(".btn-confirm").prop('disabled', false);
        } else {
            $(".btn-confirm").prop('disabled', true);
        }
    });
}

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    const { data } = await axios.post(CLOUDINARY_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

$('#add-product-form').on('submit', async (e) => {
    e.preventDefault();
    try {
        document.getElementById('loader').style.display = 'flex';
        const partnerId = $('.partner-id input').val();

        $('#product-submit').attr('disabled', true);
        const name = $('#product-name').val();
        const price = $('#product-price').val();
        const file = $('#product-image').prop('files')[0];

        const data = await uploadFile(file);

        const newProduct = {
            partnerId: partnerId,
            name: name,
            price: price,
            image: data.url,
        };
        const token = localStorage.getItem('token');
        await axios.post('/api/products', newProduct, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast('success', 'Upload new product successful');
        await getProductList();
        $('#product-name').val('');
        $('#product-price').val('');
        $('#product-image').val('');
        $('.custom-file-label').text('Choose product image');
        $('#product-submit').attr('disabled', false);
        document.getElementById('loader').style.display = 'none';
    } catch (e) {
        document.getElementById('loader').style.display = 'none';
        toast('error', 'An error was occurred');
        $('#product-submit').attr('disabled', false);
    }
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

$('#logout-button > a').on('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.replace('/');
});

//check user input and call server
async function updatePartner() {
    try {
        //get user input data
        const partnerid = $('.partner-id input').val();
        const cardid = $('.card-id input').val();

        const inputData = {
            partnerid,
            cardid,
        };
        document.getElementById('loader').style.display = 'flex';
        const { data } = await axios.post('/api/partners/data', inputData);
        localStorage.setItem('token', data.token);
        document.getElementById('loader').style.display = 'none';
        $('.heading').html(function () {
            let str = '<h2><b> ' + data.name + ' </b></h2>';
            str = str + '<h2><b> ' + data.id + ' </b></h2>';

            return str;
        });
        //update dashboard
        $('.dashboards').html(function () {
            let str = '';
            str += `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3">
                        <div class="card-header">Total points allocated</div>
                        <div class="card-body">
                            <h5 class="card-title">${data.pointsGiven}</h5>
                            <p class="card-text">
                                Points given to customer by purchasing
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-white bg-success mb-3">
                        <div class="card-header">Total points redeemed</div>
                        <div class="card-body">
                            <h5 class="card-title">${data.pointsCollected}</h5>
                            <p class="card-text">
                                Points redeemed by customer
                            </p>
                        </div>
                    </div>
                </div>
            `;
            return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions table tbody').html(function () {
            let str = '';
            let transactionData = data.earnPointsResults;

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

        //Update product list
        getProductList();
        toggleLogoutButton();

        //remove login section
        document.getElementById('loginSection').style.display = 'none';
        //display transaction section
        document.getElementById('transactionSection').style.display = 'block';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        toast('error', 'Update Partner failed.');
    }
}

//check user input and call server
$('.sign-in-partner').click(() => updatePartner());

const checkLogin = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const { data: user } = await axios.get('/api/user-info', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            if (user.role === 'partner') {
                $('.partner-id input').val(user.id);
                $('.card-id input').val(user.cardid);
                await updatePartner();
            } else {
                location.replace('/member');
            }
        }
        document.querySelector('body').style.display = 'block';
    } catch (error) {
        document.querySelector('body').style.display = 'block';
        localStorage.removeItem('token');
    }
};

checkLogin();

async function earnPoints(points) {
    //get user input data

    const accountnumber = $('#client').val();
    const cardid = $('#client-card-id').val();
    const partnerid = $('.partner-id input').val();

    if (!accountnumber) {
        toast('error', "Enter client id first");
        return;
    }

    const inputData = {
        accountnumber,
        cardid,
        points,
        partnerid,
    };

    try {
        document.getElementById('loader').style.display = 'flex';
        await axios.post('/api/members/earn-points', inputData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        document.getElementById('loader').style.display = 'none';

        await updatePartner();
        toast("success", "Transaction successful");
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        toast("error", error.response.statusText);
    }
}

//check user input and call server
$('.earn-points-transaction').click(async function () {
    const clientid = $('#client').val();
    if (!clientid) {
        toast("error", "Please enter client ID");
    }

    const partnerid = $('.partner-id input').val();
    let productData = await axios.get('/api/products/partner/P' + partnerid);

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
        toast("error", "Please choose product to buy");
    }
});

async function usePoints(points) {
    //get user input data

    const accountnumber = $('#client').val();
    const cardid = $('#client-card-id').val();
    const partnerid = $('.partner-id input').val();

    if (!accountnumber) {
        toast("error", "Enter client id first");
        return;
    }

    const inputData = {
        accountnumber,
        cardid,
        points,
        partnerid,
    };

    try {
        document.getElementById('loader').style.display = 'flex';
        await axios.post('/api/members/use-points', inputData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        await updatePartner();
        toast("success", "Transaction successful");
        document.getElementById('loader').style.display = 'none';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        toast("error", error.response.statusText);
    }
}

$('.use-points-transaction').click(async function () {
    const clientid = $('#client').val();
    if (!clientid) {
        toast("error", "Please enter client ID first");
    }

    const partnerid = $('.partner-id input').val();

    let productData = await axios.get('/api/products/partner/P' + partnerid);
    console.log(productData);
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
        toast("error", "Plese choose product to buy");
    }
});
