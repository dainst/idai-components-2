"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coordinates_utility_1 = require("../../../../src/field/map/coordinates-utility");
/**
 * @author Thomas Kleinke
 */
describe('CoordinatesUtility', function () {
    it('convert polygon coordinates from lngLat to latLng', function () {
        var coordinates = [[[-7.0, -5.0], [-6.0, -5.0], [7.0, -7.0], [9.0, 1.0], [7.0, 7.0], [5.0, 10.0],
                [-7.0, 7.0]]];
        var expectedResult = [[[-5.0, -7.0], [-5.0, -6.0], [-7.0, 7.0], [1.0, 9.0], [7.0, 7.0], [10.0, 5.0],
                [7.0, -7.0]]];
        var result = coordinates_utility_1.CoordinatesUtility.convertPolygonCoordinatesFromLngLatToLatLng(coordinates);
        expect(result).toEqual(expectedResult);
    });
    it('convert polyline coordinates from lngLat to latLng', function () {
        var coordinates = [[1.0, 3.0], [1.5, 2.5], [1.75, 2.5], [1.9, 2.25], [1.35, 2.0], [1.0, 1.0]];
        var expectedResult = [[3.0, 1.0], [2.5, 1.5], [2.5, 1.75], [2.25, 1.9], [2.0, 1.35], [1.0, 1.0]];
        var result = coordinates_utility_1.CoordinatesUtility.convertPolylineCoordinatesFromLngLatToLatLng(coordinates);
        expect(result).toEqual(expectedResult);
    });
});
//# sourceMappingURL=coordinates-utility.spec.js.map