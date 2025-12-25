import bcrypt from 'bcrypt';

const password = 'admin@1234';  
const hashed = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hashed);