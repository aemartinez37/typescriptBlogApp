import * as utilService from "../services/utils.service";
import * as chai from "chai";

chai.should();
const expect = chai.expect;

/** Util services tests  **/

describe('In util service startsWithABC function', function () {
    context('when string starts with a, b or c', function () {
        it('returns true', function () {
            const booleanResp = utilService.startsWithABC("andres");
            expect(booleanResp).to.be.true;
        });
    });
    context('when string not starts with a, b or c', function () {
        it('returns false', function () {
            const booleanResp = utilService.startsWithABC("martinez");
            expect(booleanResp).to.be.false;
        });
    });
});
