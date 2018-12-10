let actions = {};

import { mixin } from '@/utils/common';

import * as base from './base';
import * as h5Share from './h5Share.js';

mixin(actions, base);
mixin(actions, h5Share);

export default actions;