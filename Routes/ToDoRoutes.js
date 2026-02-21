const {Router} = require('express');
const {getToDo, saveToDo, updateToDo, deleteToDo} = require('../controllers/TodoController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/getToDo', authMiddleware, getToDo);
router.post('/saveToDo', authMiddleware, saveToDo);
router.put('/updateToDo/:id', authMiddleware, updateToDo);
router.delete('/deleteToDo/:id', authMiddleware, deleteToDo);

module.exports = router;