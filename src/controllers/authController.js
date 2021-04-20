const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth')

const User = require('../models/user');

const generateToken = async(params = {})=>{
    return jwt.sign(params, authConfig.secret, { expiresIn: 86400 })
}

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "Usuário já existente ! " })

        // implantar o conceito de password > 6
        const passwordEncrypt = await bcrypt.hash(password, 10);  // senha encyrpt
        

        const newUser = new User({
            name: name , email: email, password : passwordEncrypt
        });
        
        
        await newUser.save(); 
        //const user = await User.create(req.body); // caso fosse feito hash pelo schema

        newUser.password = undefined // para que a senha nao apareça ao ser criado (no db fica)
        const id = newUser.id; 

        const token = jwt.sign({ id: id }, authConfig.secret, { expiresIn: 86400 }) // generate error

        return res.send({ 
            newUser,
            token: token
        })
    } catch (error) {
        if(error) throw error;
        return res.status(200).res.send({msg: "Registrado!"})
    }
})

// login 
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    
    if (!user)
    return res.status(400).send({ error: "Usuário não encontrado ! " });
    
    if (!await bcrypt.compare(password, user.password))
    return res.status(500).send({ error: "Senha inválida!" })
    
    /* console.log('Normal --->  ', password)
    console.log('Encrypt--->  ', user.password) */
    
    user.password = undefined; // para que a senha nao apareça ao ser logado

    res.send({
        user: user,
        token: generateToken({ id: user.id }) 
    })
})

module.exports = router