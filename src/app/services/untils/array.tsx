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
}

export default new ArrayUntiles();
