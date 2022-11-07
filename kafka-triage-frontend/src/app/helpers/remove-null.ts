export class RemoveNull {
  /**
   * Removes null and undefined values from the given object.
   *
   * @param object object to remove null and undefined values from
   */
  static removeNulls(object: any) {
    Object.keys(object).forEach((key) => {
      if (object[key] && typeof object[key] === 'object') {
        // remove empty arrays
        if (Array.isArray(object[key]) && object[key].every((x: any) => x === null || x === '')) {
          delete object[key];
        } else {
          RemoveNull.removeNulls(object[key]);
        }
      } else if (object[key] === null || object[key] === '' || typeof object[key] === 'undefined') {
        delete object[key];
      }
    });
  }
}
