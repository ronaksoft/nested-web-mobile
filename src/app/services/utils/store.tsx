import AAA from 'services/aaa';
import Configurations from 'config';

enum UrlType {
  View = 0,
    Download = 1,
}

const StoreTypes = {
  GIF: 'gif',
  FILE: 'file',
  AUDIO: 'audio',
  IMAGE: 'image',
  VIDEO: 'video',
  PLACE_PIC: 'place_pic',
  PROFILE_PIC: 'profile_pic',
};

const FileTypes = {
  IMAGE: 'image',
  GIF: 'gif',
  ARCHIVE: 'archive',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video',
  PDF: 'pdf',
  OTHER: 'other',
};

class Store {
  public static getViewUrl(id: string) {
    return Store.getUrl(id, UrlType.View);
  }

  public static getDownloadUrl(id: string) {
    return Store.getUrl(id, UrlType.Download);
  }

  private static getUrl(id: string, type: UrlType) {
    const sessionKey = AAA.getInstance().getCredentials().sk;
    switch (type) {
      case UrlType.Download:
        return `${Configurations.STORE.URL}/view/${sessionKey}/${id}/`;
      default:
        return `${Configurations.STORE.URL}/download/${sessionKey}/${id}/`;
    }
  }

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

  public static getType(mimetype: string) {
    if (!mimetype) {
      return '';
    }

    const type = Store.groups.find((item) => item.mimetypes.indexOf(mimetype) > -1);

    return type.type || FileTypes.OTHER;
  }

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

  public static getUploadType(file: File) {
    console.log('====================================');
    console.log('file', file);
    console.log('====================================');
    const group = Store.getType(file.type);
    console.log('====================================');
    console.log('group', group);
    console.log('====================================');

    if (Store.getSuffix(file.name) === 'gif') {
      return StoreTypes.GIF;
    }

    if (group === FileTypes.IMAGE) {
      return StoreTypes.IMAGE;
    } else if (group === FileTypes.VIDEO) {
      return StoreTypes.VIDEO;
    } else if (group === FileTypes.AUDIO) {
      return StoreTypes.AUDIO;
    } else {
      return StoreTypes.FILE;
    }
  }

}

export default Store;
