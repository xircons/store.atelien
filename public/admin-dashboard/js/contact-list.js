document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/admin/contact-messages')
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to fetch messages');
            renderContactMessages(data.messages);
        })
        .catch(err => showAlert(err.message));

    function renderContactMessages(messages) {
        const container = document.getElementById('contactItems');
        if (!messages.length) {
            container.innerHTML = '<div style="padding:1em;">No contact messages found.</div>';
            return;
        }
        container.innerHTML = '';
        messages.forEach(msg => {
            const row = document.createElement('div');
            row.className = 'product-row';
            row.setAttribute('data-product-id', msg.id);
            // Determine color class for select
            let selectColorClass = '';
            if (msg.status === 'New') selectColorClass = 'status-select-red';
            else if (msg.status === 'Read') selectColorClass = 'status-select-blue';
            else if (msg.status === 'Responded') selectColorClass = 'status-select-green';
            row.innerHTML = `
                <div class="product-item">
                    <span class="header-product">${msg.id}</span>
                    <span class="header-price">${escapeHtml(msg.name)}</span>
                    <span class="header-category">${escapeHtml(msg.email)}</span>
                    <span class="header-message">${escapeHtml(msg.message)}</span>
                    <span class="header-date">${formatDate(msg.submitted_at)}</span>
                    <span class="header-status">
                        <div class="status-container">
                            <span class="status-dot ${getStatusDotClass(msg.status)}"></span>
                            <div style="display: flex; align-items: center; gap: 2px;">
                                <select class="status-select ${selectColorClass}" data-id="${msg.id}" data-current-status="${msg.status}">
                                    <option value="New" ${msg.status === 'New' ? 'selected' : ''}>New</option>
                                    <option value="Read" ${msg.status === 'Read' ? 'selected' : ''}>Read</option>
                                    <option value="Responded" ${msg.status === 'Responded' ? 'selected' : ''}>Responded</option>
                                </select>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                        </div>
                    </span>
                </div>`;
            container.appendChild(row);
        });
        // Add event listeners for dropdowns (update dot color and text color on change)
        container.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', function(e) {
                const dot = this.parentElement.parentElement.querySelector('.status-dot');
                const previousStatus = select.getAttribute('data-current-status') || 'New';
                const newStatus = this.value;
                // Update select color
                this.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                if (newStatus === 'New') this.classList.add('status-select-red');
                else if (newStatus === 'Read') this.classList.add('status-select-blue');
                else if (newStatus === 'Responded') this.classList.add('status-select-green');
                // Ask server for confirmation message
                fetch('/api/admin/confirm-update-contact-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageId: select.getAttribute('data-id'), status: newStatus })
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) throw new Error(data.message || 'Failed to get confirmation');
                    if (confirm(data.message)) {
                        // User confirmed, update dot and send update
                        dot.className = 'status-dot ' + getStatusDotClass(newStatus);
                        select.setAttribute('data-current-status', newStatus);
                        fetch('/api/admin/update-contact-status', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ messageId: select.getAttribute('data-id'), status: newStatus })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                showContactAlert('Status updated successfully!', 'success');
                            } else {
                                showContactAlert('Failed to update status: ' + (data.message || 'Unknown error'), 'error');
                                select.value = previousStatus;
                                dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
                                select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                                if (previousStatus === 'New') select.classList.add('status-select-red');
                                else if (previousStatus === 'Read') select.classList.add('status-select-blue');
                                else if (previousStatus === 'Responded') select.classList.add('status-select-green');
                            }
                        })
                        .catch(err => {
                            showContactAlert('Error updating status: ' + err.message, 'error');
                            select.value = previousStatus;
                            dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
                            select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                            if (previousStatus === 'New') select.classList.add('status-select-red');
                            else if (previousStatus === 'Read') select.classList.add('status-select-blue');
                            else if (previousStatus === 'Responded') select.classList.add('status-select-green');
                        });
                    } else {
                        // User cancelled, revert
                        select.value = previousStatus;
                        dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
                        select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                        if (previousStatus === 'New') select.classList.add('status-select-red');
                        else if (previousStatus === 'Read') select.classList.add('status-select-blue');
                        else if (previousStatus === 'Responded') select.classList.add('status-select-green');
                    }
                })
                .catch(err => {
                    showContactAlert('Error: ' + err.message, 'error');
                    select.value = previousStatus;
                    dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
                    select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                    if (previousStatus === 'New') select.classList.add('status-select-red');
                    else if (previousStatus === 'Read') select.classList.add('status-select-blue');
                    else if (previousStatus === 'Responded') select.classList.add('status-select-green');
                });
            });
        });
        // Make .status-container clickable to open the select
        container.querySelectorAll('.status-container').forEach(containerEl => {
            containerEl.addEventListener('click', function(e) {
                const select = this.querySelector('.status-select');
                if (e.target !== select) {
                    select.focus();
                    select.click();
                }
            });
        });
    }

    function getStatusDotClass(status) {
        switch (status) {
            case 'New': return 'dot-red';
            case 'Read': return 'dot-blue';
            case 'Responded': return 'dot-green';
            default: return '';
        }
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    function showAlert(message) {
        const alertBox = document.getElementById('contactAlert');
        const alertMsg = document.getElementById('contactAlertMessage');
        alertMsg.textContent = message;
        alertBox.style.display = 'block';
        document.getElementById('contactAlertClose').onclick = () => {
            alertBox.style.display = 'none';
        };
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    function updateStatus(messageId, newStatus) {
        const confirmMessage = `Are you sure you want to update the status to "${newStatus}"?`;
        if (!confirm(confirmMessage)) {
            // Reset the select to previous value if user cancels
            const select = document.querySelector(`select[data-id="${messageId}"]`);
            const currentStatus = select.getAttribute('data-current-status') || 'New';
            select.value = currentStatus;
            // Update select color
            select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
            if (currentStatus === 'New') select.classList.add('status-select-red');
            else if (currentStatus === 'Read') select.classList.add('status-select-blue');
            else if (currentStatus === 'Responded') select.classList.add('status-select-green');
            return;
        }

        // Update the dot color and select color immediately
        const select = document.querySelector(`select[data-id="${messageId}"]`);
        const dot = select.parentElement.parentElement.querySelector('.status-dot');
        dot.className = 'status-dot ' + getStatusDotClass(newStatus);
        select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
        if (newStatus === 'New') select.classList.add('status-select-red');
        else if (newStatus === 'Read') select.classList.add('status-select-blue');
        else if (newStatus === 'Responded') select.classList.add('status-select-green');
        // Store the new status
        select.setAttribute('data-current-status', newStatus);

        // Send update to database
        fetch('/api/admin/update-contact-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messageId: messageId,
                status: newStatus
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showContactAlert('Status updated successfully!', 'success');
            } else {
                showContactAlert('Failed to update status: ' + (data.message || 'Unknown error'), 'error');
                // Reset on error
                select.value = currentStatus;
                dot.className = 'status-dot ' + getStatusDotClass(currentStatus);
                select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
                if (currentStatus === 'New') select.classList.add('status-select-red');
                else if (currentStatus === 'Read') select.classList.add('status-select-blue');
                else if (currentStatus === 'Responded') select.classList.add('status-select-green');
            }
        })
        .catch(err => {
            showContactAlert('Error updating status: ' + err.message, 'error');
            // Reset on error
            select.value = currentStatus;
            dot.className = 'status-dot ' + getStatusDotClass(currentStatus);
            select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green');
            if (currentStatus === 'New') select.classList.add('status-select-red');
            else if (currentStatus === 'Read') select.classList.add('status-select-blue');
            else if (currentStatus === 'Responded') select.classList.add('status-select-green');
        });
    }

    // Show custom alert at bottom left
    function showContactAlert(message, type = 'info') {
        const alertBox = document.getElementById('contactAlert');
        const alertMsg = document.getElementById('contactAlertMessage');
        alertMsg.textContent = message;
        alertBox.classList.add('show');
        // Optionally, you can style by type (success/error) here
        clearTimeout(window._contactAlertTimeout);
        window._contactAlertTimeout = setTimeout(() => {
            alertBox.classList.remove('show');
        }, 3000);
    }

    // Close button
    const alertCloseBtn = document.getElementById('contactAlertClose');
    if (alertCloseBtn) {
        alertCloseBtn.onclick = function() {
            document.getElementById('contactAlert').classList.remove('show');
        };
    }
}); 