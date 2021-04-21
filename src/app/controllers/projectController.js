const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task')

router.use(authMiddleware)

// list
router.get('/', async (req, res)=>{
    try {
        const projects = await Project.find().populate('user');


        return res.send({ projects });
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao carregar os projetos ! " }) */
        if(error) throw error
    }
})

router.get('/:projectId', async (req, res)=>{
    try {
        const project = await Project.findById(req.params.projectId).populate('user');


        return res.send({ project });
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao carregar o projeto ! " }) */
        if(error) throw error
    }
})

// criar projeto
router.post('/', async(req, res)=>{
    try {
        const project = await Project.create({...req.body, user: req.userId});

        console.log(project)

        return res.send({ project })
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao criar um novo projeto ! " }) */
        if(error) throw error
    }
})

router.put('/:projectId', async(req, res)=>{
    res.send({ user: req.userId });
})

router.delete('/:projectId', async(req, res)=>{
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao remover o projeto ! " }) */
        if(error) throw error
    }
})

module.exports = router