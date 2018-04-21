/**
 * @file api/attachment/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Some tools that help you upload and download an attachment
 * @export PlaceApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-27
 * Reviewed by:           robzizo
 * Date of review:        2017-07-31
 */

import UploadType from './constants/UploadType';
import IGetUploadTokenResponse from './interfaces/IGetUploadTokenResponse';
// import IGetFileResponse from './interfaces/IGetFileResponse';
import Api from 'api';
import Configuration from 'config';
import AAA from 'services/aaa';
import {
  IUploadMission,
  IGetDownloadTokenRequest,
  IGetDownloadTokenResponse,
} from './interfaces';
import IResponse from 'services/server/interfaces/IResponse';
import IPostAttachment from 'api/post/interfaces//IPostAttachment';

/**
 * @class AttachmentApi
 * @desc A toolbox to help you work with files including upload and download
 */
class AttachmentApi {
  /**
   * @func getUploadToken
   * @desc Requests for an upload token
   * @private
   * @static
   * @returns {Promise<string>}
   * @memberof AttachmentApi
   */
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

  public get(id: string): Promise<IPostAttachment> {
    return new Promise((resolve, reject) => {
      Api.getInstance().request({
        cmd: 'file/get',
        data: {
          universal_id: id,
        },
      }).then((response: IPostAttachment) => {
        resolve(response);
      }, reject);
    });
  }

  /**
   * @func getUploadUrl
   * @desc Generates an upload url by using the authenticated user session-key (sk),
   * the given upload type and a new upload token. This method requests
   * a new upload token on every call.
   * @borrows getUploadToken
   * @private
   * @static
   * @param {string} storeUrl
   * @param {string} type
   * @param {string} sk
   * @returns {Promise<string>}
   * @memberof AttachmentApi
   */
  private static getUploadUrl(storeUrl: string, type: string, sk: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUploadToken().then((token: string) => {
        resolve(`${storeUrl}/upload/${type}/${sk}/${token}`);
      }, reject);
    });
  }

  /**
   * @func upload
   * @desc Uploads a file with progress and
   * @borrows AAA, getUploadUrl, XMLHttpRequest and FormData
   * @static
   * @param {File} file
   * @param {string} type
   * @returns {Promise<IUploadMission>}
   * @memberof AttachmentApi
   */
  public static upload(file: File, type: string): Promise<IUploadMission> {
    const sessionKey = AAA.getInstance().getCredentials().sk;
    const storeUrl = Configuration().STORE.URL;
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    // An upload mission is what the function returns and lets you have control over the file upload
    const mission: IUploadMission = {
      abort: () => {
        xhr.abort();
      },
      onAbort: null,
      onError: null,
      onFinish: null,
      onProgress: null,
    };

    return new Promise((resolve, reject) => {
      formData.append('file', file);
      this.getUploadUrl(storeUrl, type, sessionKey).then((url) => {

        xhr.open('POST', url, true);
        // These request headers are required for talking to Xerxes
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-File-Size', file.size.toString());
        xhr.setRequestHeader('X-File-Type', file.type);

        xhr.upload.onprogress = (e: any) => {
          if (mission.onProgress) {
            mission.onProgress(e.total, e.loaded);
          }
        };

        xhr.upload.onloadstart = () => {
          resolve(mission);
        };

        xhr.upload.onerror = (e: any) => {
          if (mission.onError) {
            mission.onError(e);
          }
        };

        xhr.onload = (e: any) => {
          if (200 !== e.target.status) {
            if (mission.onError) {
              mission.onError(e.target);
            }
          } else {
            const response: IResponse = JSON.parse(e.target.response);

            switch (response.status) {
              case 'ok':
                if (mission.onFinish) {
                  mission.onFinish(response.data.files[0]);
                }
                break;

              default:
                if (mission.onError) {
                  mission.onError(response);
                }
                break;
            }
          }
        };

        xhr.upload.onabort = (e: any) => {
          if (mission.onAbort) {
            mission.onAbort(e);
          }
        };
        // The file upload starts on the function call. Maybe it would be better if
        // do not start it automatically and defer by defining a method in
        // the returning mission like `start`.
        xhr.send(formData);
      }, reject);
    });
  }

  /**
   * @func getDownloadToken
   * @desc Requests for a download token. This method gets a new download token on each call
   * @static
   * @param {IGetDownloadTokenRequest} data
   * @returns
   * @memberof AttachmentApi
   */
  public static getDownloadToken(data: IGetDownloadTokenRequest) {
    return new Promise((resolve, reject) => {
      return Api.getInstance().request({
        cmd: 'file/get_download_token',
        data,
      }).then((response: IGetDownloadTokenResponse) => resolve(response.token), reject);
    });
  }
}

export default AttachmentApi;
export {
  UploadType
};
