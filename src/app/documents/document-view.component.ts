import {Component, OnChanges, Input} from "@angular/core";
import {Router} from "@angular/router";
import {ConfigLoader} from "../configuration/config-loader";

@Component({
    selector: 'document-view',
    moduleId: module.id,
    templateUrl: './document-view.html'
})

/**
 * @author Thomas Kleinke
 * @author Sebastian Cuy
 */
export class DocumentViewComponent implements OnChanges {

    @Input() document: any;
    @Input() basePath: string;

    private typeLabel;

    constructor(
        private router: Router,
        private configLoader: ConfigLoader
    ) {

    }

    ngOnChanges() {
        if (!this.document) return;
        if (!this.basePath) this.basePath = '';
        this.configLoader.getProjectConfiguration().then(projectConfiguration => {
            this.typeLabel = projectConfiguration.getLabelForType(this.document.resource.type)
        });
    }
}