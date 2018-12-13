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
			platformUrl: 'https://celtia.zetapush.com/zbo/pub/business',
			appName: 'vx4ca4oqq'
		});
		this.api = this.client.createProxyTaskService();
	}

	/*
	 * Upload each files and group them into zip, return the token corresponding
	 * to the folder containing all these files on the ZetaPush platform
	 */

	async sendFiles(files: File[]): Promise<string> {
		var paths: string[] = [];

		for (var i = 0; i < files.length; i++) {
			const pathname = `${files[i].name}_${files[i].size}_${Date.now()}`;
			const transfer: FileUploadLocation = await this.api.getFileUploadURL(pathname);

			paths.push(pathname);
			await this.upload(transfer, files[i]);
			await this.api.validUpload(transfer.guid);
		}
		console.log('paths', paths);
		return await this.api.getZipToken(paths) as string;
	}

	/*
	 * From token representing the access for the folder,
	 * return an URL for an HTTP GET download
	 */

	async getUrlFromToken(token: string) {
		const appName = 'vx4ca4oqq';
		const deployId = 'zpfs_hdfs_0';
		const rtNode = await (<any>this.client).getServers();

		console.log('rtNode', rtNode);
		return `${rtNode[0]}/rest/deployed/${appName}/${deployId}/zip/${token}`;
	}

	private async upload(transfer: FileUploadLocation, file: File) {
		return new Promise<any>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					console.log('upload :', file.name, xhr.status);
					if (xhr.status >= 200 && xhr.status < 300)
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