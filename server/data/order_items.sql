-- order_items
CREATE TABLE order_items (
  order_id INT NOT NULL,
  spirit_id INT NOT NULL,
  quantity INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, spirit_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (spirit_id) REFERENCES liquors(id)
);