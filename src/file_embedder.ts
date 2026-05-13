/* Responsible for copying a file and generating its embed link */
import { App, normalizePath, TFile } from "obsidian";

export class FileEmbedder {
    private app: App;
    private attachmentsFolder: string;

    constructor(app: App, attachmentsFolder: string) {
        this.app = app;
        this.attachmentsFolder = attachmentsFolder;
    }

    embedLinkFor(file: TFile): string {
        return "![[" + file.path + "]]\n";
    }

    async copyFileToAttachmentsDir(file: File): Promise<TFile> {
        // Make the attachments directory, if it doesn't exist
        if (!this.app.vault.getAbstractFileByPath(this.attachmentsFolder)) {
            await this.app.vault.createFolder(this.attachmentsFolder);
        }
        const destination = this.getAvailableDestination(file.name);

        const buffer = await file.arrayBuffer();
        return await this.app.vault.createBinary(destination, buffer);
    }

    // Return a unique path for the provided filename to avoid overwriting attachments
    private getAvailableDestination(filename: string): string {
        const extensionStart = filename.lastIndexOf(".");
        const basename = extensionStart > 0 ? filename.slice(0, extensionStart) : filename;
        const extension = extensionStart > 0 ? filename.slice(extensionStart) : "";

        let index = 0;
        while (true) {
            const candidateName = index === 0 ? filename : `${basename} (${index})${extension}`;
            const candidatePath = normalizePath(`${this.attachmentsFolder}/${candidateName}`);

            if (!this.app.vault.getAbstractFileByPath(candidatePath)) {
                return candidatePath;
            }

            index++;
        }
    }
}
