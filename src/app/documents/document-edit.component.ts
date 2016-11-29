import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from "./persistence-manager";
import {ProjectConfiguration} from "../configuration/project-configuration";
import {OnChanges} from "@angular/core";
import {ConfigLoader} from "../configuration/config-loader";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Component({
    moduleId: module.id,
    selector: 'document-edit',
    templateUrl: './document-edit.html'
})

export class DocumentEditComponent implements OnChanges,OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader
    ) {}

    ngOnInit():any {
        this.configLoader.configuration().subscribe((result)=>{
            if(result.error != undefined) return;
            
            this.projectConfiguration = result.projectConfiguration;
            this.persistenceManager.setProjectConfiguration(this.projectConfiguration);
        });
    }


    public ngOnChanges() {
        if (this.document) this.persistenceManager.setOldVersion(this.document);
    }
}