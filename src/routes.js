import { Database } from './database.js'
import { buildRoutePath } from './utils/build_route_path.js'
import { randomUUID } from 'node:crypto'


const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body

            if(!title) {
                return res.writeHead(404).end( JSON.stringify({ message: 'title is necessary'}))
            }

            if(!description) {
                return res.writeHead(400).end(
                  JSON.stringify({message: 'description is necessary' }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks',task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {search} = req.query

            const tasks = database.select('task', { title: search, description: search})
        
            return res.end(JSON.stringify(task))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body

            if(!title && !description) { 
                return res.writeHead(400).end(JSON.stringify({ message: 'title or description is necessary' }))
            }
        
            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
              }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            const [task] = database.select('tasks', { id })
        
            if (!task) {
                return res.writeHead(404).end()
              }

              database.delete('tasks', id)

              return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params

            const [task] = database.select('tasks', { id })
        
            if (!task) {
                return res.writeHead(404).end()
              }
            
            const isTaskComplete = !!task.completed_at
            const completed_at = isTaskComplete ? null : new Date()

            database.update('tasks',id, { completed_at})

            return res.writeHead(204).end()
        }
    },
]