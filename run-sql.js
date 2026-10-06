const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(':memory:');

function runSqlFile(fileName) {
  const filePath = path.join(__dirname, 'sql', fileName);
  const sql = fs.readFileSync(filePath, 'utf8');
  return db.exec(sql);
}

console.log('\n=== Creating database schema ===');
runSqlFile('schema.sql');

console.log('=== Loading sample data ===');
runSqlFile('sample_data.sql');

console.log('\n=== Scenario 1: Round-trip transactions ===');

const scenario1 = fs.readFileSync(
  path.join(__dirname, 'sql', 'scenario1_round_trip.sql'),
  'utf8'
);

const results1 = db.prepare(scenario1).all();

console.table(results1);

console.log('\n=== Scenario 2: IPL 2024 consecutive scoring streak ===');

const scenario2 = fs.readFileSync(
  path.join(__dirname, 'sql', 'scenario2_ipl_streak.sql'),
  'utf8'
);

const results2 = db.prepare(scenario2).all();

console.table(results2);

db.close();

console.log('\n=== SQL validation completed successfully ===');