
type ConfigType = object[];

export class ButtonsProvider {
  configTree: object;

  parseConfig(config: ConfigType): object {
    let result: object = {};

    for(let configItem of config){

    }


    return {};
  }

  loadConfig(config: ConfigType){
    this.configTree = this.parseConfig(config);
  }
}
