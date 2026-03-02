import { useState } from 'react';
import { useSettings, CURRENCIES } from '../../context/SettingsContext';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSettings() {
  const { 
    settings, 
    updateDeliverySettings, 
    updateTaxSettings, 
    updateStoreSettings,
    updateDiscountSettings,
    addShippingZone,
    deleteShippingZone,
    resetSettings,
    changeCurrency,
    formatPrice
  } = useSettings();

  const [activeTab, setActiveTab] = useState('delivery');
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', price: '', minDays: '', maxDays: '' });
  const [saved, setSaved] = useState(false);

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeliveryChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDeliverySettings({
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
    showSavedMessage();
  };

  const handleTaxChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateTaxSettings({
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
    showSavedMessage();
  };

  const handleStoreChange = (e) => {
    const { name, value, type } = e.target;
    updateStoreSettings({
      [name]: type === 'number' ? parseFloat(value) : value
    });
    showSavedMessage();
  };

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateDiscountSettings({
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
    showSavedMessage();
  };

  const handleAddZone = () => {
    if (newZone.name && newZone.price) {
      addShippingZone({
        name: newZone.name,
        price: parseFloat(newZone.price),
        minDays: parseInt(newZone.minDays) || 1,
        maxDays: parseInt(newZone.maxDays) || 5
      });
      setNewZone({ name: '', price: '', minDays: '', maxDays: '' });
      setShowZoneModal(false);
      showSavedMessage();
    }
  };

  const tabs = [
    { id: 'delivery', label: 'Delivery', icon: '🚚' },
    { id: 'tax', label: 'Tax / VAT', icon: '💰' },
    { id: 'store', label: 'Store', icon: '🏪' },
    { id: 'discount', label: 'Discounts', icon: '🏷️' },
  ];

  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="page-header">
          <div>
            <h1>Store Settings</h1>
            <p>Configure delivery, tax, and store settings</p>
          </div>
          <button className="btn-reset" onClick={resetSettings}>
            Reset to Defaults
          </button>
        </div>

        {saved && (
          <div className="settings-saved-toast">
            ✓ Settings saved automatically
          </div>
        )}

        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* Delivery Settings */}
          {activeTab === 'delivery' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>
                  <span className="section-icon">📦</span>
                  Free Delivery
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Enable Free Delivery</label>
                    <p>Offer free delivery when order exceeds threshold</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="freeDeliveryEnabled"
                      checked={settings.delivery.freeDeliveryEnabled}
                      onChange={handleDeliveryChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                {settings.delivery.freeDeliveryEnabled && (
                  <div className="setting-row">
                    <div className="setting-info">
                      <label>Free Delivery Threshold ({settings.store.currencySymbol})</label>
                      <p>Minimum order amount for free delivery</p>
                    </div>
                    <input
                      type="number"
                      name="freeDeliveryThreshold"
                      value={settings.delivery.freeDeliveryThreshold}
                      onChange={handleDeliveryChange}
                      className="setting-input"
                    />
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3>
                  <span className="section-icon">🚚</span>
                  Standard Delivery Prices
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Standard Delivery ({settings.store.currencySymbol})</label>
                    <p>Default delivery charge for standard shipping</p>
                  </div>
                  <input
                    type="number"
                    name="standardDeliveryPrice"
                    value={settings.delivery.standardDeliveryPrice}
                    onChange={handleDeliveryChange}
                    step="0.01"
                    className="setting-input"
                  />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Express Delivery ({settings.store.currencySymbol})</label>
                    <p>Charge for express/fast delivery option</p>
                  </div>
                  <input
                    type="number"
                    name="expressDeliveryPrice"
                    value={settings.delivery.expressDeliveryPrice}
                    onChange={handleDeliveryChange}
                    step="0.01"
                    className="setting-input"
                  />
                </div>
              </div>

              <div className="settings-section">
                <div className="section-header">
                  <h3>
                    <span className="section-icon">🌍</span>
                    Shipping Zones
                  </h3>
                  <button className="btn-add-small" onClick={() => setShowZoneModal(true)}>
                    + Add Zone
                  </button>
                </div>
                <div className="shipping-zones-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Zone Name</th>
                        <th>Price</th>
                        <th>Delivery Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.shippingZones.map(zone => (
                        <tr key={zone.id}>
                          <td>{zone.name}</td>
                          <td>{settings.store.currencySymbol}{zone.price.toFixed(2)}</td>
                          <td>{zone.minDays}-{zone.maxDays} days</td>
                          <td>
                            <button 
                              className="btn-delete-small"
                              onClick={() => deleteShippingZone(zone.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tax Settings */}
          {activeTab === 'tax' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>
                  <span className="section-icon">💵</span>
                  VAT / Sales Tax
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Enable VAT/Tax</label>
                    <p>Apply tax to all orders</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="vatEnabled"
                      checked={settings.tax.vatEnabled}
                      onChange={handleTaxChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {settings.tax.vatEnabled && (
                  <>
                    <div className="setting-row">
                      <div className="setting-info">
                        <label>VAT Rate (%)</label>
                        <p>Tax percentage applied to orders</p>
                      </div>
                      <input
                        type="number"
                        name="vatRate"
                        value={settings.tax.vatRate}
                        onChange={handleTaxChange}
                        step="0.1"
                        className="setting-input"
                      />
                    </div>
                    <div className="setting-row">
                      <div className="setting-info">
                        <label>VAT Included in Product Price</label>
                        <p>Prices already include VAT (won't add extra)</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="vatIncludedInPrice"
                          checked={settings.tax.vatIncludedInPrice}
                          onChange={handleTaxChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="tax-preview">
                <h4>Tax Calculation Preview</h4>
                <div className="preview-example">
                  <div className="preview-row">
                    <span>Product Price:</span>
                    <span>{settings.store.currencySymbol}100.00</span>
                  </div>
                  {settings.tax.vatEnabled && !settings.tax.vatIncludedInPrice && (
                    <div className="preview-row">
                      <span>VAT ({settings.tax.vatRate}%):</span>
                      <span>{settings.store.currencySymbol}{(100 * settings.tax.vatRate / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="preview-row total">
                    <span>Total:</span>
                    <span>
                      {settings.store.currencySymbol}
                      {settings.tax.vatEnabled && !settings.tax.vatIncludedInPrice 
                        ? (100 + (100 * settings.tax.vatRate / 100)).toFixed(2)
                        : '100.00'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings */}
          {activeTab === 'store' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>
                  <span className="section-icon">🏪</span>
                  General Store Settings
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Store Name</label>
                    <p>Your store's display name</p>
                  </div>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.store.storeName}
                    onChange={handleStoreChange}
                    className="setting-input wide"
                  />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Currency</label>
                    <p>Store currency code</p>
                  </div>
                  <select
                    name="currency"
                    value={settings.store.currency}
                    onChange={(e) => {
                      changeCurrency(e.target.value);
                      showSavedMessage();
                    }}
                    className="setting-input wide"
                  >
                    {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
                      <option key={code} value={code}>
                        {code} ({symbol}) - {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Preview */}
                <div className="currency-preview">
                  <h4>Currency Preview</h4>
                  <div className="preview-examples">
                    <div className="preview-item">
                      <span>Product Price:</span>
                      <span>{formatPrice(99.99)}</span>
                    </div>
                    <div className="preview-item">
                      <span>Delivery Fee:</span>
                      <span>{formatPrice(5.99)}</span>
                    </div>
                    <div className="preview-item">
                      <span>Order Total:</span>
                      <span>{formatPrice(249.50)}</span>
                    </div>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <label>Minimum Order Amount ({settings.store.currencySymbol})</label>
                    <p>Minimum order value required to checkout</p>
                  </div>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={settings.store.minOrderAmount}
                    onChange={handleStoreChange}
                    step="1"
                    className="setting-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Discount Settings */}
          {activeTab === 'discount' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>
                  <span className="section-icon">🎉</span>
                  Global Discount
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Enable Global Discount</label>
                    <p>Apply a discount to all products site-wide</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="globalDiscountEnabled"
                      checked={settings.discount.globalDiscountEnabled}
                      onChange={handleDiscountChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                {settings.discount.globalDiscountEnabled && (
                  <div className="setting-row">
                    <div className="setting-info">
                      <label>Global Discount (%)</label>
                      <p>Percentage off all products</p>
                    </div>
                    <input
                      type="number"
                      name="globalDiscountPercent"
                      value={settings.discount.globalDiscountPercent}
                      onChange={handleDiscountChange}
                      step="1"
                      min="0"
                      max="100"
                      className="setting-input"
                    />
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3>
                  <span className="section-icon">🎫</span>
                  Promo Code
                </h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Enable Promo Codes</label>
                    <p>Allow customers to enter promo codes at checkout</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="promoCodeEnabled"
                      checked={settings.discount.promoCodeEnabled}
                      onChange={handleDiscountChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                {settings.discount.promoCodeEnabled && (
                  <>
                    <div className="setting-row">
                      <div className="setting-info">
                        <label>Promo Code</label>
                        <p>Code customers can enter</p>
                      </div>
                      <input
                        type="text"
                        name="promoCode"
                        value={settings.discount.promoCode}
                        onChange={handleDiscountChange}
                        placeholder="e.g., SAVE10"
                        className="setting-input wide"
                      />
                    </div>
                    <div className="setting-row">
                      <div className="setting-info">
                        <label>Promo Discount (%)</label>
                        <p>Discount when promo code is applied</p>
                      </div>
                      <input
                        type="number"
                        name="promoCodeDiscount"
                        value={settings.discount.promoCodeDiscount}
                        onChange={handleDiscountChange}
                        step="1"
                        min="0"
                        max="100"
                        className="setting-input"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Zone Modal */}
        {showZoneModal && (
          <div className="modal-overlay" onClick={() => setShowZoneModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Add Shipping Zone</h2>
              <div className="modal-form">
                <div className="form-group">
                  <label>Zone Name</label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                    placeholder="e.g., Express Local"
                  />
                </div>
                <div className="form-group">
                  <label>Price ({settings.store.currencySymbol})</label>
                  <input
                    type="number"
                    value={newZone.price}
                    onChange={e => setNewZone({ ...newZone, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Min Days</label>
                    <input
                      type="number"
                      value={newZone.minDays}
                      onChange={e => setNewZone({ ...newZone, minDays: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Days</label>
                    <input
                      type="number"
                      value={newZone.maxDays}
                      onChange={e => setNewZone({ ...newZone, maxDays: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowZoneModal(false)}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleAddZone}>
                  Add Zone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
