'use strict';

async function updatePartner() {
    try {
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

        document.querySelector('#login-button').style.display = 'none';
        document.querySelector('#logout-button').style.display = 'block';

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
        alert(error.response.statusText || 'An error has occurred!');
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
                $('.card-id input').val(user.cardId);
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

$('#logout-button > a').on('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.replace('/');
});