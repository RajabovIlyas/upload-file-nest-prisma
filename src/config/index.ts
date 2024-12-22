import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Config } from './config.interface';

const YAML_CONFIG_FILENAME = '../../config/configuration.yaml';


export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Config;
};
