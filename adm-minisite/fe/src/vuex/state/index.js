let state = {};

import { mixin } from '@/utils/common';

import base from './base';
import h5Share from './h5Share.js';

mixin(state, base);
mixin(state, h5Share);

export default state;