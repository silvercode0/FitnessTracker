// const { CommandCompleteMessage } = require('pg-protocol/dist/messages');
const client = require('./client');

// database functions
async function getAllActivities() {
  // select and return an array of all activities

  try {

  console.log("Getting All Activities")

  const { rows: activities } = await client.query(` 

    SELECT *
    FROM activities;
  `);

  console.log("Done Getting All Activities")
  return activities;
  } catch (error) {

    throw error;
  }
}

async function getActivityById(activityId) {
  try {
    console.log("Getting Activity By It's Id")

    const { rows: [ activity ] } = await client.query(`
      SELECT *
      FROM activities
      WHERE id=$1
    `, [activityId]);
    
    console.log("Done Getting Activity By It's Id")
    return activity;
  } catch (error) {

    throw error; 
  }

}

async function createActivity({ name, description }) {
  try {
    console.log("Starting to Create Activities")

    const { rows: [ activity ] } = await client.query(` 

    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [ name, description ]);
    
    return activity;
  } catch (error) {

    throw error;
  }

}




async function getActivityByName(name) {

  try {
    console.log("Getting Activity By Name")
    
    const { rows: [ activity ] } = await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1
    `, [ name ]);    
    
    console.log("Done Retrieving Activity By Name")
    return activity;
  } catch (error) {

    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  const routineArray = [...routines];
  // you will need to define a varaible to use to get the routines as an array //
  const attach = routines.map((routine) => routine.id);
  // this will be used to attach the activities to the routines // 
  // im using the map method cause I need the results of the function, i provided for each & every element to create a new array // 

  if (routines.length === 0) {
    return;
    // if there is no routine, jump out of function/break, do not continue // we just want rountines //
  }

  try {
    console.log("Trying to Attach Activities to Routines")
    
    const { rows: [ activities ] } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, 
      routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" 
      IN (${attach.map((routineId, index) => ('$' + (index + 1))).join(',')});
    `, attach);
    // need to select everything from the activity and get the specific each activity listed //
    // we will select all of those and then give them an id so we can use each one in the new array //
    // we will be getting everything from activities //
    // you will need to join them together to form routine_activities // activity joining //
    // 
    // we will then locate it from routine_activities."routineId" to use // 
    // map method to generate a new array of the results gotten from using the function //

    for (const routine of routineArray) {
      // you are taking the values and looping them to the routineArray // passing them through // 
      // routine is the variable and routineArray is what you are trying to iterate (or be iterable) //
      const addActivities = activities.filter((activity) => routine.id === activity.routineId);
      // defining a variable that will take the activities and filter them as routine.id which would be only equal to activity.routineId //
      // uses a callback function for each element within the array (once) // 
      // then you want to construct the new array of all the new values for which the callback function returns as truthy //
      routine.activities = addActivities;
    };

    console.log("Done Attaching Activities to Routines");

    return routineArray;
  } catch (error) {

    throw error;
  }
  
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity 
  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');

  try {
    console.log("Starting to Update Activity");

     if (setString.length > 0) {

      const { rows } = await client.query(`

        UPDATE activities
        SET ${ setString }
        WHERE id = ${ id }
        RETURNING *;
      `, Object.values(fields));

      console.log("Done Updating Activity");
      return rows[0];
    }
  } catch (error) {

    throw error;
  }
  
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
