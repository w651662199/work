let mutations = {};

import { mixin } from '@/utils/common';

import * as base from './base';
import * as h5Share from './h5Share.js';

mixin(mutations, base);
mixin(mutations, h5Share);

export default mutations;