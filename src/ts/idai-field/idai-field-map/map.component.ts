import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {IdaiFieldDocument} from '../idai-field-model/idai-field-document';
import {IdaiFieldResource} from '../idai-field-model/idai-field-resource';
import {IdaiFieldPolyline} from './idai-field-polyline';
import {IdaiFieldPolygon} from './idai-field-polygon';
import {IdaiFieldMarker} from './idai-field-marker';
import {CoordinatesUtility} from './coordinates-utility';
import {ConfigLoader} from '../../core/configuration/config-loader';

// no typings for VectorMarkers available
declare global {
    namespace L {
        module VectorMarkers {
            function icon(option: any): any;
        }
    }
}

@Component({
    moduleId: module.id,
    selector: 'map',
    template: '<div id="map-container"></div>'
})

/**
 * @author Thomas Kleinke
 */
export class MapComponent implements OnChanges {

    @Input() documents: Array<IdaiFieldDocument>;
    @Input() selectedDocument: IdaiFieldDocument;
    @Input() mainTypeDocument: IdaiFieldDocument;
    @Input() projectDocument: IdaiFieldDocument;
    @Input() stayInBounds: boolean;
    @Input() update: boolean;

    @Output() onSelectDocument: EventEmitter<IdaiFieldDocument> = new EventEmitter<IdaiFieldDocument>();

    protected ready: Promise<any>;

    protected map: L.Map;
    protected polygons: { [resourceId: string]: Array<IdaiFieldPolygon> } = {};
    protected polylines: { [resourceId: string]: Array<IdaiFieldPolyline> } = {};
    protected markers: { [resourceId: string]: IdaiFieldMarker } = {};

    protected bounds: any[] = []; // in fact L.LatLng[], but leaflet typings are incomplete
    protected typeColors: { [typeName: string]: string } = {};

    constructor(configLoader: ConfigLoader) {

        this.ready = configLoader.getProjectConfiguration().then(projectConfiguration => {
            return projectConfiguration.getTypeColors();
        }).then(typeColors => this.typeColors = typeColors);
    }

    public ngAfterViewInit() {

        if (this.map) this.map.invalidateSize(false);
    }

    public ngOnChanges(changes: SimpleChanges) {

        if (!this.map) this.map = this.createMap();

        this.ready.then(() => this.updateMap(changes));
    }

    private createMap(): L.Map {

        const mapOptions: L.MapOptions = {
            crs: this.getCoordinateReferenceSystem(),
            attributionControl: false,
            minZoom: -20,
            maxZoom: 30,
            maxBoundsViscosity: 0.7
        };

        const map: L.Map = L.map('map-container', mapOptions);

        let mapComponent = this;
        map.on('click', function(event: L.MouseEvent) {
            mapComponent.clickOnMap(event.latlng);
        });

        return map;
    }

    protected updateMap(changes: SimpleChanges): Promise<any> {

        if (!this.update) return Promise.resolve();

        this.clearMap();
        this.addGeometriesToMap();
        this.updateCoordinateReferenceSystem();

        return this.setView();
    }

    protected setView(): Promise<any> {

        this.map.invalidateSize(true);

        if (this.stayInBounds && this.bounds.length >= 1) {
            this.map.setMaxBounds(L.latLngBounds(this.bounds));
        } else {
            this.map.setMaxBounds(undefined);
        }

        if (this.selectedDocument) {
            if (this.polygons[this.selectedDocument.resource.id]) {
                this.focusPolygons(this.polygons[this.selectedDocument.resource.id]);
            } else if (this.polylines[this.selectedDocument.resource.id]) {
                this.focusPolylines(this.polylines[this.selectedDocument.resource.id]);
            } else if (this.markers[this.selectedDocument.resource.id]) {
                this.focusMarker(this.markers[this.selectedDocument.resource.id]);
            }
        } else if (this.bounds.length > 1) {
            this.map.fitBounds(L.latLngBounds(this.bounds));
        } else if (this.bounds.length == 1) {
            this.map.setView(this.bounds[0], 15);
        } else {
            this.map.setView([0, 0], 15);
        }

        return Promise.resolve();
    }

