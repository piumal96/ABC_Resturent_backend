const bcrypt = require('bcrypt'); // or 'bcrypt' if you want to test the original

async function testBcrypt() {
    const password = '1234'; // Example password to test
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);

    // Compare the password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password Match:', isMatch);
}

testBcrypt();
