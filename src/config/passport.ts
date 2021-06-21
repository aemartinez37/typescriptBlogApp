import { User } from "../models/user.model";
import * as userService from "../services/user.service";
import * as passport from 'passport';
import * as passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

module.exports = function () {

  // Serialize user in session
  passport.serializeUser(function (user: User, done) {
    done(null, user.id);
  });

  // Deserialize user in session
  passport.deserializeUser(function (id: number, done) {
    userService.getOne(id).then(function (user: User) {
      if (user) {
        done(null, user.get());
      } else {
        done(user, null);
      }
    });
  });

  // Local strategy for login
  passport.use("login", new LocalStrategy({
    usernameField: 'usernameEmail',
    passwordField: 'password'
  },
    function (username: string, password: string, done) {
      userService.getByUsernameOrEmail(username)
        .then(users => {
          const user = users[0]
          if (!user) {
            return done(null, false, {
              message: "No user found."
            });
          }
          userService.validateUserPassword(password, user.pwdHash)
            .then(valid => {
              if (valid) {
                return done(null, user);
              }
              return done(null, false, {
                message: "Invalid password."
              });
            })
            .catch(err => {
              let message = err;
              return done(null, false, {
                message: message
              });
            })
        })
        .catch(err => {
          return done(null, false, {
            message: "Error while login for session."
          });
        })
    }));
};