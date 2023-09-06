type EventCallback = (...args: any[]) => Promise<void>;

export class EventEmitter {
  private events: { [eventName: string]: EventCallback[] };

  public constructor() {
    this.events = {};
  }

  public on = (eventName: string, callback: EventCallback): void => {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  };

  public once = (eventName: string, callback: EventCallback): void => {
    const onceCallback: EventCallback = async (...args: any[]) => {
      await callback.call(null, ...args);

      this.off(eventName, onceCallback);
    };

    this.on(eventName, onceCallback);
  };

  public emit = async (eventName: string, ...args: any[]): Promise<void> => {
    const eventCallbacks = this.events[eventName];

    if (eventCallbacks) {
      for (const callback of eventCallbacks) {
        await callback.call(null, ...args);
      }
    }
  };

  public off = (eventName: string, callback: EventCallback): void => {
    const eventCallbacks = this.events[eventName];

    if (eventCallbacks) {
      this.events[eventName] = eventCallbacks.filter((cb) => cb !== callback);
    }
  };
}
