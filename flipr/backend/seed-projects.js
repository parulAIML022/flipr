const Database = require('better-sqlite3');

const db = new Database('flipr.db');

// Sample projects matching the reference design
const sampleProjects = [
  {
    name: 'Consultation',
    description: 'Property Consultation, Downtown District',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Design',
    description: 'Modern Home Design, Suburban Area',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Marketing & Design',
    description: 'Vibrant Property Marketing, Coastal Region',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Consultation & Marketing',
    description: 'Sales Success Campaign, Urban Center',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Consultation',
    description: 'Professional Consultation, Business District',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Check if projects already exist
const existingProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get();

if (existingProjects.count === 0) {
  console.log('Seeding database with sample projects...');
  
  const insertProject = db.prepare('INSERT INTO projects (name, description, image) VALUES (?, ?, ?)');
  
  const insertMany = db.transaction((projects) => {
    for (const project of projects) {
      insertProject.run(project.name, project.description, project.image);
    }
  });

  insertMany(sampleProjects);
  
  console.log(`Successfully added ${sampleProjects.length} projects to the database.`);
} else {
  console.log(`Database already has ${existingProjects.count} projects. Skipping seed.`);
  console.log('If you want to reset, delete flipr.db and run this script again.');
}

db.close();

