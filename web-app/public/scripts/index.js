'use strict';

const checkLogin = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const { data: user } = await axios.get('/api/user-info', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            if (user.role === 'member') {
                location.replace('/member');
            } else {
                location.replace('/partner');
            }
        } else {
            document.querySelector('body').style.display = 'block';
        }
    } catch (error) {
        document.querySelector('body').style.display = 'block';
        localStorage.removeItem('token');
    }
};

checkLogin();
