import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import routes from './routes'
import { errorHandler } from './middleware/error'
import { requestLogMiddleware } from './middleware/requestLog'

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志（放在路由之前，记录所有 API 请求）
app.use(requestLogMiddleware)

// 静态资源（生产环境前端构建产物）
app.use(express.static(path.resolve(__dirname, '../../public')))

// 上传文件静态访问
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

// API 路由
app.use('/api', routes)

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use(errorHandler)

export default app
