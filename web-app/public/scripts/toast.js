export function toast(type, text) {
    const colors = {
        success: 'green',
        error: 'red',
    };
    Toastify({
        text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: 'top', // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
        style: {
            background: colors[type],
        },
        onClick: function () {}, // Callback after click
    }).showToast();
}