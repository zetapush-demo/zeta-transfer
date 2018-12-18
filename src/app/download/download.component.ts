import { Component, OnInit } from '@angular/core';

import { WorkerService } from '../worker.service';

@Component({
	selector: 'app-download',
	templateUrl: './download.component.html',
	styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

	url: string;

	constructor(
		private workerService: WorkerService,
	) { }

	async ngOnInit() {
		const token = window.location.href.split('/').pop();

		this.url = await this.workerService.getUrlFromToken(token);
	}
}
