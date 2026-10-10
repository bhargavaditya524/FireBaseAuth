import React, { useState } from 'react';
import { Truck, Package, MapPin, Plus, Loader, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/shiprocket';

const Home = () => {

  const [activeTab, setActiveTab] = useState('verify');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [orders, setOrders] = useState([]);

  const [shipmentForm, setShipmentForm] = useState({
    order_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    weight: ''
  });

  const [trackForm, setTrackForm] = useState({ shipment_id: '' });

  // Verify connection
  const verifyConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify`);
      const data = await res.json();

      setMessage({
        type: data.success ? 'success' : 'error',
        text: data.success ? "Connection Verified" : "Connection Failed",
        details: data
      });

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders?page=1&limit=50`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  // Form change
  const handleShipmentChange = (e) => {
    setShipmentForm({ ...shipmentForm, [e.target.name]: e.target.value });
  };

  // Create shipment
  const createShipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/shipments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentForm)
      });

      const data = await res.json();

      setMessage({
        type: data.success ? 'success' : 'error',
        text: data.success ? "Shipment Created" : data.message
      });

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };

  // Track shipment
  const trackShipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/track/shipment/${trackForm.shipment_id}`);
      const data = await res.json();

      setMessage({
        type: data.success ? 'success' : 'error',
        text: data.success ? "Tracking Found" : data.message,
        details: data.data
      });

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Truck /> Shiprocket Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("verify")}>Verify</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button onClick={() => setActiveTab("create")}>Create Shipment</button>
        <button onClick={() => setActiveTab("track")}>Track</button>
      </div>

      {/* Verify */}
      {activeTab === "verify" && (
        <button onClick={verifyConnection} className="bg-blue-500 text-white px-4 py-2">
          {loading ? "Checking..." : "Verify Connection"}
        </button>
      )}

      {/* Orders */}
      {activeTab === "orders" && (
        <div>
          <button onClick={fetchOrders} className="bg-blue-500 text-white px-4 py-2 mb-4">
            Fetch Orders
          </button>

          {orders.map((o, i) => (
            <div key={i} className="border p-2 mb-2">
              {o.order_id} - {o.status}
            </div>
          ))}
        </div>
      )}

      {/* Create Shipment */}
      {activeTab === "create" && (
        <form onSubmit={createShipment} className="grid gap-3 max-w-md">

          <input name="order_id" placeholder="Order ID" onChange={handleShipmentChange} />
          <input name="name" placeholder="Name" onChange={handleShipmentChange} />
          <input name="email" placeholder="Email" onChange={handleShipmentChange} />
          <input name="phone" placeholder="Phone" onChange={handleShipmentChange} />
          <input name="address" placeholder="Address" onChange={handleShipmentChange} />
          <input name="city" placeholder="City" onChange={handleShipmentChange} />
          <input name="state" placeholder="State" onChange={handleShipmentChange} />
          <input name="postal_code" placeholder="Postal Code" onChange={handleShipmentChange} />
          <input name="country" placeholder="Country" onChange={handleShipmentChange} />

          <button className="bg-green-600 text-white p-2">
            {loading ? "Creating..." : "Create Shipment"}
          </button>

        </form>
      )}

      {/* Track */}
      {activeTab === "track" && (
        <form onSubmit={trackShipment} className="max-w-md">

          <input
            placeholder="Shipment ID"
            onChange={(e) => setTrackForm({ shipment_id: e.target.value })}
          />

          <button className="bg-purple-600 text-white p-2 mt-2">
            Track Shipment
          </button>

        </form>
      )}

    </div>
  );
};

export default Home;