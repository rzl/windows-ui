import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as monitorController from './monitor.controller'

const router: RouterType = Router()

router.use(authMiddleware)

// 消息模板
router.get('/message-templates', monitorController.getMessageTemplates)
router.post('/message-templates', monitorController.createMessageTemplate)
router.put('/message-templates/:id', monitorController.updateMessageTemplate)
router.delete('/message-templates/:id', monitorController.deleteMessageTemplate)

// 消息
router.get('/messages', monitorController.getMessages)
router.post('/messages', monitorController.createMessage)
router.put('/messages/:id/read', monitorController.markMessageRead)
router.delete('/messages/:id', monitorController.deleteMessage)
router.get('/messages/unread-count', monitorController.getUnreadCount)

// 操作日志
router.get('/operation-logs', monitorController.getOperationLogs)

// 数据日志
router.get('/data-logs', monitorController.getDataLogs)

// 服务器信息
router.get('/server-info', monitorController.getServerInfo)

// 在线用户
router.get('/online-users', monitorController.getOnlineUsers)

export default router
