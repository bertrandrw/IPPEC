/**
 * Creates an object composed of the picked object properties.
 * @param object The source object.
 * @param keys The properties to pick.
 * @returns The new object.
 */
export const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
//# sourceMappingURL=pick.js.map