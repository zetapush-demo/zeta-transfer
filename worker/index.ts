import { Zpfs_hdfs, FileUploadLocation, Sendmail } from '@zetapush/platform-legacy';
import { Injectable, Context } from '@zetapush/core';

export interface MyEvent {
	name: string;
	address: string;
	date: string;
}

const HACK = <any>(Zpfs_hdfs);
HACK.DEPLOYMENT_OPTIONS = {
	upload_user_provides_filename: true,
	upload_thumbnails: '80'
};

@Injectable()
export default class Api {

	private requestContext: Context;

	constructor(
		private hdfs: Zpfs_hdfs,
		private sendmail: Sendmail
	) { }

	/*
	 * Parse a randomly generated number in string as a base number 36
	 */

	private generateEventID(): string {
		return Math.random().toString(36).substring(2);
	}

	/*
	 * Check if the file has not already been upload on filesystem,
	 * if so, delete it, and ask for a upload URL.
	 */

	async getFileUploadURL(name: string, type: string): Promise<FileUploadLocation> {
		const path = `/${this.requestContext.owner}_${name}_${Date.now()}`;
		const file = await this.hdfs.stat({ path });

		if (file.entry)
			await this.hdfs.rm({ path });
		return await this.hdfs.newUploadUrl({
			contentType: type,
			path
		});
	}

	/*
	 * From file guid, get file url from filesystem
	 */

	async getFileURL(guid: string): Promise<string> {
		const { url } = await this.hdfs.newFile({
			guid
		});

		return url.url;
	}

	/*
	 * Send mail with the files to download them.
	 */

	async sendMail(to: string[], filesUrl: string[], subject: string, message?: string) {
		var text: string = `${message}\nClick on each file to download them !\n\n`;

		filesUrl.forEach(url =>
			text = text.concat(`\t- ${url}\n`)
		);
		await this.sendmail.send({
			to,
			subject,
			text
		})
	}
}