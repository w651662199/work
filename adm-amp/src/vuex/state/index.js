let state = {};

import {
	mixin
} from 'utils/common.js';

import base from './base.js';
import user from './user.js';
import drawer from './drawer.js';
import anicer from './anicer.js';
import shopAnicer from './shopAnicer.js';
import dmpDrawer from './dmpDrawer.js';
import productLine from './productLine.js';

mixin(state, base);
mixin(state, user);
mixin(state, drawer);
mixin(state, anicer);
mixin(state, shopAnicer);
mixin(state, dmpDrawer);
mixin(state, productLine);

export default state;