import { Component, ViewChild, ElementRef } from '@angular/core';

import { WorkerService } from '../worker.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

	formTypes: string[] = ['Email', 'Link'];
	formType = this.formTypes[0];
	files: File[] = [];
	url: string;

	@ViewChild('yourName') yourName: ElementRef;
	@ViewChild('sendTo') sendTo: ElementRef;
	@ViewChild('message') message: ElementRef;

	constructor(
		private workerService: WorkerService,
	) { }

	async addFiles(inputFiles: File[]) {
		this.files = this.files.concat(...inputFiles);
	}

	async transferFiles() {
		if (this.files && this.files.length) {
			const token = await this.workerService.sendFiles(this.files);

			this.url = await this.workerService.getUrlFromToken(token);
			console.log('token', token);
		}
		if (this.url && this.formType === this.formTypes[0])
			await this.workerService.api.sendMail(
				this.sendTo.nativeElement.value,
				this.url,
				this.yourName.nativeElement.value,
				this.message.nativeElement.value || ''
			);
		this.files = [];
	}
}
