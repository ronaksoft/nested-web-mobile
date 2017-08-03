/**
 * @file api/cache/index.tsx
 * @author Hamidreza KK <hamidrezakks@gmail.com>
 * @desc API value object cache
 * @export ApiCache
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-29
 * Reviewed by:           -
 * Date of review:        -
 */
import {IRequest, IResponse} from 'services/server';

/**
 * @class ApiCache
 * @desc Base of all ApiCache classes
 */
class ApiCache {
  private static instance;
  private requestKeyList: any[] = [];
  private pipeLength: number;

  private constructor() {
    // start ApiCache service
    this.pipeLength = 20;
  }

  /**
   * @func getInstance
   * @desc Creates an instance of ApiCache and keeps it singletonewhile the app is running
   * @static
   * @returns {ApiCache}
   * @memberof ApiCache
   */
  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  private hasCache(key: string): number {
    for (let i = 0; i < this.requestKeyList.length; i++) {
      if (this.requestKeyList.length[i].key === key) {
        return i;
      }
    }
    return -1;
  }

  private getItem(key: string): any {
    const index: number = this.hasCache(key);
    if (index > -1) {
      return this.requestKeyList[index];
    } else {
      return null;
    }
  }

  public getRequstKey(req: IRequest): string {
    const requestKeyJson: any = {
      cmd: req.cmd,
      data: req.data,
    };
    return JSON.stringify(requestKeyJson);
  }

  public observeRequest(req: IRequest): IResponse {
    const requestKey: string = this.getRequstKey(req);
    const response: IResponse = {
      status: 'no-cache',
      data: null,
    };
    const item = this.getItem(requestKey);
    if (item === null) {
      this.shortenRequestList();
      this.requestKeyList.push({
        key: requestKey,
        param: req,
        response: null,
      });
      return response;
    } else if (item.response === null) {
      this.updateCachePosition(requestKey);
      return response;
    } else {
      item.response._reqid = req._reqid;
      item.response.status = 'cache';
      return item.response;
    }
  }

  public setResponse(key: string, res: IResponse): void {
    const index = this.hasCache(key);
    if (index > -1) {
      this.requestKeyList[index].response = res;
    }
  }

  private updateCachePosition(key: string): void {
    const index = this.hasCache(key);
    if (index > -1) {
      this.moveToFront(index);
    }
  }

  private moveToFront(index) {
    let collection = this.requestKeyList;
    collection = collection.splice(index, 1).concat(collection);
    this.requestKeyList = collection;
  }

  private shortenRequestList() {
    while (this.requestKeyList.length > this.pipeLength) {
      this.requestKeyList.pop();
    }
  }

}

export default ApiCache;
