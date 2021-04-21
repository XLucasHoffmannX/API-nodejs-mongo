const router = require('express').Router();

const authMiddleware = require('../middlewares/auth')

router.use(authMiddleware)

router.get('/', (req, res)=>{
    res.send({ ok: true, user: req.userId })
})

module.exports = router