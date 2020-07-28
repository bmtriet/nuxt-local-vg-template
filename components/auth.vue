<template>
</template>
<script>
export default {
    data() {
        return {}
    },
    beforeMount() {
        if (process.client) {
            if (this.$session.get('subContract') === undefined) {
                this.$router.push('/');
                console.log('failed');
            } else {
                console.log('logined');
            }
        }
    },
}
</script>>
