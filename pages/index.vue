<template>
<v-app>
    <v-main style="background: url(bg4.jpg); background-size: cover">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-18">
                        <v-toolbar color="orange" dense dark>
                            <v-toolbar-title>
                                <v-icon>mdi-account-box</v-icon>
                                Đăng nhập hệ thống
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-text-field ref="target" @keypress.enter="doLogin" color="orange" v-model="password" prepend-icon="mdi-textbox-password" type="password"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</v-app>
</template>

<script>
export default {
    layout: 'blank',
    data() {
        return {
            password: '',
            RPass: '172839',
            apiUrl: 'http://10.1.16.84/api/subContractApi/',
        }
    },
    methods: {
        doLogin() {
            if (this.password === this.RPass) {
                this.$session.set('subContract', {
                    login: true
                });
                this.$router.push('empListing');
            } else {
                alert("Wrong password");
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs['target'].focus();
        })
    }
}
</script>
