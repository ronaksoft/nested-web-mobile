class Unique {
  private constructor() {
    this.value = 0;
  }

  private value: number;
  private static instance: Unique;

  public static getInstance() {
    if (!Unique.instance) {
      Unique.instance = new Unique();
    }

    return Unique.instance;
  }

  public get() {
    this.value += 1;

    return this.value;
  }
}

export default Unique.getInstance();
