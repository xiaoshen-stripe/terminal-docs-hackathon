import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [country, setCountry] = useState('US');
  const [readerType, setReaderType] = useState('sPOS');
  const [offlineProcessing, setOfflineProcessing] = useState(false);
  const [posSetup, setPosSetup] = useState('separate');
  const [posPlatform, setPosPlatform] = useState('web');
  const [businessType, setBusinessType] = useState('countertop');
  const [recommendation, setRecommendation] = useState({});
  const [readersList, setReadersList] = useState(['WisePad3', 'M2', 'S700', 'Tap to Pay on iPhone', 'Tap to Pay on Android']);

  useEffect(() => {
    updateRecommendation();
  }, [country, offlineProcessing, posSetup, posPlatform, businessType, readerType]);

  const updateRecommendation = () => {
    let reader = '';
    let integrationShape = '';
    let connectivity = '';

    // Determine reader
    if (country === 'US' && (readerType === 'mPOS')) {
      reader = 'M2';
    }

    if (country === 'US' && (businessType === 'events' || businessType === 'roaming')) {
      reader = 'M2';
    } else if ((country === 'France' || country === 'Germany') && readerType === 'sPOS') {
      reader = 'S700';
    } else if (country === 'Australia' || businessType === 'countertop') {
      reader = 'S700';
    }

    // Determine integration shape
    if (offlineProcessing) {
      if (posPlatform === 'web') {
        integrationShape = 'Terminal JavaScript SDK';
      } else if (posPlatform === 'android') {
        integrationShape = 'Terminal Android SDK';
      } else if (posPlatform === 'ipad' || posPlatform === 'iphone') {
        integrationShape = 'Terminal iOS SDK';
      } else if (posPlatform === 'desktop') {
        integrationShape = 'Terminal .NET SDK or Java SDK';
      }
    } else {
      integrationShape = 'Server-driven integration (SDI)';
    }

    // Determine connectivity
    if (businessType === 'countertop') {
      connectivity = 'Ethernet or USB';
    } else if (businessType === 'roaming') {
      connectivity = 'WiFi or Bluetooth';
    } else {
      connectivity = 'WiFi'; // Default for events & services
    }

    // Special cases
    if (posPlatform === 'iphone' && country === 'US') {
      reader = 'Tap to Pay on iPhone';
      connectivity = 'N/A';
    }
    if (posPlatform === 'android' && posSetup === 'all-in-one') {
      reader = 'Tap to Pay on Android';
      connectivity = 'N/A';
    }

    setRecommendation({ reader, integrationShape, connectivity });
  };

  const renderOptions = (options, currentValue, onChange) => {
    if (options.length < 10) {
      return (
        <div className="PillGroup">
          {options.map((option) => (
            <button
              key={option.value}
              className={`Pill ${currentValue === option.value ? 'active' : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <select value={currentValue} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
  };

  return (
    <div className="App">
      <header className="Header">
        <div className="Header-top">
          <a href="/" className="Logo">Stripe Docs</a>
          <nav className="MainNav">
            <a href="/get-started">Get started</a>
            <a href="/payments">Payments</a>
            <a href="/terminal">Terminal</a>
            <a href="/connect">Connect</a>
          </nav>
          <div className="HeaderActions">
            <button>Sign in</button>
          </div>
        </div>
      </header>

      <div className="Content">
        <aside className="Sidebar">
          <nav>
            <h3>Terminal</h3>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#select-properties">Select properties</a></li>
              <li><a href="#recommendations">Our recommendations</a></li>
            </ul>
          </nav>
        </aside>

        <main className="MainContent">
          <h1>Terminal Solution Wizard</h1>
          <p>Build your integration based on the country you operate in, choices for point-of-sale platform and features required.</p>

          <p>Use this guide to explore different Terminal solutions, make choices, and access a personalized integration guide. Before starting your integration in test mode, you must:</p>
          <ul>
            <li>Create a Stripe Account</li>
            <li>Begin filling out your platform profile</li>
          </ul>
          <p>Note that Terminal requires coding and development. If you are looking for a no-code solution, please check out our partners, or Accept payments from the Stripe Dashboard mobile app.</p>

          <h2 id="select-properties">Select properties</h2>

          <h3>Business location</h3>
          <div className="SelectionGroup">
            <h4>Country:</h4>
            {renderOptions(
              [
                { value: 'US', label: 'US' },
                { value: 'France', label: 'France' },
                { value: 'Germany', label: 'Germany' },
                { value: 'Australia', label: 'Australia' },
              ],
              country,
              setCountry
            )}
          </div>
          {country === 'US' && (
            <>
              <p>If mobility, low cost, a small form factor is important to your business, we recommend the M2 reader, which is built for the US market.</p>
              <p>For a low-cost smart readers, we recommend the WisePOS E.</p>
              <p>For a premium checkout experience, we recommend the S700.</p>
            </>
          )}

          {(country === 'France' || country === 'Germany') && (
            <>
              <p>If mobility, low cost, a small form factor is important to your business, we recommend the Wisepad3 reader.</p>
              <p>For a premium checkout experience, we recommend the S700.</p>
            </>
          )}

          {(country === 'Australia') && (
            <>
              <p>If mobility, low cost, a small form factor is important to your business, we recommend the Wisepad3 reader.</p>
              <p>For a premium checkout experience, we recommend the S700.</p>
            </>
          )}

          <h3>Offline Processing</h3>
          <div className="SelectionGroup">
            <h4>Do you need offline processing?</h4>
            {renderOptions(
              [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ],
              offlineProcessing.toString(),
              (value) => setOfflineProcessing(value === 'true')
            )}
          </div>

          {offlineProcessing ? (
            <>
              <p>A Terminal SDK integration supports Accept payments with intermittent, limited, or no internet connectivity. This means you can continue making transactions when there are issues with the internet connection.</p>
              <img 
                src="https://b.stripecdn.com/docs-statics-srv/assets/wisepose-integration-architecture.21fcf994b13ae28476b0d1dbea7c9036.png"
                alt="Wisepose Integration Architecture"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </>
          ) : (
            <>
              <p>Server-driven integration mode enables you to build in-person payment experiences directly using the Stripe API, and does not support offline mode processing.</p>
              <img 
                src="https://b.stripecdn.com/docs-statics-srv/assets/server-driven-integration-architecture.a8499c1169a540cef98c9dd539f99a61.png"
                alt="Server-driven Integration Architecture"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </>
          )}

          <h3>Point-of-sale setup</h3>
          <div className="SelectionGroup">
            <h4>Tell us about your Point-of-sale setup:</h4>
            {renderOptions(
              [
                { value: 'separate', label: 'Terminal reader with separate Point-of-sale device' },
                { value: 'all-in-one', label: 'All-in-one' },
              ],
              posSetup,
              setPosSetup
            )}
          </div>


          {posSetup === 'separate' ? (
  <>
    <p>The complete, wired solution with POS Terminal, perfect for selling at the sales counter.</p>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

    <img 
      src="https://cdn.shopify.com/s/files/1/0593/1040/7736/files/USB-CCountertopKit_Wisepad_-Front_2.png?v=1721137367&width=1200&height=1200&crop=none"
      alt="Wired POS Terminal"
      style={{ maxWidth: '40%', height: 'auto' }}
    />
    <img 
      src="https://cdn.shopify.com/s/files/1/0842/3905/6918/files/LightningCountertopKit_Retail_Perspective.png?v=1715109242&width=800&height=800&crop=center"
      alt="Wired POS Terminal"
      style={{ maxWidth: '40%', height: 'auto' }}
    />



    </div>
  </>
) : (
  <>
    <p>Use a mobile POS device or Tap to Pay, designed for selling away from the counter: on the floor and at events.</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img 
        src="https://cdn.shopify.com/b/shopify-brochure2-assets/1394955f1b856c7194a1c649a7aee956.webp"
        alt="Mobile POS Device"
        style={{ maxWidth: '40%', height: 'auto' }}
      />
      <img 
        src="https://cdn.shopify.com/shopifycloud/brochure/assets/pos/hardware-next/tap-to-pay-large-a6f31793d1ee680efcc9d86d2f932e76e182c5a13c008a9b1fe16aad13ecfc99.webp"
        alt="Tap to Pay"
        style={{ maxWidth: '48%', height: 'auto' }}
      />
    </div>
  </>
)}





          {/* <h3>Point-of-sale platform</h3> */}
          <div className="SelectionGroup">
            <h4>Point-of-sale platform:</h4>
            {renderOptions(
              [
                { value: 'web', label: 'Web' },
                { value: 'android', label: 'Android' },
                { value: 'iOS', label: 'iOS' },
                { value: 'desktop', label: 'Desktop' },
              ],
              posPlatform,
              setPosPlatform
            )}
          </div>

          {posPlatform === 'web' && (
    <p>Stripe Terminal can integrate with your web-based point-of-sale using the JavaScript client SDK. <br/>
You can also integrate using the server-driven integration powered by your own middleware or cloud-based infrastructure.</p>)}

{posPlatform === 'android' && (
    <p>Stripe Terminal can integrate with your Android-based point-of-sale using the Android SDK, or React native SDK. 
Android SDK also supports deploying custom Android POS apps on Stripe smart readers like the S700, as well as Tap to Pay on Android. 
</p>)}

{posPlatform === 'iOS' && (
    <p>Stripe Terminal can integrate with your iOS-based point-of-sale using the iOS SDK, or React native SDK. 
If you use an iPhone, Tap to Pay on iPhone is also available.
</p>)}



          {/* <h3>Business Type</h3>
          <div className="SelectionGroup">
            <h4>Tell us about your business:</h4>
            {renderOptions(
              [
                { value: 'countertop', label: 'Tabletop' },
                { value: 'roaming', label: 'Handheld' },
              ],
              businessType,
              setBusinessType
            )}
          </div> */}

          <h2 id="recommendations">Our recommendations</h2>
          <div className="Recommendation">
            <h3>Based on your selections, we recommend:</h3>
            <p><strong>Reader:</strong> {recommendation.reader}</p>
            <p><strong>Integration Shape:</strong> {recommendation.integrationShape}</p>
            <p><strong>Connectivity:</strong> {recommendation.connectivity}</p>
          </div>

          <p>Please use the integration assets below: docs, code demo, and user story to get started building your integration.</p>
        </main>
      </div>

      <footer className="Footer">
        <div className="FooterContent">
          <div className="FooterLinks">
            <a href="/privacy">Privacy & Terms</a>
            <a href="/sitemap">Sitemap</a>
          </div>
          <div className="FooterCopyright">
            © 2024 Stripe, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
