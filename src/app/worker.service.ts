import { Injectable } from '@angular/core';

import { WeakClient, ProxyTaskService } from '@zetapush/client';
import { FileUploadLocation } from '@zetapush/platform-legacy';

export interface MyEvent {
	name: string;
	address: string;
	date: string;
}

@Injectable({
	providedIn: 'root'
})
export class WorkerService {

	client: WeakClient;
	api: ProxyTaskService;

	constructor() {
		this.client = new WeakClient({
			platformUrl: 'http://hq.zpush.io:9080/zbo/pub/business/',
			appName: 'pumj9v7yg'
		});
		this.api = this.client.createProxyTaskService();
	}

	async sendFiles(files: File[]): Promise<string> {
		var paths: string[] = [];

		files.forEach(async (file) => {
			const pathname = `${file.name}_${file.size}_${Date.now()}`;
			const transfer = await this.api.getFileUploadURL(pathname);

			paths.push(pathname);
			await this.upload(transfer, file);
		});
		return await this.api.getZipUrl(paths) as string;
	}

	private async upload(transfer: FileUploadLocation, file: File) {
		return new Promise<any>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (200 <= xhr.status && xhr.status < 300)
						resolve({ transfer, file });
					else
						reject({ transfer, file });
				}
			};
			xhr.open(transfer.httpMethod, this.getSecureUrl(transfer.url), true);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.send(file);
		});
	}

	private getSecureUrl(url) {
		const HTTP_PATTERN = /^http:\/\/|^\/\//;
		const HTTPS_PROTOCOL = 'https:';
		const FORCE_HTTPS = typeof location === 'undefined' ? false : location.protocol === HTTPS_PROTOCOL;

		return FORCE_HTTPS ? url.replace(HTTP_PATTERN, `${HTTPS_PROTOCOL}//`) : url;
	};
}