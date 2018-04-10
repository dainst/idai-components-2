import {Component, Input} from '@angular/core';
import {ProjectConfiguration} from '../../src/core/configuration/project-configuration';

@Component({
    moduleId: module.id,
    selector: 'document-edit',
    templateUrl: './document-edit.html'
})
/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class DocumentEditComponent {

    @Input() document: any;
    @Input() primary: string;

    constructor(
        public projectConfiguration: ProjectConfiguration
    ) {}
}