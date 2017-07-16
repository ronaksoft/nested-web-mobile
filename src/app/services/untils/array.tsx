class ArrayUntiles {
  public uniqueObjects(array: any[], key: string): any[] {

    let obj = new Object();
    obj = {};

    const len = array.length;
    for (let i = 0; i < len; i++) {
      obj[array[i][key]] = array[i];
    }

    let newArray: any[];
    newArray = [];

    Object.keys(obj).forEach((element) => {
      newArray.push(obj[element]);
    });

    return newArray;

  }

  public uniqueArray(array: string[] | number[]): any[] {
    let obj = new Object();
    obj = {};

    for (const value of array) {
      obj[value] = value;
    }

    return Object.keys(obj);
  }
}

export default new ArrayUntiles();