    private clearMap() {

        for (let i in this.polygons) {
            for (let polygon of this.polygons[i]) {
                this.map.removeLayer(polygon);
            }
        }

        for (let i in this.polylines) {
            for (let polyline of this.polylines[i]) {
                this.map.removeLayer(polyline);
            }
        }

        for (let i in this.markers) {
            this.map.removeLayer(this.markers[i]);
        }

        this.polygons = {};
        this.polylines = {};
        this.markers = {};
    }

    protected extendBounds(latLng: L.LatLng) {

        this.bounds.push(latLng);
    }

    private extendBoundsForMultipleLatLngs(latLngs: Array<any>) {

        // Check if latLngs is an array of LatLng objects or an array of arrays of LatLng objects.
        // This is necessary because getLatLngs() returns an array of LatLng objects for points and polylines but an
        // array of arrays of LatLng objects for polygons.
        if (!latLngs[0].lng) latLngs = latLngs[0];

        for (let latLng of latLngs) {
            this.extendBounds(latLng);
        }
    }

    private addGeometriesToMap() {

        this.bounds = [];

        this.addMainTypeDocumentGeometryToMap();

        if (this.documents) {
            for (let document of this.documents) {
                if (document.resource.geometry) this.addGeometryToMap(document);
            }
        }
    }

    private addMainTypeDocumentGeometryToMap() {

        if (!this.mainTypeDocument || !this.mainTypeDocument.resource.geometry) return;

        if (['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']
                .indexOf(this.mainTypeDocument.resource.geometry.type) == -1) {
            return;
        }

        this.addGeometryToMap(this.mainTypeDocument);
    }

    private addGeometryToMap(document: IdaiFieldDocument) {

        const geometry = document.resource.geometry;

        if (!geometry.coordinates || geometry.coordinates.length == 0) return;

        switch(geometry.type) {
            case 'Point':
                let marker: IdaiFieldMarker = this.addMarkerToMap(geometry.coordinates, document);
                this.extendBounds(marker.getLatLng());
                break;
            case 'LineString':
                let polyline: IdaiFieldPolyline = this.addPolylineToMap(geometry.coordinates, document);
                this.extendBoundsForMultipleLatLngs(polyline.getLatLngs());
                break;
            case 'MultiLineString':
                for (let polylineCoordinates of geometry.coordinates) {
                    let polyline: IdaiFieldPolyline = this.addPolylineToMap(polylineCoordinates, document);
                    this.extendBoundsForMultipleLatLngs(polyline.getLatLngs());
                }
                break;
            case 'Polygon':
                let polygon: IdaiFieldPolygon = this.addPolygonToMap(geometry.coordinates, document);
                this.extendBoundsForMultipleLatLngs(polygon.getLatLngs());
                break;
            case 'MultiPolygon':
                for (let polygonCoordinates of geometry.coordinates) {
                    let polygon: IdaiFieldPolygon = this.addPolygonToMap(polygonCoordinates, document);
                    this.extendBoundsForMultipleLatLngs(polygon.getLatLngs());
                }
                break;
        }
    }

    private addMarkerToMap(coordinates: any, document: IdaiFieldDocument): IdaiFieldMarker {

        let latLng = L.latLng([coordinates[1], coordinates[0]]);

        let color = this.typeColors[document.resource.type];
        let extraClasses = (this.selectedDocument && this.selectedDocument.resource.id == document.resource.id) ?
            'active' : '';
        let icon = this.generateMarkerIcon(color, extraClasses);
        let marker: IdaiFieldMarker = L.marker(latLng, {
            icon: icon
        });
        marker.document = document;

        marker.bindTooltip(this.getShortDescription(document.resource), {
            offset: L.point(0, -40),
            direction: 'top',
            opacity: 1.0});

        let mapComponent = this;
        marker.on('click', function() {
            mapComponent.select(this.document);
        });

        marker.addTo(this.map);
        this.markers[document.resource.id] = marker;

        return marker;
    }

    private addPolylineToMap(coordinates: any, document: IdaiFieldDocument): IdaiFieldPolyline {

        let polyline: IdaiFieldPolyline = this.getPolylineFromCoordinates(coordinates);
        polyline.document = document;

        if (document == this.mainTypeDocument) {
            this.setPathOptionsForMainTypeDocument(polyline, document);
        } else {
            this.setPathOptions(polyline, document, 'polyline');
        }

        let polylines: Array<IdaiFieldPolyline>
            = this.polylines[document.resource.id] ? this.polylines[document.resource.id] : [];
        polylines.push(polyline);
        this.polylines[document.resource.id] = polylines;

        return polyline;
    }

