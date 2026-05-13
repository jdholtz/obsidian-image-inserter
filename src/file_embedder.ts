/* Responsible for copying a file and generating its embed link */
import { App, normalizePath } from "obsidian";

export class FileEmbedder {
    private app: App;
    private attachmentsFolder: string;

    constructor(app: App, attachmentsFolder: string) {
        this.app = app;
        this.attachmentsFolder = attachmentsFolder;
    }

    embedLinkFor(filename: string): string {
        return "![[" + filename + "]]\n";
    }

    async copyFileToAttachmentsDir(file: File): Promise<string> {
        // Make the attachments directory, if it doesn't exist
        if (!this.app.vault.getAbstractFileByPath(this.attachmentsFolder)) {
            await this.app.vault.createFolder(this.attachmentsFolder);
        }
        const destination = normalizePath(`${this.attachmentsFolder}/${file.name}`);

        const buffer = await file.arrayBuffer();
        await this.app.vault.createBinary(destination, buffer);

        return destination;
    }
}
