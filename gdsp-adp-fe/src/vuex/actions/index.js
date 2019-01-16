let actions = {};

import {
	mixin
} from 'utils/common.js';

import * as base from './base.js';
import * as account from './account.js';
import * as putDrawer from './putDrawer.js';
mixin(actions, base);
mixin(actions, account);
mixin(actions, putDrawer);
export default actions;