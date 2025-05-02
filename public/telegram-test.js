function showResult() {
  const apiResult = document.getElementById('apiResult');
  const userResult = document.getElementById('userResult');
  const themeResult = document.getElementById('themeResult');
  const featuresResult = document.getElementById('featuresResult');
  const endpointsResult = document.getElementById('endpointsResult');
  const details = document.getElementById('details');

  console.log("Checking for Telegram WebApp...");

  // Check if Telegram WebApp API is available
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;

    // Basic API Detection
    apiResult.innerHTML = '<span class="success">✅ Telegram WebApp API detected!</span>';
    apiResult.innerHTML += `<pre>Version: ${webApp.version || 'Unknown'}</pre>`;

    // Initialize WebApp
    try {
      console.log("Initializing Telegram WebApp...");
      webApp.ready();
      webApp.expand();
      apiResult.innerHTML += '<p class="success">✅ WebApp initialized successfully</p>';
    } catch (error) {
      console.error("Error initializing WebApp:", error);
      apiResult.innerHTML += `<p class="error">❌ Error initializing WebApp: ${error.message}</p>`;
    }

    // User Data
    if (webApp.initDataUnsafe?.user) {
      const user = webApp.initDataUnsafe.user;
      userResult.innerHTML = '<span class="success">✅ User data available</span>';
      userResult.innerHTML += `<pre>ID: ${user.id}\nUsername: ${user.username || 'N/A'}\nFirst Name: ${user.first_name}\nLast Name: ${user.last_name || 'N/A'}</pre>`;
    } else {
      userResult.innerHTML = '<span class="warning">⚠️ No user data available</span>';
      userResult.innerHTML += '<p>This could be because:</p><ul><li>The app was not launched properly from Telegram</li><li>The initData parameter is missing</li><li>There might be a permission issue</li></ul>';
      console.warn("No Telegram user data found in initDataUnsafe");
    }

    // Theme Parameters
    if (webApp.themeParams) {
      themeResult.innerHTML = '<span class="success">✅ Theme parameters available</span>';
      themeResult.innerHTML += `<pre>${JSON.stringify(webApp.themeParams, null, 2)}</pre>`;
    } else {
      themeResult.innerHTML = '<span class="warning">⚠️ No theme parameters available</span>';
    }

    // WebApp Features
    const features = {
      'Main Button': webApp.MainButton,
      'Back Button': webApp.BackButton,
      'Haptic Feedback': webApp.HapticFeedback,
      'Cloud Storage': webApp.CloudStorage
    };

    let featuresHtml = '<span class="success">✅ Available features:</span><ul>';
    Object.entries(features).forEach(([name, feature]) => {
      featuresHtml += `<li>${name}: ${feature ? '✅ Available' : '❌ Not available'}</li>`;
    });
    featuresHtml += '</ul>';
    featuresResult.innerHTML = featuresHtml;

    // API Endpoints
    const endpoints = {
      'Backend API': 'https://whalebux-vercel.onrender.com',
      'Frontend URL': 'https://whalebux-frontend.vercel.app',
      'Bot Username': 'WhaleBuxBot'
    };

    let endpointsHtml = '<span class="success">✅ Configured endpoints:</span><ul>';
    Object.entries(endpoints).forEach(([name, url]) => {
      endpointsHtml += `<li>${name}: ${url}</li>`;
    });
    endpointsHtml += '</ul>';
    endpointsResult.innerHTML = endpointsHtml;

    // Detailed information
    details.innerHTML = `
      <h3>Detailed WebApp Information</h3>
      <pre>${JSON.stringify({
        platform: webApp.platform,
        colorScheme: webApp.colorScheme,
        viewportHeight: webApp.viewportHeight,
        viewportStableHeight: webApp.viewportStableHeight,
        headerColor: webApp.headerColor,
        backgroundColor: webApp.backgroundColor,
        isExpanded: webApp.isExpanded,
        initData: webApp.initData,
        initDataUnsafe: webApp.initDataUnsafe
      }, null, 2)}</pre>
    `;
  } else {
    console.error("Telegram WebApp API not detected");
    apiResult.innerHTML = '<span class="error">❌ Telegram WebApp API NOT detected.</span>';
    apiResult.innerHTML += '<p>Possible reasons:</p><ul><li>This page is not opened from Telegram</li><li>The Telegram WebApp script failed to load</li><li>There might be a Content Security Policy blocking the script</li></ul>';

    userResult.innerHTML = '<span class="error">❌ Cannot check user data</span>';
    themeResult.innerHTML = '<span class="error">❌ Cannot check theme parameters</span>';
    featuresResult.innerHTML = '<span class="error">❌ Cannot check features</span>';
    endpointsResult.innerHTML = '<span class="error">❌ Cannot check endpoints</span>';
    details.innerHTML = '<span class="error">❌ No detailed information available</span><p>This page must be opened from within Telegram to access the WebApp API.</p>';

    // Try to detect if window.Telegram exists but WebApp doesn't
    if (typeof window.Telegram !== 'undefined') {
      apiResult.innerHTML += '<p class="warning">⚠️ window.Telegram exists but WebApp is not available. This suggests a partial initialization issue.</p>';
      console.warn("window.Telegram exists but WebApp is not available");
    }
  }
}

window.onload = showResult;
