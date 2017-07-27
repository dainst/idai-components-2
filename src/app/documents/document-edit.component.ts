import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from '../persist/persistence-manager';
import {Validator} from '../persist/validator';
import {Messages} from '../messages/messages';
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

    private validator : Validator;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader,
        private messages: Messages
    ) {}

    ngOnInit():any {
        this.validator = new Validator(this.configLoader);

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {
            this.projectConfiguration = projectConfiguration;
        });
    }

    public ngOnChanges() {
        if (this.document) this.persistenceManager.setOldVersions([this.document]);
    }

    public validate(doc) {
        this.validator.validate(doc).catch(
            msgsWithParams => {
                this.messages.add(msgsWithParams);
            }
        );
    }
}