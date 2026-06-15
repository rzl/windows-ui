import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasApps = await knex.schema.hasTable('lowcode_apps')
  if (!hasApps) {
    await knex.schema.createTable('lowcode_apps', (table) => {
      table.increments('id').primary()
      table.string('code', 100).notNullable().unique()
      table.string('name', 200).notNullable()
      table.string('category', 100).nullable()
      table.string('icon', 100).nullable()
      table.text('description').nullable()
      table.tinyint('status').defaultTo(1)
      table.integer('published_version_id').nullable()
      table.timestamp('create_time').defaultTo(knex.fn.now())
      table.timestamp('update_time').defaultTo(knex.fn.now())
    })
  }

  const hasItems = await knex.schema.hasTable('lowcode_app_items')
  if (!hasItems) {
    await knex.schema.createTable('lowcode_app_items', (table) => {
      table.increments('id').primary()
      table.integer('app_id').notNullable()
      table.string('type', 50).notNullable() // model / report / dashboard / flow / print / datasource / page
      table.string('ref_code', 100).notNullable()
      table.string('ref_name', 200).nullable()
      table.integer('sort').defaultTo(0)
      table.timestamp('create_time').defaultTo(knex.fn.now())
    })
  }

  const hasVersions = await knex.schema.hasTable('lowcode_app_versions')
  if (!hasVersions) {
    await knex.schema.createTable('lowcode_app_versions', (table) => {
      table.increments('id').primary()
      table.integer('app_id').notNullable()
      table.string('version', 50).notNullable()
      table.text('snapshot').notNullable()
      table.text('description').nullable()
      table.tinyint('is_published').defaultTo(0)
      table.timestamp('create_time').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_app_versions')
  await knex.schema.dropTableIfExists('lowcode_app_items')
  await knex.schema.dropTableIfExists('lowcode_apps')
}
