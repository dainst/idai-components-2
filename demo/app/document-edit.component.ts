import {Component, Input, OnInit} from '@angular/core';
import {Validator} from '../../src/app/persist/validator';
import {Messages} from '../../src/app/messages/messages';
import {ProjectConfiguration} from '../../src/app/configuration/project-configuration';
import {ConfigLoader} from '../../src/app/configuration/config-loader';

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

    private validator: Validator;


    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages
    ) {}


    ngOnInit(): any {
        this.validator = new Validator(this.configLoader);

        (this.configLoader.getProjectConfiguration() as any).then((projectConfiguration: any) => {
            this.projectConfiguration = projectConfiguration;
        });
    }


    public validate(doc: any) {

        this.validator.validate(doc).catch(
            msgsWithParams => {
                this.messages.add(msgsWithParams);
            }
        );
    }
}