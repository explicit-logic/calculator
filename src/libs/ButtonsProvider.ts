
type ObjectArray = object[];

export class ButtonsProvider {
  configTree: object;

  getButtonsByPosition(position: string): ObjectArray {
    return this.configTree[position];
  }

  parseConfig(config: ObjectArray): object {
    let result: object = {};
    let position: string;

    for(let configItem of config){
      position = configItem['position'];

      if(!Array.isArray(result[position])){
        result[position] = [];
      }

      result[position].push(configItem);
    }

    return result;
  }

  loadConfig(config: ObjectArray){
    this.configTree = this.parseConfig(config);
    return this;
  }
}
