/* tslint:disable */

import * as _ from 'lodash';

/**
 * @class MiniPlayer
 * @desc A signletone class for audio player
 * @export
 */
export default class MiniPlayer {
  private audioDOM: any;
  private audioObjs: any;
  private playing: any;
  private audioInterval: any;
  private audioIntervalEnable: any;
  private currentStatus: string | null;
  private playlistName: any;
  private isVoiceComment: any;
  private timeChangedRef: any;
  private listUpdatedRef: any;
  private statusChangedRef: any;

  /**
   * @prop instance
   * @desc An instance of MiniPlayer.
   * @private
   * @static
   * @type {MiniPlayer}
   * @memberof MiniPlayer
   */
  private static instance: MiniPlayer;
  /**
   * @func getInstance
   * @desc The class constructor is private. This method creates an instance of MiniPlayer once
   * and returns the instance everytime you call it
   * @static
   * @returns
   * @memberof MiniPlayer
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new MiniPlayer();
    }

    return this.instance;
  }

  /**
   * @constructor
   * @desc Creates an instance of MiniPlayer.
   * @memberof MiniPlayer
   */
  private constructor() {
    this.audioObjs = [];
    this.playing = null;
    this.audioIntervalEnable = false;
    this.currentStatus = 'pause';
    this.playlistName = null;
    this.isVoiceComment = null;
    this.timeChangedRef = [];
    this.listUpdatedRef = [];
    this.statusChangedRef = [];

    this.audioDOM = document.createElement('audio');
    this.audioDOM.style.display = 'none';
    document.body.appendChild(this.audioDOM);

    const that = this;

    this.audioDOM.onended = () => {
      that.currentStatus = 'end';
      _.forEach(that.statusChangedRef, (item: any) => {
        that.callIfValid(item.fn, {
          status: that.currentStatus,
          id: this.playing,
          playlist: that.playlistName
        });
      });
      that.broadcastStatus('');
    };
  }

  public startInterval() {
    if (this.audioIntervalEnable) {
      return;
    }
    this.audioIntervalEnable = true;
    const that = this;
    this.audioInterval = setInterval(() => {
      if (!this.audioDOM.paused) {
        _.forEach(that.timeChangedRef, (item) => {
          this.callIfValid(item.fn, {
            time: this.audioDOM.currentTime,
            duration: this.audioDOM.duration,
            ratio: (this.audioDOM.currentTime / this.audioDOM.duration)
          });
        });
      }
    }, 500);
  }

  public stopInterval() {
    if (this.audioInterval) {
      clearInterval(this.audioInterval);
      this.audioIntervalEnable = false;
    }
  }

  public setPlaylist(name, isVoiceComment) {
    if (name !== this.playlistName) {
      this.removeAll();
    }
    this.playlistName = name;
    if (isVoiceComment === undefined) {
      isVoiceComment = false;
    }
    this.isVoiceComment = isVoiceComment;
  }

  public sortList(list) {
    return _.sortBy(list, 'order');
  }

