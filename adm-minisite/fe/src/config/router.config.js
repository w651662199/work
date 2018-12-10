export default [{
    path: '/',
    redirect: '/app/topic'
    //name: 'Main',
    //component: require('@/components/app/Main.vue')
}, {
    path: '/app',
    component: require('@/components/app/Main.vue'),
    redirect: '/app/topic',
    children: [{
        path: 'topic', //精选
        name: 'topic',
        component: require('@/components/app/topic/Topic.vue')
    }, {
        path: 'shop', //精选
        name: 'shop',
        component: require('@/components/app/shop/shop.vue')
    }, {
        path: 'item', //精选
        name: 'item',
        component: require('@/components/app/item/Item.vue')
    }, {
        path: 'video', //精选
        name: 'video',
        component: require('@/components/app/video/Video.vue')
    }]
}];
