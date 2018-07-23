import http from 'http';

const product = {
  id: 1,
  name: 'Supreme T-Shirt',
  brand: 'Supreme',
  price: 99.99,
  options: [{ color: 'blue' }, { size: 'XL' }],
};

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(product));
});

export default function() {
  server.listen(3000);
}
