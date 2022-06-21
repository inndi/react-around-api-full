const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.patch('/:id/avatar', updateAvatar);

module.exports = router;
