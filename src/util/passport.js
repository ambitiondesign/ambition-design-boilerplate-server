//we import passport packages required for authentication
import passport from 'passport';
import passportLocal from 'passport-local';
import UserService from '../services/UserService';
const LocalStrategy = passportLocal.Strategy;

// Telling passport we want to use a Local Strategy. In other words,
//we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async function(username, password, done) {
    try{
      // When a user tries to sign in this code runs
      const user = await UserService.getUser(username);
      if (!user) {
        return done(null, false, {
          message: "Incorrect username."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      const valid = await UserService.validatePassword(password, user.password);
      if (!valid) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
    } catch(err) {
      return done(err);
    }
    
    // If none of the above, return the user
    return done(null, user);
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user.username);
});
//
passport.deserializeUser(async (username, done) => {
  try {
    let user = await UserService.getUser(username);
    if (!user) {
      return done(new Error('user not found'));
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
});

// Exporting our configured passport
export default passport;