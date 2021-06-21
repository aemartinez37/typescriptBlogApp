
import * as passport from "passport";

//Login using strategy of passport config - if ok redirect to /profile
export function openSessionLogin(req, res, next) {
    passport.authenticate("login", function (err, user, message) {
        let viewMessage;
        if (message) {
            viewMessage = message.message;
        }
        if (err || !user) {
            return saveAndRedirect('error', viewMessage, '/login', req, res);
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return saveAndRedirect('info', 'Welcome @' + user.userName, '/profile', req, res);
        });
    })(req, res, next);
}

//Verify if user is authenticated
export function loggedInUser(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        saveAndRedirect('error', 'Login is required', '/login', req, res);
    }
}

//Keep user actions and redirect
export function saveAndRedirect(messageType: string, message: string, redirectPage: string, req, res) {
    req.flash(messageType, message);
    req.session.save(function () {
        res.redirect(redirectPage);
    });
}