"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedUtils = sharedUtils;
exports.greet = greet;
exports.getCurrentDateTime = getCurrentDateTime;
function sharedUtils() {
    return 'shared-utils';
}
function greet(name) {
    return `Hello, ${name} from UIT-GO shared utils!`;
}
function getCurrentDateTime() {
    return new Date().toISOString();
}
//# sourceMappingURL=shared-utils.js.map