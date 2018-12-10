let mutations = {};

import {
	mixin
} from 'utils/common.js';

import * as base from './base.js';
import * as user from './user.js';
import * as drawer from './drawer.js';
import * as anicer from './anicer.js';
import * as shopAnicer from './shopAnicer.js';
import * as dmpDrawer from './dmpDrawer.js';
import * as productLine from './productLine.js';

mixin(mutations, base);
mixin(mutations, user);
mixin(mutations, drawer);
mixin(mutations, anicer);
mixin(mutations, shopAnicer);
mixin(mutations, dmpDrawer);
mixin(mutations, productLine);

export default mutations;