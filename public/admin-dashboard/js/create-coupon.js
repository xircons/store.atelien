document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('createCouponForm');
    const alertBox = document.getElementById('couponAlert');
    const alertMessage = document.getElementById('couponAlertMessage');
    const alertClose = document.getElementById('couponAlertClose');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/api/discounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showCouponAlert('Coupon created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'coupon-list.html';
                }, 3000);
            } else {
                showCouponAlert(result.error || 'Failed to create coupon.', 'error');
            }
        })
        .catch(() => {
            showCouponAlert('Failed to create coupon. Please try again.', 'error');
        });
    });

    function showCouponAlert(message, type = 'info') {
        if (!alertBox || !alertMessage || !alertClose) return;
        alertMessage.textContent = message;
        alertBox.classList.remove('hide');
        alertBox.classList.add('show');
        alertBox.classList.remove('success', 'error', 'info');
        alertBox.classList.add(type);
        alertClose.onclick = function() {
            hideCouponAlert();
        };
    }

    function hideCouponAlert() {
        if (!alertBox) return;
        alertBox.classList.add('hide');
        setTimeout(() => {
            alertBox.classList.remove('show', 'hide');
        }, 300);
    }
}); 