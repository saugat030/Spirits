-- orders
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  creation_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped')),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);