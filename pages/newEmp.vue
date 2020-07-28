<template>
<v-container fluid>
    <v-row>
        <auth></auth>
        <div class="col-12">
            <v-card class="mx-auto mt-5" elevation="10" max-width="800px">
                <v-toolbar dense color="cyan darken-2" dark>
                    <v-icon class="ma-2">mdi-account-plus</v-icon>
                    CNV mới
                </v-toolbar>
                <v-card-text>
                    <div class="row">
                        <div class="col-3">
                            <img src="~/static/placeholder.gif" @dragover.prevent @drop.stop.prevent="testDrop" class="mt-3 border" width="100%" alt="" id="empPhotoHolder">
                            <label class="v-btn v-btn--block v-btn--tile theme--dark elevation-15 v-size--default cyan" for="empPhotoInput">
                                <v-icon color="white" class="mr-1">mdi-upload</v-icon>
                                Tải ảnh lên
                            </label>
                            <v-file-input v-model="avatarFile" accept="image/*" @change="uploadPhoto" label="" id="empPhotoInput" class="d-none"></v-file-input>
                        </div>
                        <div class="col-9">
                            <div class="row">
                                <div class="col-5">
                                    <v-text-field hide-details="" prefix="VD" dense type="text" color="cyan darken-2" label="Mã số thẻ" prepend-inner-icon="" v-model="emp_no" outlined></v-text-field>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-5">
                                    <v-text-field hide-details="" dense type="text" color="cyan darken-2" label="Tên CNV" prepend-inner-icon="" v-model="name" outlined></v-text-field>
                                </div>
                                <div class="col-7">
                                    <v-text-field hide-details="" dense type="text" color="cyan darken-2" label="Công ty" prepend-inner-icon="" v-model="company" outlined></v-text-field>
                                </div>
                                <div class="col-12">
                                    <v-combobox outlined dense hide-details v-model="working_areas" color="cyan darken-2" label="Khu vực làm việc" :items="deptsList" multiple></v-combobox>
                                </div>
                                <div class="col-12">
                                    <v-text-field hide-details="" dense type="text" color="cyan darken-2" label="Lý do" prepend-inner-icon="" v-model="reason" outlined></v-text-field>
                                </div>
                                <div class="col-6">
                                    <v-text-field hide-details="" dense type="date" color="cyan darken-2" label="Ngày vào" prepend-inner-icon="" v-model="in_date" outlined></v-text-field>
                                </div>
                                <div class="col-6">
                                    <v-text-field hide-details="" dense type="date" color="cyan darken-2" label="Ngày hết hạn" prepend-inner-icon="" v-model="expired_date" outlined></v-text-field>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn outlined text color="cyan darken-2" @click="saveToDb">
                        <v-icon>mdi-content-save</v-icon>
                        Lưu
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-row>
</v-container>
</template>

<script>
import auth from '~/components/auth'
export default {
    head: {
        title: 'Input new employee'
    },
    components: {
        auth,
    },
    data() {
        return {
            storageUrl: 'http://10.1.16.84/api/storage/app/',
            api: 'http://10.1.16.84/api/subContractApi/',
            today: new Date(),
            emp_no: '',
            name: '',
            company: '',
            working_areas: [],
            avatar: null,
            in_date: '',
            avatarFile: null,
            reason: null,
            deptsList: ['Nhà Ăn', 'PCC', 'SR', 'DI', 'F2', 'F3', 'F4', 'MW'],
            expired_date: null,
        }
    },
    methods: {
        async saveToDb() {
            // emp_no - name - company - working_areas - in_date - expired_date - avatar - updated_at - created_at
            let res = await this.$axios.post(this.api + 'saveToDb', {
                emp_no: 'VD' + this.emp_no,
                name: this.name,
                company: this.company,
                reason: this.reason,
                working_areas: JSON.stringify(this.working_areas),
                in_date: this.in_date,
                expired_date: this.expired_date,
                avatar: this.avatar,
            });
            if(res.data === 'done'){
                alert('Update successfully');
            }

        },
        uploadPhoto() {
            // let blob = document.querySelector("#empPhotoInput");
            document.querySelector('#empPhotoHolder').src = URL.createObjectURL(this.avatarFile);
            this.upload();

        },
        testDrop(e) {
            this.avatarFile = e.dataTransfer.files[0];
            document.querySelector('#empPhotoHolder').src = URL.createObjectURL(this.avatarFile);
            this.upload()
        },
        async upload() {
            let formData = new FormData();
            formData.append('avatar', this.avatarFile);
            let options = {
                method: 'post',
                url: this.api + 'postUploadAvatar',
                data: formData,
                maxContentLength: 100000000,
                maxBodyLength: 1000000000
            };
            let res = await this.$axios(options);
            if (res.data) {
                this.avatar = res.data;
                alert('Upload successfully');
            } else {
                alert('Failed to upload this photo, please try again');
            }
        },
        async getData() {
            let res = await this.$axios.post(this.api + 'getEmpDataById', {
                id: this.$route.query.id
            });
            let r = res.data;
            this.avatar = r.avatar;
            document.querySelector('#empPhotoHolder').src = this.storageUrl + r.avatar;
            this.emp_no = r.emp_no.substr(2);
            this.name = r.name;
            this.company = r.company;
            this.reason = r.reason;
            this.working_areas = JSON.parse(r.working_areas);
            this.in_date = r.in_date;
            this.expired_date = r.expired_date;
        },
        expiredDate() {
            this.expired_date = this.today.getFullYear() + '-12-31';
        },
    },
    computed: {

    },
    mounted() {
        if (this.$route.query.id) {
            this.getData();
        }
        this.expiredDate();
    },
}
</script>

<style lang="css">
img#empPhotoHolder {
    border: 1px solid #ccc;
    padding: 3px;
}
</style>
