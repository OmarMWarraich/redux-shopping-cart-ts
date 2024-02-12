import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Products } from "./features/products/Products";
import { CartLink } from "./features/cart/CartLink";
import { Cart } from "./features/cart/Cart";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <nav>
            <Link className={styles.navLink} to="/">
              Home
            </Link>
            <Link className={styles.navLink} to="/products">
              Products
            </Link>
            <CartLink />
          </nav>
        </header>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;

function Home() {
  return (
    <main className={styles.page}>
      <h1>Welcome to the Store</h1>
      <figure>
        <img src="/store.jpg" alt="A large old storefront" width="800" className={styles.store} />
        <figcaption>Gary Houston, CC0, via Wikimedia Commons</figcaption>
      </figure>
    </main>
  );
}