    private addPolygonToMap(coordinates: any, document: IdaiFieldDocument): IdaiFieldPolygon {

        let polygon: IdaiFieldPolygon = this.getPolygonFromCoordinates(coordinates);
        polygon.document = document;

        if (document == this.mainTypeDocument) {
            this.setPathOptionsForMainTypeDocument(polygon, document);
        } else {
            this.setPathOptions(polygon, document, 'polygon');
        }

        let polygons: Array<IdaiFieldPolygon>
            = this.polygons[document.resource.id] ? this.polygons[document.resource.id] : [];
        polygons.push(polygon);
        this.polygons[document.resource.id] = polygons;

        return polygon;
    }

    private setPathOptions(path: L.Path, document: IdaiFieldDocument, className: string) {

        if (this.selectedDocument && this.selectedDocument.resource.id == document.resource.id) {
            className = className + ' active';
        }

        let style = { color: this.typeColors[document.resource.type], className: className };

        path.setStyle(style);

        path.bindTooltip(this.getShortDescription(document.resource), {
            direction: 'center',
            opacity: 1.0
        });

        let mapComponent = this;
        path.on('click', function (event: L.Event) {
            if (mapComponent.select(this.document)) L.DomEvent.stop(event);
        });

        path.addTo(this.map);
    }

    private setPathOptionsForMainTypeDocument(path: L.Path, document: IdaiFieldDocument) {

        path.setStyle({
            color: this.typeColors[document.resource.type],
            className: 'main',
            interactive: false
        });

        path.addTo(this.map);
    }

    private focusMarker(marker: L.Marker) {

        this.map.panTo(marker.getLatLng(), { animate: true, easeLinearity: 0.3 });
    }

    private focusPolylines(polylines: Array<L.Polyline>) {

        let bounds = [];
        for (let polyline of polylines) {
            bounds.push(polyline.getLatLngs());
        }
        this.map.fitBounds(bounds);
    }

    private focusPolygons(polygons: Array<L.Polygon>) {

        let bounds = [];
        for (let polygon of polygons) {
            bounds.push(polygon.getLatLngs());
        }
        this.map.fitBounds(bounds);
    }

    private getShortDescription(resource: IdaiFieldResource) {

        let shortDescription = resource.identifier;
        if (resource.shortDescription && resource.shortDescription.length > 0) {
            shortDescription += ' | ' + resource.shortDescription;
        }

        return shortDescription;
    }

    protected clickOnMap(clickPosition: L.LatLng) {

        this.deselect();
    }

    protected select(document: IdaiFieldDocument): boolean {

        this.onSelectDocument.emit(document);
        return true;
    }

    protected deselect() {

        this.onSelectDocument.emit(null);
    }

    private getPolylineFromCoordinates(coordinates: Array<any>): L.Polyline {

        return L.polyline(<any> CoordinatesUtility.convertPolylineCoordinatesFromLngLatToLatLng(coordinates));
    }

    private getPolygonFromCoordinates(coordinates: Array<any>): L.Polygon {

        return L.polygon(<any> CoordinatesUtility.convertPolygonCoordinatesFromLngLatToLatLng(coordinates));
    }

    protected generateMarkerIcon(color: string, extraClasses: string = ''): L.Icon {

        return L.VectorMarkers.icon({
            prefix: 'mdi',
            icon: 'checkbox-blank-circle',
            markerColor: color,
            extraClasses: extraClasses
        });
    }

    private updateCoordinateReferenceSystem() {

        this.map.options.crs = this.getCoordinateReferenceSystem();
    }

    private getCoordinateReferenceSystem(): L.CRS {

        if (!this.projectDocument) return L.CRS.Simple;

        switch (this.projectDocument.resource.coordinateReferenceSystem) {
            case 'EPSG4326 (WGS 84)':
                return L.CRS.EPSG4326;
            case 'EPSG3857 (WGS 84 Web Mercator)':
                return L.CRS.EPSG3857;
            default:
                return L.CRS.Simple;
        }
    }
}
