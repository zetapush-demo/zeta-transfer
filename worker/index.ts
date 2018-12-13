import { Zpfs_hdfs, Sendmail, SnapshotItem, CreatedFile, ZpfsToken, FileUploadLocation, ListingEntryInfo } from '@zetapush/platform-legacy';
import { Injectable } from '@zetapush/core';

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

	constructor(
		private hdfs: Zpfs_hdfs,
		private sendmail: Sendmail
	) { }

	/*
	 * Check if the file has not already been upload on filesystem,
	 * if so, delete it, and ask for a upload URL.
	 */

	async getFileUploadURL(path: string): Promise<FileUploadLocation> {
		const file = await this.hdfs.stat({ path });

		if (file.entry)
			await this.hdfs.rm({ path });
		return await this.hdfs.newUploadUrl({ path });
	}

	/*
	 * From multiple paths, zip them and return the zip GUID (use as token).
	 */

	async getZipToken(paths: string[]): Promise<string> {
		var items: SnapshotItem[] = [];

		if (!paths || !paths.length)
			return null;
		paths.forEach(path => items.push({ path }));

		const snapshot: CreatedFile = await this.hdfs.snapshot({
			folder: `./snapshot_${Date.now()}/`,
			items,
			flatten: true,
		});
		if (!snapshot)
			return null;
		console.log(snapshot.path);
		const folder = await this.hdfs.ls({
			folder: snapshot.path
		});
		console.log(folder.entries.content);
		const zipToken: ZpfsToken = await this.hdfs.readToken({
			path: snapshot.path
		})

		return zipToken && zipToken.token;
	}

	/*
	 * Notify that it's done uploading to platform and return hdfs.stat()
	 */

	async validUpload(guid: string): Promise<ListingEntryInfo> {
		return await this.hdfs.newFile({
			guid
		});
	}

	/*
	 * Send mail with the files to download them.
	 */

	async sendMail(to: string[], filesUrl: string[], name: string, message?: string) {
		const subject = `${name} share you ${filesUrl.length} files`;
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