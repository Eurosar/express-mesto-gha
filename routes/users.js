const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { updateUserProfileValidator, updateUserAvatarValidator } = require('../validators/celebrate');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUser);
router.patch('/me', updateUserProfileValidator, updateUserProfile);
router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
