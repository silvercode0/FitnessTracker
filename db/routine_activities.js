const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration }) {
// similar function to the other functions that we did with creating the items //
  try {
    console.log("Trying to Add Activity to Routine");
    
    const { rows: [ routine_activity ] } = await client.query(`
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      ON CONFLICT ("routineId","activityId") DO NOTHING
      RETURNING *;
    `, [ routineId, activityId, count, duration ]);
    // selecting routine_activity and then we are inserting some new data into each activity // 
    // we need to give each routine activity a value so it gives us easy access of locating one //
    // we do not want to have any duplicates // think of it as merging the two but updating it + keeping the orginal ones // 
    // lastly everything gets returned //

    console.log("Done Adding Activity to Routine");
    return routine_activity;
    // return that new routine with the activity added //
  } catch (error) {

    throw error; 
  }
}

async function getRoutineActivityById(id) {
   
  try {
    console.log("Getting Routine Activity by Id")

    const { rows: [ routine_activity ] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id = $1;
    `, [ id ]);
    // we need to select all, specificly from routine_activities //
    // in this situation we only want the to use the id to retreive everything //
    // you are taking the specific id and finding the routine activity that matches (?) // 
    //
    
    console.log("Done Getting Routine Activity by Id");
    return routine_activity;
    // return the routine_activity //
  } catch (error) {

    throw error;
  }

}

async function getRoutineActivitiesByRoutine({ id }) {
  // very similar to what we did in the function getRoutineActivityById // 
  try {
    console.log("Starting to Get Routine Activities by Routine");
    
    const { rows: routine_activity } = await client.query(`

      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1;
    `, [ id ]);
    // selecting everything from routine activities // you need that 
    // think of this as a different way to do something // only differences is what you want 

    console.log("Done Getting Routine Activities by Routine");
    return routine_activity;
    // returning the routine_activity
  } catch (error) {

    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  // we can refer back to our previous functions on updating to help us with this function // similar indeed 

  const indexString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');

  try {
    console.log("Starting to Update Routine Activity");

    const { rows: [ routine_activity ] } = await client.query(`

      UPDATE routine_activities
      SET ${indexString}
      WHERE id = ${id}
      RETURNING *;
    `, Object.values(fields));
    // we need to update the routine activities // defined another variable that doesn't counter-react with others made previously //
    // fields is uesed to tell us that we want to update everything withing the routine // plus we do it by using the id //
    console.log("Done Updating Routine Activity");
    return routine_activity;
  } catch (error) {

    throw error;
  }
}


async function destroyRoutineActivity(id) {

  try {
    console.log("Starting to Destroy Routine Activity");

    const { rows: [ routine_activity ] } = await client.query(`

      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
    `, [ id ]);
    // deleting the routine activity by its id //
    
    console.log("Done Destroying Routine Activity");
    return routine_activity;
  } catch (error) {

    throw error;
  }

}

async function canEditRoutineActivity(routineActivityId, userId) {

  try {
    console.log("Starting to Edit Routine Activity");

    const { rows: [ routine_activities ] } = await client.query(`

      SELECT *
      FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE "creatorId" = ${userId}
      AND routine_activities.id = ${routineActivityId};
    `);
    // we want to edit the routine activity by retrieving it using the routineActivityId and userId //
    // in the long run all these funtions relate to one another by the specific values and labels each one have //
    console.log("Done Editing the Routine Activity");
    return routine_activities;
  } catch (error) {

    throw error;
  }

}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
