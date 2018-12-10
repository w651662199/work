let actions = {};

import {
	mixin
} from 'utils/common.js';

import * as base from './base.js';
import * as user from './user.js';
import * as drawer from './drawer.js';
import * as anicer from './anicer.js';
import * as shopAnicer from './shopAnicer.js';
import * as dmpDrawer from './dmpDrawer.js'
import * as productLine from './productLine.js'

mixin(actions, base);
mixin(actions, user);
mixin(actions, drawer);
mixin(actions, anicer);
mixin(actions, shopAnicer);
mixin(actions, dmpDrawer);
mixin(actions, productLine);

export default actions;