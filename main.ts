import { Plugin } from 'obsidian';
import { FileModal } from "./file_modal";

export default class ImageInserter extends Plugin {
	async onload() {
		this.addCommand({
			id: 'image-insert',
			name: 'Insert image(s)',
			callback: () => {
				new FileModal(this.app).open();
			}
		});
	}
}
