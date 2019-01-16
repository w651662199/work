let mutations = {};

import {
	mixin
} from 'utils/common.js';

import * as base from './base.js';
import * as account from './account.js';
import * as putDrawer from './putDrawer.js';
mixin(mutations, base);
mixin(mutations, account);
mixin(mutations, putDrawer);
export default mutations;