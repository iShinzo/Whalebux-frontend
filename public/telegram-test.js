function showResult() {
  const result = document.getElementById('result');
  const details = document.getElementById('details');
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    result.textContent = '✅ Telegram WebApp API detected!';
    details.textContent = 'window.Telegram: ' + JSON.stringify(Object.keys(window.Telegram)) + '\nwindow.Telegram.WebApp: ' + JSON.stringify(Object.keys(window.Telegram.WebApp));
  } else {
    result.textContent = '❌ Telegram WebApp API NOT detected.';
    details.textContent = 'window.Telegram: ' + (typeof window.Telegram);
  }
}
window.onload = showResult;
