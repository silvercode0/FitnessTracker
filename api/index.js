const express = require('express');
const cors = require('cors');
const app = express()
const router = express.Router();

app.use(cors())

app.get('/products/:id', function (req, res,) {
  
  res.json({msg: 'This is CORS-enabled for all origins!'});
})
app.listen(58, function () {
  
  console.log('CORS-enabled web server listening on port 58');
})

// GET /api/health
router.get('/health', async () => {

  console.log('server is running on port 58');
});

router.use(async (req, res, next) => {
    const prefix = 'Bearer';

    const auth = req.header('Authorization');

    if (!auth) {
    
    } else if (auth.startsWith(prefix)) {

      const token = auth.slice(prefix.length);

      try {

        const parsedToken = jwt.verify(token, JWT_SECRET);

        const id = parsedToken && parsedToken.id

        if (id) {

          req.user = await getUserById(id);
          next();
        }

      } catch (error) {

        next(error);
      }

    } else {

      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });

    }
    
  });

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
