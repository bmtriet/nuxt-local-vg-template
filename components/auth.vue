<template>
</template>
<script>
export default {
    data() {
        return {}
    },
    beforeMount() {
        if (process.client) {
            if (this.$session.get('vgchat') === undefined) {
                this.$router.push('/');
                console.log('failed');
            } else {
                console.log('logined');
            }
        }
    },
}
</script>>
