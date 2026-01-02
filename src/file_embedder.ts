/* Responsible for copying a file and generating its embed link */
import fs from "fs";
import path from "path";

export class FileEmbedder {
    private attachmentsFolder: string;

    constructor(attachmentsFolder: string) {
        this.attachmentsFolder = attachmentsFolder;
    }

    embedLinkFor(filename: string): string {
        return "![[" + filename + "]]\n";
    }

    async copyFileToAttachmentsDir(file: File): Promise<string> {
        // Make the attachments directory, if it doesn't exist
        fs.mkdirSync(this.attachmentsFolder, { recursive: true });
        const destination = path.resolve(this.attachmentsFolder, file.name);

        const buffer = await file.arrayBuffer();
        fs.writeFileSync(destination, Buffer.from(buffer));

        return destination;
    }
}
