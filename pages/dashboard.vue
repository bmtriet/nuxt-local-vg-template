<template>
<v-container fluid>
    <v-row>
        <auth></auth>
        <h3>Dashboard</h3>
    </v-row>
</v-container>
</template>
<script>
import auth from '~/components/auth'
export default {
    components: {
        auth,
    },
    data() {
        return {
            api: 'http://10.1.16.84/api/subContractApi/',
        }
    },
    methods: {
    },
    computed: {
    },
    mounted() {},
}
</script>
