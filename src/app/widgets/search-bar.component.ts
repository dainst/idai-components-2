import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ConfigLoader} from '../configuration/config-loader';
import {IdaiType} from '../configuration/idai-type';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    templateUrl: './search-bar.html',
    host: {
        '(document:click)': 'handleClick($event)',
    }
})

/**
 * @author Sebastian Cuy
 * @author Thomas Kleinke
 * @author Jan G. Wieners
 */
export class SearchBarComponent implements OnChanges {

    // If these values are set, only valid domain types for the given relation name & range type are shown in the
    // filter menu.
    @Input() relationName: string;
    @Input() relationRangeType: string;

    // If this value is set, only child types of the parent type are shown in the filter menu.
    // The 'all types' option is not visible if a parent type is set because choosing the parent type is equivalent to
    // this option.
    @Input() parentType: string;

    @Input() q: string = '';
    @Input() types: string[];
    @Input() showFiltersMenu: boolean = true;

    @Output() onTypesChanged = new EventEmitter<string[]>();
    @Output() onQueryStringChanged = new EventEmitter<string>();

    @ViewChild('p') private popover;

    private filterOptions: Array<IdaiType> = [];


    constructor(private configLoader: ConfigLoader) {}

    public ngOnChanges(changes: SimpleChanges) {

        if (changes['relationName'] || changes['relationRangeType'] || changes['parentType'] ||
            changes['showFiltersMenu']) {
            this.initializeFilterOptions();
        }
    }

    public chooseTypeFilter(type: IdaiType) {

        if (!type) {
            this.types = undefined;
        } else {
            this.types = [type.name];

            if (type.children) {
                for (let childType of type.children) {
                    this.types.push(childType.name);
                }
            }
        }

        this.onTypesChanged.emit(this.types);
    }

    public emitQueryString() {

        this.onQueryStringChanged.emit(this.q);
    }

    private initializeFilterOptions() {

        this.filterOptions = [];

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            for (let type of projectConfiguration.getTypesTreeList()) {

                if (this.parentType && type.name != this.parentType) continue;



                if ((!this.relationName && !this.relationRangeType)
                        || projectConfiguration.isAllowedRelationDomainType(type.name, this.relationRangeType,
                        this.relationName)) {

                    if (this.relationRangeType == 'Project' && type.isAbstract) continue;

                    this.addFilterOption(type);

                } else if (type.children) {

                    for (let childType of type.children) {
                        if (projectConfiguration.isAllowedRelationDomainType(childType.name, this.relationRangeType,
                                this.relationName)) {
                            this.addFilterOption(childType);
                        }
                    }
                }

            }
        });
    }

    private addFilterOption(type: IdaiType) {

        if (this.filterOptions.indexOf(type) == -1) {
            this.filterOptions.push(type);
        }
    }

    private handleClick(event) {

        if (!this.popover) return;
        let target = event.target;
        let inside = false;
        do {
            if (target.id === 'filter-button') {
                inside = true;
                break;
            }
            target = target.parentNode;
        } while (target);
        if (!inside) {
            this.popover.close();
        }
    }
}