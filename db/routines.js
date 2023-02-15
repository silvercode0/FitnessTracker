const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
// need to make sure we require this funtion because if not certain functions will not run properly //

async function createRoutine({ creatorId, isPublic, name, goal }) {
  // we can refer to what we did in the createUser function to help us out here //
  try {
    console.log("Starting to Create Routines");

    const { rows: [ routine ] } = await client.query(`

      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,[creatorId, isPublic, name, goal]);
    // we want to take what we have for routines and insert information into them //
    // we want to give each one a value // each routine gets own value //
    // we can not have duplicate routine names // we want them all new //
    // then we return everything to make it the new routine //

    console.log("Done Creating Routines");
    return routine;
    // returning the new and improved routine //
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  // we can refer to the functions getUserById & getUserByUsename to help us out here // very similar //
  try {
    console.log("Starting to Get Routine by Id");

    const { rows: [ routine ] } = await client.query(`

      SELECT * 
      FROM routines
      WHERE routines.id = $1;
    `,[ id ]);
    // we are selecting everything from routines located as routines.id so we can retrieve the routine id //
    console.log("Done Getting Routines by Id");
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    console.log("Starting to Get Routines Without Activities");

    const { rows: routines } = await client.query(` 
      SELECT *
      FROM routines;
    `);

    console.log("Done Getting Routines Without Activities");
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    console.log("Starting to get All Routines");

    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    `);
    // we want to select all of the routines and next also get the user username for each routine // the user username will be known as creatorName with their routine //
    // join them together (users to routines) // need to take the creatorId which is used to create a routine and equal it to the users.id (joining two together) //

    console.log("Done Getting All Routines");
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  // this function you can refer to the Get All Routines but only wanting the public ones //
  // we can set it up the same but will need to change things so we get the public ones //
  try {
    console.log("Starting to Get Routines Without Activities");

    const { rows: routines } = await client.query(` 
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE "isPublic"=true;
    `);

    console.log("Done Getting Routines Without Activities");
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    console.log("Starting to Get All Routines By User");
    // we can refer to getPublicRoutinesByUser to use as a base to help us with the function //

    const { rows: routines } = await client.query(
      `

      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE username=$1;
    `, [username]);

    console.log("Done Getting All Routines By User");
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  // to help us alot we need to refer to previous functions //
  try {
    console.log("Starting to Get Public Routines By User");

    const { rows: routines } = await client.query(
      ` 

      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1
      AND "isPublic" = true;
    `,
      [username]
    );
    // its very similar to the previous functions we did that are almost the same but have different bases //
    // selecting everything under routines // get the username //
    // then we are wanting to join that to users // creator.id and users.id // are same (?)
    // back when we created the routine we used "isPublic" // thats where we get the public key from //
    // which then leads us to just get the public routines //
    console.log("Done Getting Puble Routines By User");
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  // this function is similar to the previous functions and Attach Activities to Routines // Get All Routines //
  // refer to the previous ones to help with this function //
  try {
    console.log("Starting to Get Public Routines By Activities");

    const { rows: routines } = await client.query(
      `

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true
    AND routine_activities."activityId" = $1; 
    `,
      [id]
    );
    // linking up funtions so we can access Public Routines //
    // we have the id and we are navigating to get ther public routines and then will return the updated routine //
    // + with all the new information //

    console.log("Done Getting Public Routines By Activities");
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  // this function is similar to Update Routine & Update Routine Activity //
  // we can refer to them when trying to create this function //
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    console.log("Starting to Update Routine");

    if (setString.length > 0) {
      const {
        rows: [routine],
      } = await client.query(
        `

          UPDATE routines
          SET ${setString}
          WHERE id = ${id}
          RETURNING *;
        `,
        Object.values(fields)
      );

      console.log("Done Updating Routine");
      return routine;
    }
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  // we can refer to the function destroy Routine Activities // very similar
  try {
    console.log("Starting to Get Routines Without Activities");
    // we will need to delete the routine from both the routine activity and the routine group itself //
    // first we want to delete it from the routine activities group and then we can delete it from the routine group //
    // i find it easier if we delete it first from the routine_activities because of what has more priority lol //

    await client.query(
      `

      DELETE FROM routine_activities
      WHERE "routineId" = $1
      RETURNING *;
    `,
      [id]
    );

    const {
      rows: [routine],
    } = await client.query(
      `

      DELETE FROM routines
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );

    console.log("Done Getting Routines Without Activities");
    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