  public addTrack(item, sender, order) {
    const alreadyCreated = this.audioObjs.find((element) => {
      return element.id === item.id;
    });

    if (!alreadyCreated) {
      if (sender !== undefined || sender !== null) {
        item = _.merge(item, {
          sender: sender
        });
      }
      item = _.merge(item, {
        order: (order !== undefined)? order: -1
      });
      this.audioObjs.push(item);
      this.audioObjs = this.sortList(this.audioObjs);
      _.forEach(this.listUpdatedRef, (item) => {
        this.callIfValid(item.fn, null);
      });
    }

    this.currentStatus = 'add';
    const that = this;
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: that.currentStatus,
        id: item.id,
        playlist: that.playlistName
      });
    });

    if (item.isPlayed) {
      this.play(item.id);
    }
  }

  public play(id) {
    if (this.playing !== null) {
      const playingItem = this.getCurrent();
      this.pause((playingItem.item !== undefined)? playingItem.item.id: null);
    }
    this.startInterval();
    let noIdFlag = false;
    if (id === undefined) {
      id = this.playing;
      noIdFlag = true;
    } else {
      this.playing = id;
    }
    const index = _.findIndex(this.audioObjs, (o) => {
      return o.id === id
    });
    if (index === -1) {
      return;
    }
    if (!noIdFlag) {
      if (this.audioDOM.src !== this.audioObjs[index].src) {
        this.audioDOM.src = this.audioObjs[index].src;
        this.audioDOM.load();
      }
    }
    setTimeout(() => {
      this.audioDOM.play();
    }, 100);
    this.currentStatus = 'play';

    const that = this;
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: that.currentStatus,
        id: id,
        playlist: that.playlistName
      });
    });
    this.broadcastStatus(id);
  }

  public pause(id) {
    this.stopInterval();
    this.audioDOM.pause();
    this.currentStatus = 'pause';
    const that = this;
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: that.currentStatus,
        id: id,
        playlist: that.playlistName
      });
    });
    this.broadcastStatus('');
  }

  public next() {
    if (this.playing === null) {
      return;
    }
    const playingItem = this.getCurrent();
    let index = playingItem.index;
    index++;
    if (index >= this.audioObjs.length) {
      return;
    }
    const id = this.audioObjs[index].id;
    this.currentStatus = 'next';
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: this.currentStatus,
        id: id,
        playlist: this.playlistName
      });
    });
    this.play(id);
  }

  public prev() {
    if (this.playing === null) {
      return;
    }
    const playingItem = this.getCurrent();
    let index = playingItem.index;
    index--;
    if (index < 0) {
      return;
    }
    const id = this.audioObjs[index].id;
    this.currentStatus = 'prev';
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: this.currentStatus,
        id: id,
        playlist: this.playlistName
      });
    });
    this.play(id);
  }

  public seekTo(ratio) {
    if (this.audioDOM.paused) {
      return;
    }
    const sec = this.audioDOM.duration * ratio / 100;
    this.audioDOM.currentTime = sec;
    this.currentStatus = 'seek';
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: this.currentStatus,
        time: sec,
        id: this.playing,
        playlist: this.playlistName
      });
    });
  }

  public unbindFn(list, id) {
    const index = _.findIndex(list, {id: id});
    if (index > -1) {
      list.splice(index, 1);
    }
  }

  public timeChanged(callback) {
    if (_.isFunction(callback)) {
      const id = _.uniqueId();
      const fnRef = this.timeChangedRef;
      fnRef.push({
        id: id,
        fn: callback
      });
      const that = this;
      return function () {
        const tempId = id;
        that.unbindFn(fnRef, tempId);
      };
    }
  }

  public statusChanged(callback) {
    if (_.isFunction(callback)) {
      const id = _.uniqueId();
      const fnRef = this.statusChangedRef;
      fnRef.push({
        id: id,
        fn: callback
      });
      const that = this;
      return function () {
        var tempId = id;
        that.unbindFn(fnRef, tempId);
      };
    }
  }

  public removeAll() {
    this.audioDOM.pause();
    this.audioObjs = [];
    this.playing = null;
    this.currentStatus = 'pause';
    _.forEach(this.statusChangedRef, (item) => {
      this.callIfValid(item.fn, {
        status: this.currentStatus,
        id: null,
        playlist: this.playlistName
      });
    });
    this.broadcastStatus('');
  }

  public getCurrent() {
    const index = _.findIndex(this.audioObjs, (o) => {
      return o.id === this.playing
    });

    return {
      item: this.audioObjs[index],
      status: this.currentStatus,
      playlist: this.playlistName,
      prev: (index === 0) ? false : true,
      next: (index === (this.audioObjs.length - 1)) ? false : true,
      index: index
    };
  }

  public listUpdated(callback) {
    if (_.isFunction(callback)) {
      const id = _.uniqueId();
      const fnRef = this.listUpdatedRef;
      fnRef.push({
        id: id,
        fn: callback
      });
      const that = this;
      return function () {
        const tempId = id;
        that.unbindFn(fnRef, tempId);
      };
    }
  }

  public getList() {
    return {
      items: this.audioObjs,
      name: this.playlistName,
      isVoiceComment: this.isVoiceComment
    };
  }

  private callIfValid(a: any, b: any) {
    a = a;
    b = b;
    if (_.isFunction(arguments[0])) {
      const func = arguments[0];
      let param = null;
      if (arguments.length > 1) {
        param = arguments[1];
      }
      func(param);
    }
  }

  private broadcastStatus(id) {
    if (this.playlistName === undefined || this.playlistName === null) {
      return;
    }
    // $rootScope.$broadcast('play-audio', this.playlistName + '_' + id);
    this.broadcast('play-audio', this.playlistName + '_' + id)
  }

  private broadcast(name, params) {
    let event = new CustomEvent(name, {
      detail: params,
    });
    window.dispatchEvent(event);
  }

}
