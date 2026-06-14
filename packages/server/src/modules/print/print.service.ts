import { db } from '../../db'
import { AppError } from '../../utils/response'
import { getModelByCode } from '../lowcode/lowcode.service'

export interface PrintElement {
  id: string
  type: 'text' | 'image' | 'table' | 'rect' | 'qrcode'
  x: number
  y: number
  width: number
  height: number
  content?: string
  field?: string
  aggregate?: string
  style?: Record<string, any>
  tableConfig?: {
    columns: { field: string; label: string; width?: number }[]
    dataSource: 'main' | { modelCode: string; localField: string; foreignField: string }
  }
}

export interface PrintTemplateConfig {
  elements: PrintElement[]
}

export interface PrintPageStyle {
  width?: number
  height?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  fontFamily?: string
  fontSize?: number
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseConfig(template: any): PrintTemplateConfig {
  if (!template?.config) return { elements: [] }
  try {
    return typeof template.config === 'string' ? JSON.parse(template.config) : template.config
  } catch {
    return { elements: [] }
  }
}

function parsePageStyle(template: any): PrintPageStyle {
  if (!template?.page_style) return {}
  try {
    return typeof template.page_style === 'string' ? JSON.parse(template.page_style) : template.page_style
  } catch {
    return {}
  }
}

export async function getPrintTemplates(modelCode?: string) {
  const builder = db('print_templates').orderBy('id', 'desc')
  if (modelCode) builder.where({ model_code: modelCode })
  return builder
}

export async function getPrintTemplateByCode(code: string) {
  const template = await db('print_templates').where({ code }).first()
  if (!template) throw new AppError('打印模板不存在', 404)
  return {
    ...template,
    config: parseConfig(template),
    pageStyle: parsePageStyle(template)
  }
}

export async function savePrintTemplate(data: any) {
  const code = safeCode(data.code || data.name)
  const config = typeof data.config === 'string' ? data.config : JSON.stringify(data.config || { elements: [] })
  const pageStyle = typeof data.pageStyle === 'string' ? data.pageStyle : JSON.stringify(data.pageStyle || {})

  const exists = await db('print_templates').where({ code }).first()
  if (exists) {
    await db('print_templates').where({ code }).update({
      name: data.name,
      model_code: data.modelCode,
      paper_size: data.paperSize || exists.paper_size || 'A4',
      orientation: data.orientation || exists.orientation || 'portrait',
      config,
      page_style: pageStyle,
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
    return db('print_templates').where({ code }).first()
  }

  const [id] = await db('print_templates').insert({
    code,
    name: data.name,
    model_code: data.modelCode,
    paper_size: data.paperSize || 'A4',
    orientation: data.orientation || 'portrait',
    config,
    page_style: pageStyle,
    status: data.status ?? 1
  })
  return db('print_templates').where({ id }).first()
}

export async function deletePrintTemplate(id: number) {
  await db('print_templates').where({ id }).del()
  return true
}

export async function renderPrintTemplate(code: string, options: { recordId?: number; recordIds?: number[]; filters?: any }, user?: any) {
  const template = await getPrintTemplateByCode(code)
  const config = template.config as PrintTemplateConfig
  const model = await getModelByCode(template.model_code)

  let mainRows: any[] = []
  if (options.recordId) {
    mainRows = [await db(model.table_name).where({ id: options.recordId }).first()]
  } else if (options.recordIds?.length) {
    mainRows = await db(model.table_name).whereIn('id', options.recordIds)
  } else {
    mainRows = await db(model.table_name).select()
  }

  if (!mainRows.length) throw new AppError('未找到打印数据', 404)

  const fieldMap = new Map<string, any>(model.fields.map((f: any) => [f.field_name, f]))
  const pages: any[] = []
  for (const row of mainRows) {
    pages.push(await renderPage(template, config, row, model, fieldMap))
  }

  return {
    template,
    pages
  }
}

async function renderPage(template: any, config: PrintTemplateConfig, row: any, model: any, fieldMap: Map<string, any>) {
  const pageStyle = template.pageStyle as PrintPageStyle
  const paperSize = template.paper_size || 'A4'
  const orientation = template.orientation || 'portrait'
  const size = getPaperSize(paperSize, orientation)

  const htmlParts: string[] = []
  for (const el of config.elements) {
    htmlParts.push(await renderElement(el, row, model, fieldMap))
  }

  const paddingTop = pageStyle.paddingTop ?? 20
  const paddingRight = pageStyle.paddingRight ?? 20
  const paddingBottom = pageStyle.paddingBottom ?? 20
  const paddingLeft = pageStyle.paddingLeft ?? 20

  return {
    paperSize,
    orientation,
    width: size.width,
    height: size.height,
    html: `<div class="print-page" style="
      position: relative;
      width: ${size.width}px;
      height: ${size.height}px;
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
      box-sizing: border-box;
      font-family: ${pageStyle.fontFamily || 'Tahoma, Microsoft Sans Serif, sans-serif'};
      font-size: ${pageStyle.fontSize || 12}px;
      background: #fff;
      overflow: hidden;
    ">${htmlParts.join('')}</div>`
  }
}

async function renderElement(el: PrintElement, row: any, model: any, fieldMap: Map<string, any>): Promise<string> {
  const style = {
    position: 'absolute',
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.width}px`,
    height: `${el.height}px`,
    ...(el.style || {})
  }
  const styleStr = Object.entries(style).map(([k, v]) => `${kebabCase(k)}:${v}`).join(';')

  switch (el.type) {
    case 'text':
      return renderTextElement(el, row, styleStr)
    case 'image':
      return `<img style="${styleStr}" src="${el.content || ''}" />`
    case 'qrcode':
      return `<div class="print-qrcode" style="${styleStr}">${escapeHtml(String(getFieldValue(row, el.field, el.content) ?? ''))}</div>`
    case 'table':
      return renderTableElement(el, row, model, fieldMap, styleStr)
    case 'rect':
      return `<div style="${styleStr};border:1px solid #000"></div>`
    default:
      return `<div style="${styleStr}"></div>`
  }
}

function renderTextElement(el: PrintElement, row: any, styleStr: string): string {
  const value = el.field ? getFieldValue(row, el.field, el.content) : (el.content || '')
  return `<div style="${styleStr};display:flex;align-items:center">${escapeHtml(String(value ?? ''))}</div>`
}

async function renderTableElement(el: PrintElement, row: any, model: any, fieldMap: Map<string, any>, styleStr: string): Promise<string> {
  const columns = el.tableConfig?.columns || []
  if (!columns.length) return `<div style="${styleStr}"></div>`

  const dataSource = el.tableConfig?.dataSource || 'main'
  let rows: any[] = []

  if (dataSource === 'main') {
    rows = [row]
  } else if (typeof dataSource === 'object' && dataSource.modelCode) {
    const refModel = await getModelByCode(dataSource.modelCode)
    const foreignField = dataSource.foreignField || 'id'
    const localValue = row[dataSource.localField || 'id']
    rows = await db(refModel.table_name).where(foreignField, localValue)
  }

  const colStyle = (width?: number) => width ? `width:${width}px;min-width:${width}px` : ''
  const header = columns.map((col) => `<th style="${colStyle(col.width)};border:1px solid #000;padding:4px;text-align:left;background:#f0f0f0">${escapeHtml(col.label)}</th>`).join('')
  const body = rows.map((r) => {
    return `<tr>${columns.map((col) => `<td style="${colStyle(col.width)};border:1px solid #000;padding:4px">${escapeHtml(String(getFieldValue(r, col.field) ?? ''))}</td>`).join('')}</tr>`
  }).join('')

  return `<table style="${styleStr};border-collapse:collapse" cellspacing="0" cellpadding="0"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
}

function getFieldValue(row: any, field?: string, fallback?: string): any {
  if (!field) return fallback
  return row[field] ?? fallback
}

function getPaperSize(paperSize: string, orientation: string) {
  const sizes: Record<string, { width: number; height: number }> = {
    A4: { width: 794, height: 1123 },
    A5: { width: 559, height: 794 },
    A3: { width: 1123, height: 1587 },
    LETTER: { width: 816, height: 1056 }
  }
  const size = sizes[paperSize.toUpperCase()] || sizes.A4
  if (orientation === 'landscape') {
    return { width: size.height, height: size.width }
  }
  return size
}

function kebabCase(str: string) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
