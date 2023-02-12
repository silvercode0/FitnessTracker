const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    console.log("Creating USERS to use")

    const { rows: [ user ] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `, [ username, hashedPassword ]);
    // need to input a username and password to have a user created //
    // give those inputs values, so it gives us easy access //
    // need to create a error handler to handle duplicate username inputs //
    // lastly we need to return the id and username //
    // then we use the hashedpassword to encrypt the creditials (password) //
    return user;
  } catch (error) {

    console.log("ERROR Creating User")
    throw error;
  }
}

async function getUser({ username, password }) {
  if ( !username || !password ) return 

  try {
    console.log("Getting Users to Use")

    const user = await getUserByUsername(username);
    // need to get the user so we can have access to the username and password //
    const hashedPassword = user.password;
    // need to create the hash password //
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    // then we use the hashedpassword to encrypt the creditials (password) //

    if (passwordsMatch) {
      // we do not want to have duplicate passwords // 
      delete user.password

      return user;
    } else {

      return null;
    }
  } catch (error) {

    console.log("Error Getting Users or User")
    console.log(error)
    throw error;
  }
}

async function getUserById(id) {
  try {
    console.log("Getting User By Id")

    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id = ${ id }
    `);
    // trying to get a user by their id //
    if (!user) {

      return null
    // we dont want anything that isn't a user //
    } else {

      delete user.password;
      // we want to delete the password because we just want the user id //
      return user;
    }
    
  } catch (error) {

    console.log("Error Trying to Get User By Id")
    throw error;
  }

}

async function getUserByUsername(username) {
  try {
    console.log("Getting User By Username")

    const { rows: [ user ] } = await client.query(`
      SELECT * 
      FROM users
      WHERE username = $1;
    `, [ username ]);
    // trying to get the user by their specific username //
    return user;
  } catch (error) {

    console.log("Error Getting User By Username")
    throw error;
  }

}
// don't forget to export those functions //
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
