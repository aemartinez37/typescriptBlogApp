import { Routes } from "./routes/routes";
import { database } from "./config/database";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from "path";
import * as cookieParser from 'cookie-parser';
import * as session from "express-session";
import * as passport from "passport";
import * as connectSessionSequelize from 'connect-session-sequelize';
import errorMiddleware from './middleware/error.middleware';

const SequelizeStore = connectSessionSequelize(session.Store);
const flash = require("connect-flash");

class App {
    public app: express.Application;
    public routes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routes.routes(this.app);
        this.app.use(errorMiddleware);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(morgan("dev"));

        /* Sessions config */
        // Config passport for using app strategies
        const configPassport = require("./config/passport");
        configPassport();
        //Using sequelize for store sessions in postgres
        var sessionStore = new SequelizeStore({
            db: database
        });
        this.app.use(session({
            saveUninitialized: false,
            secret: "TH=|~hDN<r,Ln2t^zB9#L.5i*cmKH{",
            store: sessionStore,
            resave: false
        }));
        sessionStore.sync();
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        /* Views config */
        this.app.set("views", path.resolve(__dirname, "./views/pages"));
        this.app.set("view engine", "ejs");

        /* Static JS & CSS */
        this.app.use(express.static(path.join(__dirname, './public')));
    }
}

export default new App().app;