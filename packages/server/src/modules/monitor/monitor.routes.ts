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
router.post('/messages/read-all', monitorController.readAllMessages)
router.put('/messages/:businessType/:businessKey/read', monitorController.markMessageReadByBusinessKey)
router.delete('/messages/:id', monitorController.deleteMessage)
router.get('/messages/unread-count', monitorController.getUnreadCount)

// 操作日志
router.get('/operation-logs', monitorController.getOperationLogs)

// 数据日志
router.get('/data-logs', monitorController.getDataLogs)

// API 性能指标
router.get('/api-metrics', monitorController.getApiMetrics)
router.get('/api-performance-stats', monitorController.getApiPerformanceStats)
router.get('/api-trend', monitorController.getApiTrend)

// 慢 SQL
router.get('/slow-sqls', monitorController.getSlowSqls)
router.get('/sql-performance-stats', monitorController.getSqlPerformanceStats)

// 服务器信息
router.get('/server-info', monitorController.getServerInfo)

// 在线用户
router.get('/online-users', monitorController.getOnlineUsers)

// 告警规则
router.get('/alert-rules', monitorController.getAlertRules)
router.post('/alert-rules', monitorController.createAlertRule)
router.put('/alert-rules/:id', monitorController.updateAlertRule)
router.delete('/alert-rules/:id', monitorController.deleteAlertRule)

// 告警记录
router.get('/alert-records', monitorController.getAlertRecords)
router.get('/alert-records/unread-count', monitorController.getUnreadAlertCount)
router.put('/alert-records/:id/read', monitorController.markAlertRecordRead)
router.put('/alert-records/:id/resolve', monitorController.resolveAlertRecord)
router.post('/check-alerts', monitorController.checkAlerts)

// 数据治理
router.get('/retention-policies', monitorController.getRetentionPolicies)
router.put('/retention-policies/:id', monitorController.updateRetentionPolicy)
router.post('/run-cleanup', monitorController.runCleanup)

export default router
