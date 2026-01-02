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

    onOpen(): void {
        const { contentEl } = this;
        const input = contentEl.createEl("input", {
            type: "file",
            attr: { accept: "image/*", multiple: true },
        });

        input.addEventListener("cancel", () => {
            new Notice("Canceled adding images");
            this.close();
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        input.addEventListener("change", async () => {
            this.close();

            const attachmentsDest = this.getAttachmentsDestination();
            const fileEmbedder = new FileEmbedder(attachmentsDest);

            // Copy each file locally and add the embed text to the cursor's current position
            const fileList = Array.from(input.files || []);
            let failedCount = 0;
            for (const file of fileList) {
                try {
                    await fileEmbedder.copyFileToAttachmentsDir(file);
                    const embedLinkToFile = fileEmbedder.embedLinkFor(file.name);
                    this.addText(embedLinkToFile);
                } catch (error) {
                    failedCount++;
                    console.error(error);
                }
            }

            // Notify the user of the result
            if (failedCount > 0) {
                new Notice(
                    `Added ${fileList.length - failedCount} images; ${failedCount} failed to be inserted`,
                );
            } else {
                new Notice(`Added ${fileList.length} images`);
            }
        });

        input.click(); // Automatically go into the file selector
    }

    getAttachmentsDestination(): string {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const attachmentFolder = this.app.vault.config.attachmentFolderPath ?? "/";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let basePath = this.app.vault.adapter.basePath;

        // Handle the attachment folder being in a subfolder of the current folder
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (attachmentFolder.startsWith("./")) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            basePath = path.join(basePath, this.app.workspace.getActiveFile().parent.path);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return path.join(basePath, attachmentFolder);
    }

    addText(text: string): void {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            view.editor.replaceSelection(text);
        }
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}
