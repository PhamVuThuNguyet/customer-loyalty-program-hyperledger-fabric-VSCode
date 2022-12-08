'use strict';

async function updateMember() {
    try {
        const accountnumber = $('.account-number input').val();
        const cardid = $('.card-id input').val();

        const inputData = {
            accountnumber,
            cardid,
        };
        document.getElementById('loader').style.display = 'block';
        const { data } = await axios.post('/api/members/data', inputData);
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
        $('.points-allocated-transactions').html(function () {
            let str = '';
            let transactionData = data.earnPointsResult;

            for (let i = 0; i < transactionData.length; i++) {
                str =
                    str +
                    '<p>timeStamp: ' +
                    transactionData[i].timestamp +
                    '<br />partner: ' +
                    transactionData[i].partner +
                    '<br />member: ' +
                    transactionData[i].member +
                    '<br />points: ' +
                    transactionData[i].points +
                    '<br />transactionID: ' +
                    transactionData[i].transactionId +
                    '</p><br>';
            }
            return str;
        });

        //update use points transaction
        $('.points-redeemed-transactions').html(function () {
            let str = '';

            let transactionData = data.usePointsResults;

            for (let i = 0; i < transactionData.length; i++) {
                str =
                    str +
                    '<p>timeStamp: ' +
                    transactionData[i].timestamp +
                    '<br />partner: ' +
                    transactionData[i].partner +
                    '<br />member: ' +
                    transactionData[i].member +
                    '<br />points: ' +
                    transactionData[i].points +
                    '<br />transactionID: ' +
                    transactionData[i].transactionId +
                    '</p><br>';
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
        document.getElementById('loader').style.display = 'block';
        document.getElementById('infoSection').style.display = 'none';
        await axios.post('/api/members/earn-points', inputData);
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

$('.earn-points-30').click(function () {
    earnPoints(30);
});

$('.earn-points-80').click(function () {
    earnPoints(80);
});

$('.earn-points-200').click(function () {
    earnPoints(200);
});

//check user input and call server
$('.earn-points-transaction').click(function () {
    let formPoints = $('.earnPoints input').val();
    earnPoints(formPoints);
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
        document.getElementById('loader').style.display = 'block';
        document.getElementById('infoSection').style.display = 'none';
        await axios.post('/api/members/use-points', inputData);
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

$('.use-points-50').click(function () {
    usePoints(50);
});

$('.use-points-150').click(function () {
    usePoints(150);
});

$('.use-points-200').click(function () {
    usePoints(200);
});

//check user input and call server
$('.use-points-transaction').click(function () {
    const formPoints = $('.usePoints input').val();
    usePoints(formPoints);
});
