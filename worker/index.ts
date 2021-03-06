import { Zpfs_hdfs, SnapshotItem, CreatedFile, ZpfsToken, FileUploadLocation, ListingEntryInfo } from '@zetapush/platform-legacy';
import { Injectable } from '@zetapush/core';

const HACK = <any>(Zpfs_hdfs);
HACK.DEPLOYMENT_OPTIONS = {
	upload_user_provides_filename: true,
	upload_thumbnails: '80'
};

@Injectable()
export default class Api {

	constructor(
		private hdfs: Zpfs_hdfs,
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
			folder: `./zip_${Date.now()}/`,
			items,
			flatten: true
		});
		const zipToken: ZpfsToken = await this.hdfs.readToken({
			path: snapshot.path
		});

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
}