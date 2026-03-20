import * as SQLite from 'expo-sqlite';

// ── Open / create DB ──────────────────────────────────────────────
const db = SQLite.openDatabaseSync('endurace_cart.db');

// ── Bootstrap table ───────────────────────────────────────────────
export const initCartDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cart (
      id          TEXT PRIMARY KEY,
      productId   TEXT NOT NULL,
      name        TEXT NOT NULL,
      variation   TEXT DEFAULT '',
      price       REAL NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      image       TEXT DEFAULT ''
    );
  `);
};

// ── Load all cart items ───────────────────────────────────────────
export const loadCartFromDB = () => {
  return db.getAllSync('SELECT * FROM cart ORDER BY rowid ASC');
};

// ── Upsert a single item  ─────────────────────────────────────────
// If the item already exists (same id) update quantity; otherwise insert.
export const upsertCartItem = (item) => {
  const existing = db.getFirstSync('SELECT id FROM cart WHERE id = ?', [item.id]);
  if (existing) {
    db.runSync(
      'UPDATE cart SET quantity = ?, name = ?, variation = ?, price = ?, image = ? WHERE id = ?',
      [item.quantity, item.name, item.variation, item.price, item.image, item.id]
    );
  } else {
    db.runSync(
      `INSERT INTO cart (id, productId, name, variation, price, quantity, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.productId ?? item.id,
        item.name,
        item.variation ?? '',
        item.price,
        item.quantity,
        item.image ?? '',
      ]
    );
  }
};

// ── Update quantity for one item ──────────────────────────────────
export const updateCartItemQty = (id, quantity) => {
  db.runSync('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);
};

// ── Delete a single item ──────────────────────────────────────────
export const deleteCartItem = (id) => {
  db.runSync('DELETE FROM cart WHERE id = ?', [id]);
};

// ── Delete multiple items by id array ────────────────────────────
export const deleteCartItems = (ids) => {
  if (!ids || ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(', ');
  db.runSync(`DELETE FROM cart WHERE id IN (${placeholders})`, ids);
};

// ── Wipe entire cart (called after checkout) ─────────────────────
export const clearCartDB = () => {
  db.runSync('DELETE FROM cart');
};