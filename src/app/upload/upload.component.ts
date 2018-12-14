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
			this.url = '';
			const token = await this.workerService.sendFiles(this.files);

			this.url = await this.workerService.getUrlFromToken(token);
			console.log('token', token);
		}

		if (this.formType === this.formTypes[0]) {
			const yourName = this.yourName.nativeElement.value;
			const sendTo = this.sendTo.nativeElement.value;
			const message = this.message.nativeElement.value;

			if (this.url && sendTo.length && yourName.length)
				await this.workerService.api.sendMail(sendTo, this.url, yourName, message || '');
		}
		this.files = [];
	}
}
