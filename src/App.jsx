import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [orders, setOrders] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Order verilerini çek
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ORDER_API || import.meta.env.REACT_APP_ORDER_API}/order`
      );

      // API array dönerse direkt al, nesne dönerse içindeki data'yı al
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setOrders(data);
    } catch (err) {
      console.error("Order verileri alınamadı:", err);
      setOrders([]);
    }
  };

  // Stock verilerini çek
  const fetchStocks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_STOCK_API || import.meta.env.REACT_APP_STOCK_API}/stock`
      );

      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setStocks(data);
    } catch (err) {
      console.error("Stock verileri alınamadı:", err);
      setStocks([]);
    }
  };

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchOrders(), fetchStocks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Veriler yükleniyor...</p>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#389E72" }}>📊 Order & Stock Dashboard</h1>

      <section style={{ marginTop: "30px" }}>
        <h2>🛒 Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((o) => (
              <li key={o.orderId}>
                <strong>Product:</strong> {o.productId} —{" "}
                <strong>Quantity:</strong> {o.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz sipariş yok.</p>
        )}
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2>📦 Stocks</h2>
        {stocks.length > 0 ? (
          <ul>
            {stocks.map((s) => (
              <li key={s.productId}>
                <strong>Product:</strong> {s.productId} —{" "}
                <strong>Stock:</strong> {s.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Stok verisi bulunamadı.</p>
        )}
      </section>
    </div>
  );
}

export default App;
