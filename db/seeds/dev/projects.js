exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all palettes first
    .then(() => knex('projects').del()) // delete all projects

    // Now that we have a clean slate, we can re-insert our project data
    .then(() => {
      return Promise.all([

        // Insert a single project, return the project ID, insert 2 palettes
        knex('projects').insert({
          name: 'Project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { name: 'Life Savers', hex_val_1: '#2B0DBC', hex_val_2: '#7C93FE', hex_val_3: '#DC8AC9', hex_val_4: '#C9309E', hex_val_5: '#B442E9', project_id: project[0] },
            { name: 'Cotton Candy', hex_val_1: '#135D1D', hex_val_2: '#8AF105', hex_val_3: '#7946B2', hex_val_4: '#27CCB6', hex_val_5: '#874D5E', project_id: project[0] }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
