import { UserInterface } from "../models/user.model";

/* Order alphabetically by passed property array of UserInterface */
export function alphabeticallyUsersOrder(usersArray: UserInterface[], propertyToOrder: string): UserInterface[] {
    return usersArray.sort(function sortArray(elementA, elementB) { //Sort is a higher-order function (receives function as parameter)
        let lowerPropertyA = getLowerPropertyObject(elementA, propertyToOrder);
        let lowerPropertyB = getLowerPropertyObject(elementB, propertyToOrder);
        return (lowerPropertyA() > lowerPropertyB()) ? 1 : ((lowerPropertyB() > lowerPropertyA()) ? -1 : 0)
    });
}

/* Filter passed property of array of UserInterface that starts with a, b or c */
export function abcStartsPropertyFilter(usersArray: UserInterface[], propertyToOrder: string): UserInterface[] {
    return usersArray.filter(function filterFunction(arrayObj) { //Filter is a higher-order function (receives function as parameter)
        let lowerProperty = getLowerPropertyObject(arrayObj, propertyToOrder);
        return startsWithABC(lowerProperty())
    });
}

/* Return boolean if string starts with a, b or c */
export function startsWithABC(objectProperty: string) {
    return ['a', 'b', 'c'].includes(objectProperty[0]);
}

/* Return function of property object lowercase (Higher-order function) */
function getLowerPropertyObject(object, propertyName) {
    return function lowerProperty() {
        return object[propertyName].toLowerCase();
    }
}