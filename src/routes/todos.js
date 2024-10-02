import express from 'express'
import { randomUUID } from 'crypto'
import { readData, writeData } from '../utils/dataHandlers.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const data = await readData('todos')
        res.json(data)
    } catch (err) {
        res.status(400)
        res.json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const newTodoId = randomUUID()

        const newTodo = {
            ...req.body,
            id: newTodoId,
        }

        let currentTodos = await readData('todos')

        const todoExists = currentTodos.some((todo) => {
            return (
                todo.title === newTodo.title ||
                todo.description === newTodo.description
            )
        })

        if (todoExists) {
            res.status(400)
            res.json({ message: 'Tento úkol máš již zapsaný' })
        } else {
            currentTodos.push(newTodo)
            await writeData('todos', currentTodos)
            res.json({ newTodo })
        }
    } catch (error) {
        if (error) {
            return res.json({ status: 400, message: 'fail' })
        }
    }
})

router.delete('/:todoId', async (req, res) => {
    const todoId = req.params.todoId

    try {
        let todos = await readData('todos')

        const newTodos = todos.filter((todo) => {
            return todo.id !== todoId
        })

        await writeData('todos', newTodos)
        console.log(newTodos)

        res.json(newTodos)
    } catch (error) {
        if (error) {
            return res.json({ status: 400, message: 'fail' })
        }
    }
})

router.post('/editTodo', async (req, res) => {
    try {
        const todos = await readData('todos')
        const editedTodos = []

        todos.forEach((todo) => {
            if (todo.id === req.body.id) {
                const mergedTodo = Object.assign({}, todo, req.body)

                editedTodos.push(mergedTodo)
            } else {
                editedTodos.push(todo)
            }
        })

        await writeData('todos', editedTodos)
        res.json(editedTodos)
    } catch (error) {
        if (error) {
            return res.json({ status: 400, message: 'fail' })
        }
    }
})

router.post('/markDone', async (req, res) => {
    try {
        const newTodos = []

        const todos = await readData('todos')

        todos.forEach((todo) => {
            let newTodo

            if (todo.id === req.body.id) {
                newTodo = {
                    ...todo,
                    listId: 'done',
                }
            } else {
                newTodo = todo
            }

            newTodos.push(newTodo)
        })

        await writeData('todos', newTodos)
        res.json(newTodos)
    } catch (error) {
        if (error) {
            return res.json({ status: 400, message: 'fail' })
        }
    }
})

router.put('/', async (req, res) => {
    try {
        await writeData('todos', req.body)
        res.json(req.body)
    } catch {
        return res.json({ status: 400, message: 'fail' })
    }
})

export default router
