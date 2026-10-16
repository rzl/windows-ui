import type { Knex } from 'knex'
import { newId, GLOBAL_TENANT_ID } from '../src/utils/id.ts'

/**
 * 内置默认编码规则与校验规则
 *
 * - 仅写入全局租户（GLOBAL_TENANT_ID），与默认字典分类、默认职务等其他默认数据保持一致
 * - 幂等：按 (tenant_id, code) 判断已存在则跳过，不会覆盖用户手工创建或修改过的规则
 *
 * 编码规则生成格式：{prefix}{date}{seq}，date_format 为空字符串表示不拼接日期
 */
const defaultCodingRules = [
  { code: 'order_no', name: '订单编号', prefix: 'SO', date_format: 'YYYYMMDD', seq_length: 4 },
  { code: 'contract_no', name: '合同编号', prefix: 'HT', date_format: 'YYYYMMDD', seq_length: 4 },
  { code: 'document_no', name: '单据编号', prefix: 'DOC', date_format: 'YYYYMMDD', seq_length: 4 },
  { code: 'request_no', name: '申请单号', prefix: 'REQ', date_format: 'YYYYMMDD', seq_length: 3 },
  { code: 'employee_no', name: '员工工号', prefix: 'EMP', date_format: '', seq_length: 4 },
  { code: 'customer_no', name: '客户编号', prefix: 'KH', date_format: '', seq_length: 4 },
  { code: 'material_no', name: '物料编码', prefix: 'WL', date_format: '', seq_length: 5 }
]

const defaultValidationRules = [
  { code: 'mobile', name: '手机号码', pattern: '^1[3-9]\\d{9}$', message: '请输入正确的手机号码' },
  { code: 'telephone', name: '座机电话', pattern: '^0\\d{2,3}-\\d{7,8}$', message: '请输入正确的座机号码，如 010-12345678' },
  { code: 'email', name: '电子邮箱', pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$', message: '请输入正确的电子邮箱' },
  { code: 'id_card', name: '身份证号', pattern: '^\\d{17}[\\dXx]$', message: '请输入正确的 18 位身份证号码' },
  { code: 'postal_code', name: '邮政编码', pattern: '^\\d{6}$', message: '请输入 6 位数字的邮政编码' },
  { code: 'url', name: '网址', pattern: '^https?:\\/\\/\\S+$', message: '请输入以 http:// 或 https:// 开头的网址' },
  { code: 'positive_integer', name: '正整数', pattern: '^[1-9]\\d*$', message: '请输入正整数' },
  { code: 'integer', name: '整数', pattern: '^-?\\d+$', message: '请输入整数' },
  { code: 'number', name: '数字', pattern: '^-?\\d+(\\.\\d+)?$', message: '请输入正确的数字' },
  { code: 'chinese', name: '中文', pattern: '^[\\u4e00-\\u9fa5]+$', message: '只能输入中文' },
  { code: 'english', name: '英文字母', pattern: '^[A-Za-z]+$', message: '只能输入英文字母' },
  { code: 'alphanumeric', name: '字母和数字', pattern: '^[A-Za-z0-9]+$', message: '只能输入字母和数字' }
]

export async function up(knex: Knex): Promise<void> {
  for (const rule of defaultCodingRules) {
    const exists = await knex('lowcode_coding_rules')
      .where({ tenant_id: GLOBAL_TENANT_ID, code: rule.code })
      .first()
    if (!exists) {
      await knex('lowcode_coding_rules').insert({
        id: newId(),
        current_seq: 0,
        status: 1,
        tenant_id: GLOBAL_TENANT_ID,
        ...rule
      })
    }
  }

  for (const rule of defaultValidationRules) {
    const exists = await knex('lowcode_validation_rules')
      .where({ tenant_id: GLOBAL_TENANT_ID, code: rule.code })
      .first()
    if (!exists) {
      await knex('lowcode_validation_rules').insert({
        id: newId(),
        status: 1,
        tenant_id: GLOBAL_TENANT_ID,
        ...rule
      })
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  const codingCodes = defaultCodingRules.map((r) => r.code)
  const validationCodes = defaultValidationRules.map((r) => r.code)
  await knex('lowcode_coding_rules')
    .where({ tenant_id: GLOBAL_TENANT_ID })
    .whereIn('code', codingCodes)
    .del()
  await knex('lowcode_validation_rules')
    .where({ tenant_id: GLOBAL_TENANT_ID })
    .whereIn('code', validationCodes)
    .del()
}
