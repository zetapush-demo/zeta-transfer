import { Component } from '@angular/core';

import { WorkerService } from '../worker.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

	formTypes: string[] = ['Email', 'Link'];
	formType = 'Email';
	files: File[] = [];
	url: string;

	constructor(
		private workerService: WorkerService,
	) { }

	async addFiles(inputFiles: File[]) {
		this.files = this.files.concat(...inputFiles);
		console.log(this.files);
	}

	async transferFiles() {
		this.url = 'https://we.tl/t-VulQcRzjkJ';
		// if (this.files && this.files.length) {
		// 	const token = await this.workerService.sendFiles(this.files);

		// 	this.url = await this.workerService.getUrlFromToken(token);
		// }
		// if (this.formType === 'EMAIL')
		// 	await this.workerService.api.sendMail();
		this.files = [];
	}
}
