import {Component, OnChanges, Input} from '@angular/core';
import {ConfigLoader} from '../configuration/config-loader';


@Component({
  selector: 'type-icon',
  template: '<div class="type-icon" [style.width]="pxSize" [style.height]="pxSize" [style.font-size]="pxSize" [style.line-height]="pxSize" [style.background-color]="color">' +
    '<span class="character" [style.color]="textColor">{{character}}</span>' +
  '</div>'
})

/**
 * @author Sebastian Cuy
 */
export class TypeIconComponent implements OnChanges {

    @Input() size: number;
    @Input() type: string;

    private character: string;
    private color: string;
    private textColor: string;
    private pxSize: string;


    constructor(private configLoader: ConfigLoader) { }


    ngOnChanges() {

        (this.configLoader.getProjectConfiguration() as any).then((config: any) => {
            this.character = config.getLabelForType(this.type).substr(0, 1);
            this.color = config.getColorForType(this.type);
            this.textColor = config.getTextColorForType(this.type);
            this.pxSize = this.size + 'px';
        });
    }
}