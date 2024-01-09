/* Responsible for copying a file and generating its embed link */
import fs from "fs";
import path from "path";

export class FileEmbedder {
    private attachmentsFolder: string;

    constructor(attachmentsFolder: string) {
        this.attachmentsFolder = attachmentsFolder;
    }

    embedLinkFor(filePath: string) {
        const filename = path.basename(filePath);
        return "![[" + filename + "]]\n";
    }

    copyFileToAttachmentsDir(filePath: string) {
        // Make the attachments directory, if it doesn't exist
        fs.mkdirSync(this.attachmentsFolder, { recursive: true });

        const fileName = path.basename(filePath);
        fs.copyFileSync(filePath, path.resolve(this.attachmentsFolder, fileName));
    }
}
