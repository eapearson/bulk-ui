import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { FtpService } from '../services/ftp.service'
import { HTTP_PROVIDERS }    from '@angular/http';

import { JobService } from '../services/job.service';
import { WorkspaceService } from '../services/workspace.service';

import { MdButton } from '@angular2-material/button'

@Component({
    templateUrl: 'app/edit-meta.view/edit-meta.view.html',
    styleUrls: ['app/edit-meta.view/edit-meta.view.css'],
    providers: [
        JobService,
        WorkspaceService,
        HTTP_PROVIDERS
    ],
    directives: [
        ROUTER_DIRECTIVES,
        MdButton
    ]
})

export class EditMetaView implements OnInit {
    files = [];
    selectedPath;
    selectedCount;
    errorMessage;

    narratives;
    selectedNarrative;

    importInProgress: boolean = false;

    exampleSpec = [{
        name: 'Import Name',
        prop: "importName",
        required: 'true', // need to implement
        type: 'wsObject'  // need to implemented error handling in UI
    }, {
        name: 'Contig Set',
        prop: "contigSet",
        type: 'string'
    }]

    // cell interaction
    cellSelection: boolean = false;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer,
        private ftp: FtpService,
        private jobService: JobService,
        private wsService: WorkspaceService) {

        this.ftp.selectedPath$.subscribe(path => this.selectedPath = path)
    }

    ngOnInit() {
        this.preprocessData();
        this.selectedCount = this.ftp.selectedFiles.length;

        this.wsService.listNarratives().subscribe(res => {
            this.narratives = res;
            this.selectedNarrative = this.narratives[0];
        })
    }

    selectNarrative(index) {
        this.selectedNarrative = this.narratives[index];
    }

    startImport() {
        console.log('starting import!')
        this.importInProgress = true;

        let path = this.files[0].path,
            wsName = this.selectedNarrative.wsName;

        this.jobService.runGenomeTransform(path, wsName)
            .subscribe(res => {
                console.log('import response', res)

                this.jobService.createImportJob([res])
                    .subscribe(res => {
                        console.log('create import res', res)
                        this.importInProgress = false;
                })
            })

    }

    // method to copy selected file data
    // and add any defaults to edit meta table data
    preprocessData() {
        let files = Object.assign([], this.ftp.selectedFiles);


        for (let i=0; i < files.length; i++) {
            let file = files[i];

            file['meta'] = {
                importName: file.name.replace(/[^\w\-\.\_]/g,'-')
            }
        }

        console.log('resulting files', files)
        this.files = files;
    }

    showData() {
        console.log('data to save', this.files)
    }

    selectCell(e) {
        this.cellSelection = true;
        console.log('event', e, this.cellSelection)

    }

    mouseUp(e) {
        this.cellSelection = false;
        console.log('event', e, this.cellSelection)
    }

    mouseOver(e) {
        console.log('e', e);
        //this.renderer.setElementClass(e.fromElement, 'selected', true);
        //this.renderer.setElementClass(e.target, 'selected', true);
    }



}