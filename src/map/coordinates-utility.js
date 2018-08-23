"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoordinatesUtility = /** @class */ (function () {
    function CoordinatesUtility() {
    }
    CoordinatesUtility.convertPolygonCoordinatesFromLngLatToLatLng = function (coordinates) {
        var result = JSON.parse(JSON.stringify(coordinates));
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var pathCoordinates = result_1[_i];
            for (var _a = 0, pathCoordinates_1 = pathCoordinates; _a < pathCoordinates_1.length; _a++) {
                var pointCoordinates = pathCoordinates_1[_a];
                var lng = pointCoordinates[0];
                var lat = pointCoordinates[1];
                pointCoordinates[0] = lat;
                pointCoordinates[1] = lng;
            }
        }
        return result;
    };
    CoordinatesUtility.convertPolylineCoordinatesFromLngLatToLatLng = function (coordinates) {
        var result = JSON.parse(JSON.stringify(coordinates));
        for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
            var pointCoordinates = result_2[_i];
            var lng = pointCoordinates[0];
            var lat = pointCoordinates[1];
            pointCoordinates[0] = lat;
            pointCoordinates[1] = lng;
        }
        return result;
    };
    return CoordinatesUtility;
}());
exports.CoordinatesUtility = CoordinatesUtility;
//# sourceMappingURL=coordinates-utility.js.map