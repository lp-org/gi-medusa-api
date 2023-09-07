import { AbstractFileService } from "@medusajs/medusa";

import type {
  UploadStreamDescriptorType,
  FileServiceGetUploadStreamResult,
  DeleteFileType,
  GetUploadedFileType,
  FileServiceUploadResult,
} from "@medusajs/types";
import fs from "fs";
import fsp from "fs/promises";
import stream from "stream";
import path from "path";

export type LocalFilePluginOptions = {
  upload_dir?: string;
  backend_url?: string;
};

class LocalFileService extends AbstractFileService {
  protected uploadDir_: string;
  protected backendUrl_: string;

  constructor(container, pluginOptions) {
    super(container);
    const _options = pluginOptions || container.configModule;
    const options = _options.plugins.find(
      (el) => el.resolve === "@medusajs/file-local"
    ).options;

    this.uploadDir_ = options?.upload_dir || "uploads";
    this.backendUrl_ = options?.backend_url || "http://localhost:9000";
  }

  async upload(file): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file);
  }

  async uploadProtected(file) {
    return await this.uploadFile(file);
  }

  protected async uploadFile(file): Promise<{ url: string; key: string }> {
    const parsedFilename = path.parse(file.originalname);

    const fileKey = this.buildFileKey(
      `${parsedFilename.name}-${Date.now()}`,
      parsedFilename.ext
    );

    await fsp.copyFile(file.path, this.buildFilePath(fileKey));

    return { url: this.buildUrl(fileKey), key: fileKey };
  }

  async delete(file: DeleteFileType): Promise<void> {
    return fsp.unlink(this.buildFilePath(file.fileKey));
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const fileKey = this.buildFileKey(fileData.name, fileData.ext);
    const filePath = this.buildFilePath(fileKey);
    const url = this.buildUrl(fileKey);

    const directoryPath = path.dirname(filePath);
    await fsp.mkdir(directoryPath, { recursive: true });

    const writeStream = fs.createWriteStream(filePath);
    const pass = new stream.PassThrough();

    return {
      writeStream: pass,
      promise: stream.promises.pipeline(pass, writeStream),
      url,
      fileKey,
    };
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    return fs.createReadStream(this.buildFilePath(fileData.fileKey));
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    return this.buildUrl(fileData.fileKey);
  }

  protected buildFileKey(name: string, ext?: string) {
    if (!ext) return name;

    return ext.startsWith(".") ? `${name}${ext}` : `${name}.${ext}`;
  }

  protected buildFilePath(fileKey: string) {
    // Prevent path traversal
    const safeFileKey = path
      .normalize(fileKey)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    return path.join(this.uploadDir_, safeFileKey);
  }

  protected buildUrl(fileKey: string) {
    return `${this.backendUrl_}/${this.buildFilePath(fileKey)}`;
  }
}

export default LocalFileService;
