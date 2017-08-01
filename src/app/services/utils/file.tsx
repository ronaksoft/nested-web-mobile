/**
 * @file utils/file.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc A bunch of tools that are require to work with files
 * @export {FileUtil}
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-22
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

import AAA from 'services/aaa';
import Configurations from 'config';

/**
 * @enum {number}
 * @desc Differebt types of file url
 * Xrexes provides two different types of url to view and download a file. to find out
 * more about these types, please refer to `getUrl` method.
 * @see getUrl
 */
enum UrlType {
  View = 0,
  Download = 1,
}
/**
 * @const UploadTypes
 * Upload type should be specified when you are going to create an upload url. If you want to know
 * more about upload types, take a look at `api/attachment/index.tsx`
 * @see api/attachment/index.tsx
 */
const UploadTypes = {
  GIF: 'gif',
  FILE: 'file',
  AUDIO: 'audio',
  IMAGE: 'image',
  VIDEO: 'video',
  PLACE_PIC: 'place_pic',
  PROFILE_PIC: 'profile_pic',
};

/**
 * @const FileTypes
 * @desc The different file types which are defined by Xrexes, based on a file mimetype.
 */
const FileTypes = {
  IMAGE: 'IMG',
  GIF: 'GIF',
  ARCHIVE: 'ZIP',
  DOCUMENT: 'DOC',
  AUDIO: 'AUD',
  VIDEO: 'VID',
  PDF: 'PDF',
  OTHER: 'OTH',
};

/**
 * @class FileUtil
 * @desc A set of utilities to work with files
 */
class FileUtil {
  public static getViewUrl(id: string) {
    return FileUtil.getUrl(id, UrlType.View);
  }

  public static getDownloadUrl(id: string, token: string) {
    return FileUtil.getUrl(id, UrlType.Download, token);
  }

  /**
   * @function getUrl
   * @desc Generates a download/view url of a file
   * The difference between download and view url is the last part of url. A download url
   * ends with a download token which is obviously required to download a file. A view url
   * does not have a token at the end and ends with the file universal Id
   * @private
   * @static
   * @param {string} id
   * @param {UrlType} type
   * @param {string} [token]
   * @returns {string}
   * @memberof FileUtil
   */
  private static getUrl(id: string, type: UrlType, token?: string) {
    const sessionKey = AAA.getInstance().getCredentials().sk;
    switch (type) {
      case UrlType.Download:
        return `${Configurations().STORE.URL}/download/${sessionKey}/${id}/${token}`;
      default:
        return `${Configurations().STORE.URL}/view/${sessionKey}/${id}/`;
    }
  }

  /**
   * @const groups
   * @desc A list of the supported file types with mimetypes
   * @private
   * @static
   * @memberof FileUtil
   */
  private static groups = [{
      type: FileTypes.ARCHIVE,
      mimetypes: [
        'application/zip',
        'application/x-rar-compressed',
      ],
    },
    {
      type: FileTypes.ARCHIVE,
      mimetypes: [
        'text/plain',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      ],
    },
    {
      type: FileTypes.DOCUMENT,
      mimetypes: [
        'text/plain',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      ],
    },
    {
      type: FileTypes.IMAGE,
      mimetypes: [
        'image/bmp',
        'image/jpeg',
        'image/ief',
        'image/png',
        'image/vnd.dwg',
        'image/svg+xml',
      ],
    },
    {
      type: FileTypes.GIF,
      mimetypes: [
        'image/gif',
      ],
    },
    {
      type: FileTypes.AUDIO,
      mimetypes: [
        'audio/mpeg',
        'audio/aac',
        'audio/mp3',
        'audio/wma',
        'audio/wav',
        'audio/webm',
        'audio/ogg',
      ],
    },
    {
      type: FileTypes.VIDEO,
      mimetypes: [
        'video/x-matroska',
        'video/mp4',
        'video/3gp',
        'video/ogg',
        'video/quicktime',
        'video/webm',
      ],
    },
    {
      type: FileTypes.PDF,
      mimetypes: [
        'application/pdf',
      ],
    },
  ];

  /**
   * @function getType
   * @desc Finds a file type based on mimetype
   * @static
   * @param {string} mimetype
   * @returns {string}
   * @memberof FileUtil
   */
  public static getType(mimetype: string) {
    if (!mimetype) {
      return '';
    }

    const type = FileUtil.groups.find((item) => item.mimetypes.indexOf(mimetype) > -1);

    // TODO: Check if type is null
    return type.type || FileTypes.OTHER;
  }

  /**
   * @function getSuffix
   * @desc Returns a file extension using the file name
   * @example "foo.txt" => "txt"
   * @static
   * @param {string} fileName
   * @returns {string}
   * @memberof FileUtil
   */
  public static getSuffix(fileName: string) {
    if (!fileName) {
      return '';
    }

    const index = fileName.lastIndexOf('.');

    if (index === -1) {
      return '';
    }

    return fileName.substr(index + 1);
  }

  /**
   * @function removeSuffix
   * @desc Returns a file name without extiension
   * e.g. "foo.txt" => "foo"
   * @static
   * @param {string} fileName
   * @returns {string}
   * @memberof FileUtil
   */
  public static removeSuffix(fileName: string) {
    if (!fileName) {
      return '';
    }

    const index = fileName.lastIndexOf('.');

    if (index === -1) {
      return fileName;
    }

    return fileName.substr(0, index);
  }

  /**
   * @function getUploadType
   * @desc Find the given file upload type based on the file type
   * @example "foo.gif" => "gif", "foo.mp4" => "video", "foo.bar" => "file"
   * @borrows getType
   * @static
   * @param {File} file
   * @returns  {string}
   * @memberof FileUtil
   */
  public static getUploadType(file: File) {
    const group = FileUtil.getType(file.type);

    if (FileUtil.getSuffix(file.name) === 'gif') {
      return UploadTypes.GIF;
    }

    if (group === FileTypes.IMAGE) {
      return UploadTypes.IMAGE;
    } else if (group === FileTypes.VIDEO) {
      return UploadTypes.VIDEO;
    } else if (group === FileTypes.AUDIO) {
      return UploadTypes.AUDIO;
    } else {
      return UploadTypes.FILE;
    }
  }

}

export default FileUtil;
