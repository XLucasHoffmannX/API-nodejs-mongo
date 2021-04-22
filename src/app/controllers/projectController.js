const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task')

router.use(authMiddleware)

// list
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);


        return res.send({ projects });
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao carregar os projetos ! " }) */
        if (error) throw error
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);


        return res.send({ project });
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao carregar o projeto ! " }) */
        if (error) throw error
    }
})

// criar projeto
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project })
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao criar um novo projeto ! " }) */
        if (error) throw error
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                title, description
            },
            {new: true}
        );

        project.tasks = [];
        await Task.deleteOne({ project: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project })
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao atualizar o projeto ! " }) */
        if (error) throw error
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (error) {
        /* return res.status(400).send({ error: "Erro ao remover o projeto ! " }) */
        if (error) throw error
    }
})
module.exports = router