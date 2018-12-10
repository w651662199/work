<template>
    <div v-show="loading">loading</div>
</template>
<script>
    import Vue from 'vue';
    import store from 'store';

    export default {
        name: 'loading',
        computed: {
            loading: () => store.state.loading
        }
    };

</script>