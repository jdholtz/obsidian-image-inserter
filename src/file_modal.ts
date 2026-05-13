/* A screen to select image files to insert, copy them into the vault, and add a link referencing
 * the image.
 */
import { Modal, App, Notice, MarkdownView, normalizePath } from "obsidian";
import { FileEmbedder } from "./file_embedder";

// The Obsidian Types don't type the 'getConfig' function so we need to type hint it
interface Vault {
    getConfig(name: "attachmentFolderPath"): string | null | undefined;
}

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
            const fileEmbedder = new FileEmbedder(this.app, attachmentsDest);

            // Copy each file locally and add the embed text to the cursor's current position
            const fileList = Array.from(input.files || []);
            let failedCount = 0;
            for (const file of fileList) {
                try {
                    const copiedFile = await fileEmbedder.copyFileToAttachmentsDir(file);
                    const embedLinkToFile = fileEmbedder.embedLinkFor(copiedFile);
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
        const vault = this.app.vault as typeof this.app.vault & Vault;
        const attachmentFolder = vault.getConfig("attachmentFolderPath") ?? "/";

        // Handle the attachment folder being in a subfolder of the current folder
        if (attachmentFolder.startsWith("./")) {
            const activeFile = this.app.workspace.getActiveFile();
            const activeFolderPath = activeFile?.parent?.path ?? "";
            const relativeAttachmentFolder = attachmentFolder.slice(2);
            return normalizePath(`${activeFolderPath}/${relativeAttachmentFolder}`);
        }

        return attachmentFolder;
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
