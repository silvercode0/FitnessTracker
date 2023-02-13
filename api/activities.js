const express = require('express');
const router = express.Router();

const { requireUser } = require("./utilities");
const { 
    createActivity, 
    updateActivity, 
    getAllActivities, 
    getPublicRoutinesByActivity 
} = require("../db");

router.post('/', requireUser, async (req, res, next) => {
    
    const { name, description } = req.body;
    const activityData = { name, description };
    
    try {
        
        const activity = await createActivity(activityData);
        
        if (!activity) {
            next({
                
                name: "ErrorGettingActivities",
                message: "Activity does not exist",
            });
        }
        
        res.send({ activity });
    } catch (error) {
        
        next(error);
    }
});

function requireUser(req, res, next) {
    
    if (!req.user) {
        
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        });
    }
    
    next();
  }
  
  module.exports = {
    
    requireUser
}

router.get('/', async (req, res) => {
    
    const activities = await getAllActivities();
    
    res.send({ activities });
});

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
