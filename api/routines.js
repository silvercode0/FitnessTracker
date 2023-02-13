const express = require('express');
const router = express.Router();

const { requireUser } = require("./utils");

const { 
    getAllPublicRoutines, 
    createRoutine,
    attachActivitiesToRoutines,
 } = require("../db");

// GET /api/routines
router.use((req, res, next) => {
    console.log("A request is being made to /routines");
  
    next(); 
  });
  
router.get("/routines", async (req, res) => {
    const routines = await getAllPublicRoutines();
   
    res.send({
      routines,
    });
  });

// POST /api/routines
router.post("/routines", requireUser, async (req, res, next) => {

    const { name, goal, isPublic } = req.body;
  
    try {
      
      const routines = await createRoutine(name, goal, isPublic);
      // this will create the activity for us
  
      if (routines) {
        res.send(routines);
        // if the activity comes back, res.send({ activity });
  
      } else {
        next({
          name: 'RoutineDataError',
          message: `Routine not created properly`
        });
        // otherwise, next an appropriate error object
      }
  
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities
router.post("/routines/:routineId/activities", async (req, res, next) => {

    const { activityId, count, duration } = req.body;
  
    try {
      
      const attachActivityToRoutine = await attachActivitiesToRoutines(activityId, count, duration);
      // this will create the activity for us
  
      if (attachActivityToRoutine) {
        res.send(attachActivityToRoutine);
        // if the activity comes back, res.send({ activity });
  
      } else {
        next({
          name: 'AttachingActivityToRoutinesDataError',
          message: `Activity not attached to Routine properly`
        });
        // otherwise, next an appropriate error object
      }
  
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = router;
