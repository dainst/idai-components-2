"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var coordinates_utility_1 = require("./coordinates-utility");
var config_loader_1 = require("../../core/configuration/config-loader");
var MapComponent = (function () {
    function MapComponent(configLoader) {
        var _this = this;
        this.onSelectDocument = new core_1.EventEmitter();
        this.polygons = {};
        this.polylines = {};
        this.markers = {};
        this.bounds = []; // in fact L.LatLng[], but leaflet typings are incomplete
        this.typeColors = {};
        this.ready = configLoader.getProjectConfiguration().then(function (projectConfiguration) {
            return projectConfiguration.getTypeColors();
        }).then(function (typeColors) { return _this.typeColors = typeColors; });
    }
    MapComponent.prototype.ngAfterViewInit = function () {
        if (this.map)
            this.map.invalidateSize(false);
    };
    MapComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.map)
            this.map = this.createMap();
        this.ready.then(function () { return _this.updateMap(changes); });
    };
    MapComponent.prototype.createMap = function () {
        var mapOptions = {
            crs: this.getCoordinateReferenceSystem(),
            attributionControl: false,
            minZoom: -20,
            maxZoom: 30,
            maxBoundsViscosity: 0.7
        };
        var map = L.map('map-container', mapOptions);
        var mapComponent = this;
        map.on('click', function (event) {
            mapComponent.clickOnMap(event.latlng);
        });
        return map;
    };
    MapComponent.prototype.updateMap = function (changes) {
        if (!this.update)
            return Promise.resolve();
        this.clearMap();
        this.addGeometriesToMap();
        this.updateCoordinateReferenceSystem();
        return this.setView();
    };
    MapComponent.prototype.setView = function () {
        this.map.invalidateSize(true);
        if (this.stayInBounds && this.bounds.length >= 1) {
            this.map.setMaxBounds(L.latLngBounds(this.bounds));
        }
        else {
            this.map.setMaxBounds(undefined);
        }
        if (this.selectedDocument) {
            if (this.polygons[this.selectedDocument.resource.id]) {
                this.focusPolygons(this.polygons[this.selectedDocument.resource.id]);
            }
            else if (this.polylines[this.selectedDocument.resource.id]) {
                this.focusPolylines(this.polylines[this.selectedDocument.resource.id]);
            }
            else if (this.markers[this.selectedDocument.resource.id]) {
                this.focusMarker(this.markers[this.selectedDocument.resource.id]);
            }
        }
        else if (this.bounds.length > 1) {
            this.map.fitBounds(L.latLngBounds(this.bounds));
        }
        else if (this.bounds.length == 1) {
            this.map.setView(this.bounds[0], 15);
        }
        else {
            this.map.setView([0, 0], 15);
        }
        return Promise.resolve();
    };
    MapComponent.prototype.clearMap = function () {
        for (var i in this.polygons) {
            for (var _i = 0, _a = this.polygons[i]; _i < _a.length; _i++) {
                var polygon = _a[_i];
                this.map.removeLayer(polygon);
            }
        }
        for (var i in this.polylines) {
            for (var _b = 0, _c = this.polylines[i]; _b < _c.length; _b++) {
                var polyline = _c[_b];
                this.map.removeLayer(polyline);
            }
        }
        for (var i in this.markers) {
            this.map.removeLayer(this.markers[i]);
        }
        this.polygons = {};
        this.polylines = {};
        this.markers = {};
    };
    MapComponent.prototype.extendBounds = function (latLng) {
        this.bounds.push(latLng);
    };
    MapComponent.prototype.extendBoundsForMultipleLatLngs = function (latLngs) {
        // Check if latLngs is an array of LatLng objects or an array of arrays of LatLng objects.
        // This is necessary because getLatLngs() returns an array of LatLng objects for points and polylines but an
        // array of arrays of LatLng objects for polygons.
        if (!latLngs[0].lng)
            latLngs = latLngs[0];
        for (var _i = 0, latLngs_1 = latLngs; _i < latLngs_1.length; _i++) {
            var latLng = latLngs_1[_i];
            this.extendBounds(latLng);
        }
    };
    MapComponent.prototype.addGeometriesToMap = function () {
        this.bounds = [];
        this.addMainTypeDocumentGeometryToMap();
        if (this.documents) {
            for (var _i = 0, _a = this.documents; _i < _a.length; _i++) {
                var document_1 = _a[_i];
                if (document_1.resource.geometry)
                    this.addGeometryToMap(document_1);
            }
        }
    };
    MapComponent.prototype.addMainTypeDocumentGeometryToMap = function () {
        if (!this.mainTypeDocument || !this.mainTypeDocument.resource.geometry)
            return;
        if (['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']
            .indexOf(this.mainTypeDocument.resource.geometry.type) == -1) {
            return;
        }
        this.addGeometryToMap(this.mainTypeDocument);
    };
    MapComponent.prototype.addGeometryToMap = function (document) {
        var geometry = document.resource.geometry;
        if (!geometry.coordinates || geometry.coordinates.length == 0)
            return;
        switch (geometry.type) {
            case 'Point':
                var marker = this.addMarkerToMap(geometry.coordinates, document);
                this.extendBounds(marker.getLatLng());
                break;
            case 'LineString':
                var polyline = this.addPolylineToMap(geometry.coordinates, document);
                this.extendBoundsForMultipleLatLngs(polyline.getLatLngs());
                break;
            case 'MultiLineString':
                for (var _i = 0, _a = geometry.coordinates; _i < _a.length; _i++) {
                    var polylineCoordinates = _a[_i];
                    var polyline_1 = this.addPolylineToMap(polylineCoordinates, document);
                    this.extendBoundsForMultipleLatLngs(polyline_1.getLatLngs());
                }
                break;
            case 'Polygon':
                var polygon = this.addPolygonToMap(geometry.coordinates, document);
                this.extendBoundsForMultipleLatLngs(polygon.getLatLngs());
                break;
            case 'MultiPolygon':
                for (var _b = 0, _c = geometry.coordinates; _b < _c.length; _b++) {
                    var polygonCoordinates = _c[_b];
                    var polygon_1 = this.addPolygonToMap(polygonCoordinates, document);
                    this.extendBoundsForMultipleLatLngs(polygon_1.getLatLngs());
                }
                break;
        }
    };
    MapComponent.prototype.addMarkerToMap = function (coordinates, document) {
        var latLng = L.latLng([coordinates[1], coordinates[0]]);
        var color = this.typeColors[document.resource.type];
        var extraClasses = (this.selectedDocument && this.selectedDocument.resource.id == document.resource.id) ?
            'active' : '';
        var icon = this.generateMarkerIcon(color, extraClasses);
        var marker = L.marker(latLng, {
            icon: icon
        });
        marker.document = document;
        marker.bindTooltip(this.getShortDescription(document.resource), {
            offset: L.point(0, -40),
            direction: 'top',
            opacity: 1.0
        });
        var mapComponent = this;
        marker.on('click', function () {
            mapComponent.select(this.document);
        });
        marker.addTo(this.map);
        this.markers[document.resource.id] = marker;
        return marker;
    };
    MapComponent.prototype.addPolylineToMap = function (coordinates, document) {
        var polyline = this.getPolylineFromCoordinates(coordinates);
        polyline.document = document;
        if (document == this.mainTypeDocument) {
            this.setPathOptionsForMainTypeDocument(polyline, document);
        }
        else {
            this.setPathOptions(polyline, document, 'polyline');
        }
        var polylines = this.polylines[document.resource.id] ? this.polylines[document.resource.id] : [];
        polylines.push(polyline);
        this.polylines[document.resource.id] = polylines;
        return polyline;
    };
    MapComponent.prototype.addPolygonToMap = function (coordinates, document) {
        var polygon = this.getPolygonFromCoordinates(coordinates);
        polygon.document = document;
        if (document == this.mainTypeDocument) {
            this.setPathOptionsForMainTypeDocument(polygon, document);
        }
        else {
            this.setPathOptions(polygon, document, 'polygon');
        }
        var polygons = this.polygons[document.resource.id] ? this.polygons[document.resource.id] : [];
        polygons.push(polygon);
        this.polygons[document.resource.id] = polygons;
        return polygon;
    };
    MapComponent.prototype.setPathOptions = function (path, document, className) {
        if (this.selectedDocument && this.selectedDocument.resource.id == document.resource.id) {
            className = className + ' active';
        }
        var style = { color: this.typeColors[document.resource.type], className: className };
        path.setStyle(style);
        path.bindTooltip(this.getShortDescription(document.resource), {
            direction: 'center',
            opacity: 1.0
        });
        var mapComponent = this;
        path.on('click', function (event) {
            if (mapComponent.select(this.document))
                L.DomEvent.stop(event);
        });
        path.addTo(this.map);
    };
    MapComponent.prototype.setPathOptionsForMainTypeDocument = function (path, document) {
        path.setStyle({
            color: this.typeColors[document.resource.type],
            className: 'main',
            interactive: false
        });
        path.addTo(this.map);
    };
    MapComponent.prototype.focusMarker = function (marker) {
        this.map.panTo(marker.getLatLng(), { animate: true, easeLinearity: 0.3 });
    };
    MapComponent.prototype.focusPolylines = function (polylines) {
        var bounds = [];
        for (var _i = 0, polylines_1 = polylines; _i < polylines_1.length; _i++) {
            var polyline = polylines_1[_i];
            bounds.push(polyline.getLatLngs());
        }
        this.map.fitBounds(bounds);
    };
    MapComponent.prototype.focusPolygons = function (polygons) {
        var bounds = [];
        for (var _i = 0, polygons_1 = polygons; _i < polygons_1.length; _i++) {
            var polygon = polygons_1[_i];
            bounds.push(polygon.getLatLngs());
        }
        this.map.fitBounds(bounds);
    };
    MapComponent.prototype.getShortDescription = function (resource) {
        var shortDescription = resource.identifier;
        if (resource.shortDescription && resource.shortDescription.length > 0) {
            shortDescription += ' | ' + resource.shortDescription;
        }
        return shortDescription;
    };
    MapComponent.prototype.clickOnMap = function (clickPosition) {
        this.deselect();
    };
    MapComponent.prototype.select = function (document) {
        this.onSelectDocument.emit(document);
        return true;
    };
    MapComponent.prototype.deselect = function () {
        this.onSelectDocument.emit(null);
    };
    MapComponent.prototype.getPolylineFromCoordinates = function (coordinates) {
        return L.polyline(coordinates_utility_1.CoordinatesUtility.convertPolylineCoordinatesFromLngLatToLatLng(coordinates));
    };
    MapComponent.prototype.getPolygonFromCoordinates = function (coordinates) {
        return L.polygon(coordinates_utility_1.CoordinatesUtility.convertPolygonCoordinatesFromLngLatToLatLng(coordinates));
    };
    MapComponent.prototype.generateMarkerIcon = function (color, extraClasses) {
        if (extraClasses === void 0) { extraClasses = ''; }
        return L.VectorMarkers.icon({
            prefix: 'mdi',
            icon: 'checkbox-blank-circle',
            markerColor: color,
            extraClasses: extraClasses
        });
    };
    MapComponent.prototype.updateCoordinateReferenceSystem = function () {
        this.map.options.crs = this.getCoordinateReferenceSystem();
    };
    MapComponent.prototype.getCoordinateReferenceSystem = function () {
        if (!this.projectDocument)
            return L.CRS.Simple;
        switch (this.projectDocument.resource.coordinateReferenceSystem) {
            case 'EPSG4326 (WGS 84)':
                return L.CRS.EPSG4326;
            case 'EPSG3857 (WGS 84 Web Mercator)':
                return L.CRS.EPSG3857;
            default:
                return L.CRS.Simple;
        }
    };
    return MapComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], MapComponent.prototype, "documents", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MapComponent.prototype, "selectedDocument", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MapComponent.prototype, "mainTypeDocument", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MapComponent.prototype, "projectDocument", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MapComponent.prototype, "stayInBounds", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MapComponent.prototype, "update", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MapComponent.prototype, "onSelectDocument", void 0);
MapComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'map',
        template: '<div id="map-container"></div>'
    })
    /**
     * @author Thomas Kleinke
     */
    ,
    __metadata("design:paramtypes", [config_loader_1.ConfigLoader])
], MapComponent);
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map