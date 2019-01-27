const keys = require('../../config/default');

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = keys;
    console.log(this.envConfig);
  }

  get () : Object {
    return this.envConfig;
  }
}