// ===========================
// Toast Notification
// ===========================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ===========================
// Copy to Clipboard
// ===========================
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast('Copied to clipboard!'))
    .catch(() => showToast('Failed to copy', 'error'));
}

// ===========================
// Shorten Form (Home Page)
// ===========================
const shortenForm = document.getElementById('shorten-form');
if (shortenForm) {
  const urlInput = document.getElementById('url-input');
  const shortenBtn = document.getElementById('shorten-btn');
  const btnText = shortenBtn.querySelector('.btn-text');
  const btnLoader = shortenBtn.querySelector('.btn-loader');
  const resultArea = document.getElementById('result-area');
  const resultLink = document.getElementById('result-link');
  const resultOriginalUrl = document.getElementById('result-original-url');
  const copyBtn = document.getElementById('copy-btn');

  shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalUrl = urlInput.value.trim();
    if (!originalUrl) return;

    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    shortenBtn.disabled = true;

    try {
      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show result
      resultLink.href = data.data.shortUrl;
      resultLink.textContent = data.data.shortUrl;
      resultOriginalUrl.textContent = data.data.originalUrl;
      resultArea.classList.remove('hidden');

      // Update copy button
      copyBtn.onclick = () => copyToClipboard(data.data.shortUrl);

      showToast('Short URL created!');
      urlInput.value = '';
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      // Reset loading state
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      shortenBtn.disabled = false;
    }
  });
}

// ===========================
// Copy buttons (Links page)
// ===========================
document.querySelectorAll('.btn-copy-inline').forEach((btn) => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    if (url) copyToClipboard(url);
  });
});

// ===========================
// Delete buttons (Links page)
// ===========================
document.querySelectorAll('[data-delete]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const shortCode = btn.dataset.delete;

    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/urls/${shortCode}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete');
      }

      // Remove the row from the table with animation
      const row = document.getElementById(`row-${shortCode}`);
      if (row) {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(() => row.remove(), 300);
      }

      showToast('Link deleted successfully');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
});
