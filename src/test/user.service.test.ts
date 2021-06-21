import { User, UserInterface } from "../models/user.model";
import { database } from "../config/database";
import * as userService from "../services/user.service";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

chai.should();
chai.use(chaiAsPromised);
const expect = chai.expect;

/** User services tests  **/

//User for test
const testUser: UserInterface = {
    userName: "amartinez",
    firstName: "ANDRES",
    lastName: "MARTINEZ",
    email: "amartinez@stackbuilders.com",
    pwdHash: "clave",
};

describe('In user service', function () {
    context('when request all users', function () {
        it('retrieves al least 1 user with email property', function () {
            return expect(userService.getAll()
                .then((users) => {
                    expect(users.length).to.have.at.least(1);
                    users.map(user => expect(user).to.have.property('email'));
                })).to.be.fulfilled;
        });
    });

    context('when used username', function () {
        it('rejects with username or email already used.', function () {
            testUser.userName = 'amartinez';
            return expect(userService.create(testUser)
            ).to.be.rejectedWith('Username or email already used.');
        });
    });

    context('when used email', function () {
        it('rejects with username or email already used.', function () {
            testUser.email = 'amartinez@stackbuilders.com';
            return expect(userService.create(testUser)
            ).to.be.rejectedWith('Username or email already used.');
        });
    });

    context('when wrong email', function () {
        it('rejects with wrong email', function () {
            testUser.email = 'correofds.com';
            return expect(userService.create(testUser)
            ).to.be.rejectedWith('Wrong Email');
        });
    });

    context('when empty username', function () {
        it('rejects with incomplete user data', function () {
            testUser.userName = '';
            return expect(userService.create(testUser)
            ).to.be.rejectedWith('Incomplete User data');
        });
    });

    context('when weak password', function () {
        it('rejects with password policy', function () {
            return expect(userService.validateSecurePassword(testUser.pwdHash)
            ).to.be.rejectedWith('Password must contain: \n*Minimum eight characters\n*At least: \n\tOne digit\n\tOne uppercase letter\n\tOne lowercase letter\n\tOne special character');
        });
    });

    after(function () {
        database.close();
    });
});
