
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
            { name: 'Life Savers', hex_val_1: '#678H53', hex_val_2: '#F56J73', hex_val_3: '#24KJ87',
            hex_val_4: '#8723D5',
            hex_val_5: '#9E45H6', project_id: project[0] },
            { name: 'Cotton Candy', hex_val_1: '#678H53', hex_val_2: '#F56J73', hex_val_3: '#24KJ87',
            hex_val_4: '#8723D5',
            hex_val_5: '#9E45H6', project_id: project[0] }}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
