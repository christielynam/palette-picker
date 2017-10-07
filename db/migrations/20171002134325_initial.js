exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('palettes', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('hex_val_1')
      table.string('hex_val_2')
      table.string('hex_val_3')
      table.string('hex_val_4')
      table.string('hex_val_5')
      table.integer('project_id').unsigned()
      table.foreign('project_id')
        .references('projects.id')
      table.timestamps(true, true)
    });
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects'),
  ]);
};
