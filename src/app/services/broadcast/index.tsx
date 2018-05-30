import * as _ from 'lodash';

export default class Broadcast {

  private static instance: Broadcast;
  private eventReferences: any[];

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Broadcast();
    }

    return this.instance;
  }

  private constructor() {
    this.eventReferences = [];
  }

  public broadcast(name: string, payload: any) {
    const event = new CustomEvent(name, payload);
    window.dispatchEvent(event);
  }

  public on(name: string, callback: () => void) {
    const id = _.uniqueId('event_');
    this.eventReferences[id] = {
      fn: callback,
      name,
    };
    window.addEventListener(name, callback, true);
    return () => {
      window.removeEventListener(name, callback, true);
      delete this.eventReferences[id];
    };
  }

  public flushAll() {
    this.eventReferences.forEach((event) => {
      window.removeEventListener(event.name, event.fn, true);
    });
    this.eventReferences = [];
  }
}
