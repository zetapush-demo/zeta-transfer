import { Component } from '@angular/core';

import { WorkerService } from '../worker.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

	files: File[] = [];
	url: string;

	constructor(
		private workerService: WorkerService,
	) { }

	async addFiles(inputFiles: File[]) {
		this.files = this.files.concat(...inputFiles);
	}

	async transferFiles() {
		if (this.files && this.files.length) {
			this.url = '';
			const token = await this.workerService.sendFiles(this.files);

			console.log('token', token);
			this.url = `${window.location.origin}/${token}`;
		}
		this.files = [];
	}
}
