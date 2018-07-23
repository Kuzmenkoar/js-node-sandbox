import { Router } from 'express';
import through from 'through2';
import { parseJson } from '../../helpers/json';
const router = Router();

const products = [
  {
    key: '123',
    reviews: 'vasilb',
    product: 'iphone',
  },
  {
    key: '234',
    reviews: 'petro',
    product: 'mac',
  },
];

router.get('/', (req, res) => res.send(products));
router.get('/:productId', (req, res) => {
  const product = products.find(el => el.key === req.params.productId);

  if (!product) {
    return res.sendStatus(404);
  }

  res.send(product);
});

router.get('/:productId/reviews', (req, res) => {
  const product = products.find(el => el.key === req.params.productId);

  if (!product) {
    return res.sendStatus(404);
  }

  res.send(product.reviews);
});

router.post('/', (req, res) => {
  req
    .pipe(
      through(function(chunk, enc, next) {
        const newProduct = parseJson(chunk.toString());
        products.push(newProduct);

        this.push(chunk);
        next();
      }),
    )
    .pipe(res);
});

export default router;
