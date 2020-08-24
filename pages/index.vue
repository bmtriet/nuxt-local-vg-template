<template>
<v-app>
    <v-main style="background: url(bg4.jpg) center; background-size: cover">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card v-if="mode === 'login'" class="elevation-18">
                        <v-toolbar color="orange" dense dark>
                            <v-toolbar-title>
                                <v-icon>mdi-account-box</v-icon>
                                Đăng nhập tài khoản
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-text-field hide-details class="mb-2" label="Mã số thẻ [5 chữ số]" ref="target" color="orange" v-model="empno" prepend-inner-icon="mdi-account-card-details" type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Mã số thẻ CNV" outlined></v-text-field>
                            <v-text-field hide-details label="Mật khẩu" @keypress.enter="doLogin" color="orange" v-model="password" prepend-inner-icon="mdi-textbox-password" type="password" outlined></v-text-field>
                        </v-card-text>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn outlined color="warning" @click="mode = 'register'">
                                Đăng ký tài khoản mới
                            </v-btn>
                            <v-btn outlined color="success" @click="doLogin">
                                Đăng nhập
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card v-else class="elevation-18">
                        <v-toolbar color="orange" dense dark>
                            <v-toolbar-title>
                                <v-icon>mdi-account-box</v-icon>
                                Đăng ký tài khoản
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-text-field placeholder="Email nội bộ" label="Email nội bộ" hide-details inputmode="email" outlined v-model="email"></v-text-field>
                            <v-btn v-if="email" color="primary" block @click="sendActivationCode" class="mt-2">
                                <v-icon>mdi-asterisk</v-icon>
                                Gửi mã xác thực
                            </v-btn>
                            <v-text-field v-if="email" class="mt-2" type="number" placeholder="Nhập mã xác thực" label="Nhập mã xác thực" aria-autocomplete="off" hint="Vui lòng kiểm tra Email bên trên để lấy mã kích hoạt" persistent-hint inputmode="numeric" outlined v-model="activeCode"></v-text-field>
                            <v-text-field v-if="+activeCode === genActiveCodeComp" class="mt-2" type="number" inputmode="numeric" placeholder="Mã số thẻ" label="Nickname" hint="Mã số thẻ dùng để làm tên đăng nhập" aria-autocomplete="off" outlined v-model="empno"></v-text-field>
                            <v-text-field v-if="+activeCode === genActiveCodeComp" class="mt-2" type="text" placeholder="Tên hiển thị ví dụ: HR-trietbui" label="Nickname" hint="Nên đặt kèm với tên Bp. tránh nhầm lẫn.Vẫn có thể thay đổi sau" aria-autocomplete="off" outlined v-model="nickname"></v-text-field>
                            <v-text-field v-if="+activeCode === genActiveCodeComp" hide-details label="Mật khẩu" class="my-2" color="orange" v-model="password" prepend-inner-icon="mdi-textbox-password" type="password" outlined></v-text-field>
                            <v-text-field v-if="+activeCode === genActiveCodeComp" hide-details label="Nhập lại Mật khẩu" color="orange" v-model="repassword" prepend-inner-icon="mdi-textbox-password" type="password" outlined></v-text-field>

                        </v-card-text>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn outlined color="error" @click="mode = 'login'">
                                Hủy
                            </v-btn>
                            <v-btn v-if="+activeCode === genActiveCodeComp" @click="postRegNewUser" outlined color="warning">
                                Đăng ký
                            </v-btn>
                        </v-card-actions>
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
            api: 'https://hr051.cansportsvg.com/api/vgchat/',
            email: null,
            password: null,
            repassword: null,
            nickname: null,
            empno: null,
            mode: 'login', // login, register
            activeCode: null,
        }
    },
    methods: {
        async sendActivationCode() {
            // body to toName subject appname
            let bodyFormData = new FormData();
            bodyFormData.set('to', this.email);
            bodyFormData.set('toName', 'Local Mail Sender');
            bodyFormData.set('subject', 'Mã kích hoạt đăng ký tài khoản tại VG-Chat là: ' + this.genActiveCodeComp);
            bodyFormData.set('body', 'Mã kích hoạt của bạn là: ' + this.genActiveCodeComp);
            bodyFormData.set('appname', 'VG-Chat');
            let res = await this.$axios.post('https://hr051.cansportsvg.com/email/sendmail.php', bodyFormData).then(r => {
                // console.log(r.data);
                alert('Vui lòng kiểm tra email để lấy mã kích hoạt');
            }).catch(err => {
                console.log(err);
            })
        },
        async doLogin() {
            let res = await this.$axios.post(this.api + 'doLogin', {
                empno: this.empno,
                password: this.password,
            }).then(r => {
                console.log(r.data);
                if (r.data !== 'failed') {
                    let resdata = r.data;
                    this.$session.set('vgchat', {
                        login: true,
                        empno: resdata.empno,
                        email: resdata.email,
                        nickname: resdata.nickname,
                        id: resdata.id,
                    });
                    this.$router.push('dashboard');
                } else {
                    alert('Sai thông tin đăng nhập.')
                }
            }).catch(err => alert(err));
        },
        async postRegNewUser() {
            let res = await this.$axios.post(this.api + 'regNewUser', {
                email: this.email,
                nickname: this.nickname,
                empno: this.empno,
                password: this.password,
            }).then(r => {
                if(r.data === 'done'){
                    alert('Đăng ký tài khoản thành công.');
                    window.location.reload();
                }
            }).catch(err => alert(err));
        },
    },
    computed: {
        genActiveCodeComp() {
            return Math.floor(Math.random() * (9999 - 1000)) + 1000;
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.$refs['target'].focus();
        })
    }
}
</script>
