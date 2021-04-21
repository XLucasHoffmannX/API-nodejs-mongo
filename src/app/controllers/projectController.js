const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task')

router.use(authMiddleware)

router.get('/', (req, res)=>{
    res.send({ ok: true, user: req.userId })
})

module.exports = router