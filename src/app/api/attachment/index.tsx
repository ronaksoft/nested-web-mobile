import UploadType from './UploadType';
import IGetUploadTokenResponse from './interfaces/IGetUploadTokenResponse';
import Api from 'api';
import Configuration from 'config';
import AAA from 'services/aaa';
import IAttachment from './interfaces/IAttachment';
import IResponse from 'services/server/interfaces/IResponse';

class AttachmentApi {
  private static getUploadToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      Api.getInstance().request({
        cmd: 'file/get_upload_token',
        data: {},
      }).then((response: IGetUploadTokenResponse) => {
        resolve(response.token);
      }, reject);
    });
  }

  private static getUploadUrl(storeUrl: string, type: string, sk: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUploadToken().then((token: string) => {
        resolve(`${storeUrl}/upload/${type}/${sk}/${token}`);
      }, reject);
    });
  }

  public static upload(file: File, type: string, onProgress: any): Promise<IAttachment> {
    const sessionKey = AAA.getInstance().getCredentials().sk;
    const storeUrl = Configuration.STORE.URL;
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      formData.append('file', file);
      this.getUploadUrl(storeUrl, type, sessionKey).then((url) => {

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-File-Size', file.size.toString());
        xhr.setRequestHeader('X-File-Type', file.type);

        if (onProgress) {
          xhr.upload.onprogress = (e: any) => {
            onProgress(e.total, e.loaded);
          };
        }

        xhr.upload.onerror = (e: any) => {
          reject(e);
        };

        xhr.onload = (e: any) => {
          if (200 !== e.target.status) {
            return reject(e);
          }

          const response: IResponse = JSON.parse(e.target.response);

          switch (response.status) {
            case 'ok':
              resolve(response.data[0]);
              break;

            default:
              reject(response);
              break;
          }
        };

        xhr.upload.onabort = (e: any) => {
          reject(e);
        };

        xhr.send(formData);
      }, reject);
    });
  }
}

export default AttachmentApi;
export {
  UploadType
};
