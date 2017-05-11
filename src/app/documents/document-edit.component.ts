import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from '../persist/persistence-manager';
import {ProjectConfiguration} from '../configuration/project-configuration';
import {OnChanges} from '@angular/core';
import {ConfigLoader} from '../configuration/config-loader';

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
export class DocumentEditComponent implements OnChanges, OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader
    ) {}

    ngOnInit():any {
        this.configLoader.getProjectConfiguration().then(projectConfiguration => {
            this.projectConfiguration = projectConfiguration;
        });
    }

    public ngOnChanges() {
        if (this.document) this.persistenceManager.setOldVersions([this.document]);
    }
}