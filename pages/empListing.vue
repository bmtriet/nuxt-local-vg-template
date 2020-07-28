<template>
<v-container fluid>
    <v-row>
        <auth></auth>
        <div class="col-12 d-flex justify-space-between align-center">
            <h3 class="display-2" style="font-weight: 100">Danh sách CNV</h3>
        </div>
        <div class="col-2 col-md-3">

            <v-card class="" elevation="10" max-width="">
                <v-card-title>
                    <v-icon>mdi-filter-outline</v-icon>
                    Bộ lọc
                </v-card-title>
                <v-card-text>
                    <v-text-field class="mt-4" type="text" dense hide-details="" error-count="" placeholder="" prefix="VD" label="Mã số thẻ" append-icon="" v-model="empnoFilter" outlined color="cyan darken-2"></v-text-field>
                    <v-select class="mt-4" label="Vị trí làm việc" v-model="workingPlaceFilter" value="Tất cả" :items="uniqueArea" dense hide-details outlined color="cyan darken-2"></v-select>
                    <v-select class="mt-4" label="Công ty" v-model="companyFilter" :items="uniqueCompany" dense hide-details outlined color="cyan darken-2"></v-select>
                    <v-btn-toggle small color="indigo" dense v-model="statusFilter" class="mt-4" active style="width: 100%">
                        <v-btn outlined small dense width="33.3%">
                            Cả 2
                        </v-btn>
                        <v-btn outlined small dense width="33.3%">
                            Còn hạn
                        </v-btn>
                        <v-btn outlined small dense width="33.3%">
                            Hết hạn
                        </v-btn>
                    </v-btn-toggle>
                    <div class="d-flex justify-space-between">
                        <v-btn @click="reset" color="red darken-2" class="mt-4" dark style="width: 45%">
                            <v-icon>mdi-filter-remove-outline</v-icon>
                            Reset
                        </v-btn>
                        <export-excel name="Exam-taken-listing" :data="filterData">
                            <v-btn color="green darken-2" class="mt-4 ml-4" dark style="width: 80%">
                                <v-icon>mdi-file-excel</v-icon>
                                Xuất Excel
                            </v-btn>
                        </export-excel>
                    </div>

                </v-card-text>
                <v-card-actions>
                </v-card-actions>
            </v-card>
        </div>
        <div class="col-10 col-md-9">
            <v-card class="" elevation="10" max-width="">
                <v-card-title>
                    <v-toolbar color="primary" elevation="5" dense="" style="border-radius: 5px">
                        <v-btn target="_blank" :disabled="(printIdComp === null)?true:false" class="mr-2" :to="{path: '../print',query: {id: printIdComp}}"  color="white" small>
                            <v-icon class="pr-1">mdi-printer</v-icon>
                            In thẻ
                        </v-btn>
                        
                        <v-btn class="mr-2" to="newEmp" color="white" small>
                            <v-icon>mdi-plus</v-icon>
                            Tạo mới
                        </v-btn>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :show-select="true" v-model="selectedRow" :items-per-page="50" :headers="headers" :items="filterData">
                        <template v-slot:item.emp_no="{item}">
                            <nuxt-link :to="{path: 'newEmp',query:{id: item.id}}">VD{{ item.emp_no.substr(2) }}</nuxt-link>
                        </template>
                        <template v-slot:item.avatar="{item}">
                            <v-img width="45" class="my-2" style="border: 1px solid #ccc;" :src="item.avatar"></v-img>
                        </template>
                        <template v-slot:item.status="{item}">
                            <v-chip :color="(item.status === 'expired')?'red':'green'" dark small>
                                {{ item.status }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </div>
    </v-row>
</v-container>
</template>

<script>
import auth from '~/components/auth'
import dayjs from 'dayjs'
export default {
    components: {
        auth,
    },
    data() {
        return {
            storageUrl: 'http://10.1.16.84/api/storage/app/',
            api: 'http://10.1.16.84/api/subContractApi/',
            today: new Date(),
            statusFilter: 0, // ['both','expired','normal']
            empnoFilter: null,
            workingPlaceFilter: 'Tất cả',
            companyFilter: 'Tất cả',
            items: null,
            selectedRow: [],
            headers: [{
                    text: 'Ảnh',
                    value: 'avatar'
                },
                {
                    text: 'MST',
                    value: 'emp_no'
                },
                {
                    text: 'Họ Tên',
                    value: 'name'
                },
                {
                    text: 'Công ty',
                    value: 'company'
                },
                {
                    text: 'Vị trí công tác',
                    value: 'vtct'
                },
                {
                    text: 'Ngày vào',
                    value: 'in_date'
                },
                {
                    text: 'Hết hạn',
                    value: 'expired_date'
                },
                {
                    text: 'Trạng thái',
                    value: 'status'
                }
            ],
        }
    },
    methods: {
        async getData() {
            let res = await this.$axios.post(this.api + 'postEmpData');
            if (res.data) {
                this.items = res.data;
            } else {
                alert('DB empty');
            }
        },
        reset() {
            this.workingPlaceFilter = 'Tất cả';
            this.companyFilter = 'Tất cả';
            this.statusFilter = 0;
            this.empnoFilter = null;
        }
    },
    computed: {
        printIdComp() {
            return (this.selectedRow.map(x => x.id).length !== 0)?JSON.stringify(this.selectedRow.map(x => x.id)):null;
        },
        uniqueArea() {
            let u = [...new Set(this.renderData.flatMap(x => x.vtct))];
            u.unshift('Tất cả');
            return u;
        },
        uniqueCompany() {
            let u = [...new Set(this.renderData.flatMap(x => x.company))];
            u.unshift('Tất cả');
            return u;
        },
        renderData() {
            if (this.items) {
                return this.items.map(x => {
                    x.avatar = this.storageUrl + x.avatar;
                    x.status = (dayjs(new Date()).isAfter(x.expired_date)) ? 'expired' : 'normal';
                    x.vtct = (x.working_areas !== '') ? JSON.parse(x.working_areas) : [];
                    return x;
                })
            } else {
                return [];
            }
        },
        filterData() {
            let _t = Object.assign(this.renderData);
            if (this.empnoFilter) {
                _t = _t.filter(x => x.emp_no === 'VD' + this.empnoFilter);
            }
            if (this.statusFilter === 1) {
                _t = _t.filter(x => x.status === 'normal');
            } else if (this.statusFilter === 2) {
                _t = _t.filter(x => x.status === 'expired');
            }
            if (this.companyFilter !== 'Tất cả') {
                _t = _t.filter(x => x.company === this.companyFilter);
            }

            if (this.workingPlaceFilter !== 'Tất cả') {
                _t = _t.filter(x => x.vtct.indexOf(this.workingPlaceFilter) !== -1);
            }

            return _t;
        }
    },
    mounted() {
        this.getData();
        console.log(dayjs(this.today))
    },
    created() {
        this.$nextTick(() => {
            this.workingPlaceFilter = 'Tất cả';
        })
    },
}
</script>
