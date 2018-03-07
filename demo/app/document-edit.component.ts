import {Component, Input, OnInit} from '@angular/core';
import {ProjectConfiguration} from '../../src/core/configuration/project-configuration';
import {ConfigLoader} from '../../src/core/configuration/config-loader';

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
export class DocumentEditComponent implements OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;


    constructor(
        private configLoader: ConfigLoader
    ) {}


    ngOnInit(): any {

        (this.configLoader.getProjectConfiguration() as any).then((projectConfiguration: any) => {
            this.projectConfiguration = projectConfiguration;
        });
    }
}