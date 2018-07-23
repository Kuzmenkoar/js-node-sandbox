import { Router } from 'express';
const router = Router();

const users = [
  {
    user: 'mika',
    sername: 'vasilit',
  },
  {
    user: 'freakl',
    sername: 'gnobnii',
  },
];

router.get('/', (req, res) => {
  res.send(users);
});

export default router;
