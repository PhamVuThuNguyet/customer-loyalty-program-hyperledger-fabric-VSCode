'use strict';

//check user input and call server
$('.sign-in-partner').click(async function () {
    try {
        const partnerid = $('.partner-id input').val();
        const cardid = $('.card-id input').val();

        const inputData = {
            partnerid,
            cardid,
        };
        document.getElementById('loader').style.display = 'block';
        const { data } = await axios.post('/api/partners/data', inputData);
        document.getElementById('loader').style.display = 'none';
        $('.heading').html(function () {
            let str = '<h2><b> ' + data.name + ' </b></h2>';
            str = str + '<h2><b> ' + data.id + ' </b></h2>';

            return str;
        });

        //update dashboard
        $('.dashboards').html(function () {
            let str = '';
            str =
                str +
                '<h5>Total points allocated to customers: ' +
                data.pointsGiven +
                ' </h5>';
            str =
                str +
                '<h5>Total points redeemed by customers: ' +
                data.pointsCollected +
                ' </h5>';
            return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions').html(function () {
            let str = '';
            let transactionData = data.earnPointsResults;

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

        //remove login section
        document.getElementById('loginSection').style.display = 'none';
        //display transaction section
        document.getElementById('transactionSection').style.display = 'block';
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        alert(error.response.statusText|| 'An error has occurred!');
    }
});
