let state = {};

import {
	mixin
} from 'utils/common.js';

import base from './base.js';
import account from './account.js';
import putDrawer from './putDrawer.js';
mixin(state, base);
mixin(state, account);
mixin(state, putDrawer);
export default state;