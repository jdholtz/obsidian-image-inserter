/* A screen to select image files to insert, copy them into the vault, and add a link referencing 
* the image.
*/
import { Modal, App, Notice, MarkdownView } from "obsidian";
import { FileEmbedder } from "./file_embedder";
import path from "path";

export class FileModal extends Modal {

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        const input = contentEl.createEl("input", {
            type: "file",
            attr: { accept: "image/*", multiple: true },
        });

        input.addEventListener("cancel", () => {
            new Notice("Canceled adding images");
            this.close();
        });

        input.addEventListener("change", () => {
            this.close();

            const attachmentsDest = this.getAttachmentsDestination();
            const fileEmbedder = new FileEmbedder(attachmentsDest);

            // Copy each file locally and add the embed text to the cursor's current position
            const fileList = Array.from(input.files || []);
            fileList.forEach((file: File) => {
                // @ts-ignore
                const filePath = file.path;
                fileEmbedder.copyFileToAttachmentsDir(filePath);
                const embedLinkToFile = fileEmbedder.embedLinkFor(filePath);
                this.addText(embedLinkToFile);
            });

            new Notice(`Added ${fileList.length} images`);
        });

        input.click(); // Automatically go into the file selector
    }

    getAttachmentsDestination() {
        // @ts-ignore
        const attachementFolder = this.app.vault.config.attachmentFolderPath;
        // @ts-ignore
        let basePath = this.app.vault.adapter.basePath;

        // Handle the attachment folder being in a subfolder of the current folder
        if (attachementFolder.startsWith("./")) {
            // @ts-ignore
            basePath = path.join(basePath, this.app.workspace.getActiveFile().parent.path);
        }

        return path.join(basePath, attachementFolder);
    }

    addText(text: string) {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            view.editor.replaceSelection(text);
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
