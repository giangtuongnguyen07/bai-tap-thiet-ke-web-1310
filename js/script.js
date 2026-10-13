document.addEventListener('DOMContentLoaded', function () {
    // 1. Xử lý Toggle Menu Mobile
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });
    }

    // 2. Lấy các phần tử Form & TỔNG TIỀN
    const fullnameInput = document.getElementById('fullname');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');

    const fullnameError = document.getElementById('fullname-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');
    const cakeError = document.getElementById('cake-error');

    const totalPriceDisplay = document.getElementById('total-price');
    const modalTotalDisplay = document.getElementById('modal-total-display');

    const orderForm = document.getElementById('order-form');
    const successModal = document.getElementById('success-modal');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    // 3. TÍNH TỔNG TIỀN TỰ ĐỘNG THEO THỜI GIAN THỰC (REAL-TIME TOTAL)
    function calculateTotalPrice() {
        let total = 0;
        const cakeRows = document.querySelectorAll('.cake-checkbox');

        cakeRows.forEach(checkbox => {
            if (checkbox.checked) {
                const price = parseInt(checkbox.getAttribute('data-price')) || 0;
                // Lấy ô số lượng tương ứng trong cùng hàng
                const parentRow = checkbox.closest('div.flex');
                const qtyInput = parentRow ? parentRow.querySelector('.cake-qty') : null;
                const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

                total += price * qty;
            }
        });

        // Định dạng tiền tệ dạng VND (vd: 350.000đ)
        const formattedTotal = total.toLocaleString('vi-VN') + 'đ';
        if (totalPriceDisplay) {
            totalPriceDisplay.textContent = formattedTotal;
        }
        return formattedTotal;
    }

    // Lắng nghe sự kiện thay đổi trên các ô Checkbox & ô Số lượng
    const allCheckboxes = document.querySelectorAll('.cake-checkbox');
    const allQtyInputs = document.querySelectorAll('.cake-qty');

    allCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateTotalPrice);
    });

    allQtyInputs.forEach(qty => {
        qty.addEventListener('input', calculateTotalPrice);
        qty.addEventListener('change', calculateTotalPrice);
    });

    // Tính toán lần đầu khi load trang
    calculateTotalPrice();

    // Chặn nhập chữ ở ô Số điện thoại
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }

            if (this.value.length > 0 && this.value.length < 10) {
                phoneError.classList.remove('hidden');
            } else {
                phoneError.classList.add('hidden');
            }
        });
    }

    // 4. Xử lý Validation & Hiển thị Modal khi Submit
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            // Kiểm tra Tên
            if (!fullnameInput.value.trim()) {
                isValid = false;
                fullnameError.classList.remove('hidden');
            } else {
                fullnameError.classList.add('hidden');
            }

            // Kiểm tra Số điện thoại (10 số)
            if (phoneInput.value.trim().length !== 10) {
                isValid = false;
                phoneError.classList.remove('hidden');
            } else {
                phoneError.classList.add('hidden');
            }

            // Kiểm tra Địa chỉ
            if (!addressInput.value.trim()) {
                isValid = false;
                addressError.classList.remove('hidden');
            } else {
                addressError.classList.add('hidden');
            }

            // Kiểm tra chọn ít nhất 1 loại bánh
            const isCakeSelected = Array.from(allCheckboxes).some(cb => cb.checked);
            if (!isCakeSelected) {
                isValid = false;
                if (cakeError) cakeError.classList.remove('hidden');
            } else if (cakeError) {
                cakeError.classList.add('hidden');
            }

            // Nếu hợp lệ -> Hiển thị Modal Liquid Glass
            if (isValid) {
                const finalTotal = calculateTotalPrice();
                if (modalTotalDisplay) {
                    modalTotalDisplay.textContent = finalTotal;
                }
                showSuccessModal();
            }
        });
    }

    // Hiển thị Popup Modal
    function showSuccessModal() {
        successModal.classList.remove('hidden');
        setTimeout(() => {
            successModal.classList.remove('opacity-0');
            const modalBox = successModal.querySelector('div');
            if (modalBox) modalBox.classList.remove('scale-95');
        }, 10);
    }

    // Đóng Popup Modal & Reset Form
    function hideSuccessModal() {
        const modalBox = successModal.querySelector('div');
        if (modalBox) modalBox.classList.add('scale-95');
        successModal.classList.add('opacity-0');

        setTimeout(() => {
            successModal.classList.add('hidden');
            if (orderForm) {
                orderForm.reset();
                calculateTotalPrice(); // Đưa tổng tiền về lại trạng thái ban đầu
            }
        }, 300);
    }

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', hideSuccessModal);
    }
});