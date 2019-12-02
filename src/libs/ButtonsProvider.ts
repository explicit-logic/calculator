
export class ButtonsProvider {
  configTree: object;

  parseConfig(config: object): object {
    return {};
  }

  loadConfig(config: object){
    this.configTree = this.parseConfig(config);
  }
}
