import {Injectable} from '@angular/core';

@Injectable()
export class MapState {
    
    private zoom: number;
    private center: L.LatLng;
    
    
    public setCenter(center) {
        this.center = center;
    }

    public getCenter(): L.LatLng {
        return this.center;
    }
    
    public setZoom(zoom: number) {
        this.zoom = zoom;
    }
    
    public getZoom(): number {
        return this.zoom;
    }
}