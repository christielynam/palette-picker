exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'Project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              name: 'Life Savers',
              hex_val_1: '#2B0DBC',
              hex_val_2: '#7C93FE',
              hex_val_3: '#DC8AC9',
              hex_val_4: '#C9309E',
              hex_val_5: '#B442E9',
              project_id: project[0]
            },
            {
              name: 'Cotton Candy',
              hex_val_1: '#135D1D',
              hex_val_2: '#8AF105',
              hex_val_3: '#7946B2',
              hex_val_4: '#27CCB6',
              hex_val_5: '#874D5E',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
