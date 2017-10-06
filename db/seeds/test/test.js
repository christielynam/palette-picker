exports.seed = function(knex, Promise) {

  return knex('palettes').del() // delete all palettes first
    .then(() => knex('projects').del()) // delete all projects

    .then(() => {
      return Promise.all([

        // Insert a single project, return the project ID, insert 2 palettes
        knex('projects').insert({
          id: 1,
          name: 'Project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              id: 1,
              name: 'Life Savers',
              hex_val_1: '#2B0DBC',
              hex_val_2: '#7C93FE',
              hex_val_3: '#DC8AC9',
              hex_val_4: '#C9309E',
              hex_val_5: '#B442E9',
              project_id: project[0]
            },
            {
              id: 2,
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
