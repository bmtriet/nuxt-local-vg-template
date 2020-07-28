<template>
<div id="wrapper" class="container--fluid">
    <auth></auth>
    <v-row no-gutters="">
        <div @click="toggleSide" v-for="(e,index) of empData" :key="index" class="card col-4 my-2 pa-0" :style="'background-image: url('+sideComp+'.jpg);'">
            <div :class="(side)?'':'d-none'" class="abs empAvatar"> <img :src="storageUrl+e.avatar"> </div>
            <div :class="(side)?'':'d-none'" class="abs empNo">
                {{ e.emp_no }}
            </div>
            <div :class="(side)?'':'d-none'" class="abs empName">
                {{ e.name }}
            </div>
            <div :class="(side)?'':'d-none'" class="abs company">
                {{ e.company }}
            </div>
            <div :class="(side)?'':'d-none'" class="abs reason">
                {{ e.reason }}
            </div>
            <div :class="(side)?'':'d-none'" class="abs expired">
                {{ fmtDate(e.in_date) }} - {{ fmtDate(e.expired_date) }}
            </div>
            <div :class="(side)?'':'d-none'" class="abs workingArea">
                {{ JSON.parse(e.working_areas).join(',') }}
            </div>
        </div>
    </v-row>
</div>
</template>

<style lang="css">
.card {
    width: 100%;
    position: relative;
    background-size: contain;
    height: 225px;
    transform: scale(0.95);
    background-position: center;
}

.abs {
    position: absolute !important;
    font-size: 15px;
}

.empAvatar {
    top: 55px;
    left: 5px;
}

.empAvatar img {
    width: 25%;
    border-radius: 5px;
}

.empNo {
    top: 12px;
    right: 14px;
    font-weight: bold;
}

.empName {
    top: 51px;
    width: 72%;
    left: 98px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
}
.reason {
    top: 112px;
    width: 72%;
    left: 98px;
    height: 32px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.expired {
    top: 159px;
    width: 72%;
    left: 98px;
    text-align: center;
}

.workingArea {
    top: 202px;
    text-align: center;
    width: 95%;
    left: 9px;
    /* font-size: 12px; */
}

.company {
    top: 83px;
    width: 72%;
    left: 98px;
    text-align: center;
}
</style>

<script>
import auth from '~/components/auth'
import dayjs from 'dayjs'
export default {
    layout: 'print',
    components: {
        auth,
    },
    data() {
        return {
            storageUrl: 'http://10.1.16.84/api/storage/app/',
            api: 'http://10.1.16.84/api/subContractApi/',
            empId: this.$route.query.id,
            side: true, //['front', 'back']
            empData: [],
        }
    },
    methods: {
        async getDataById() {
            let res = await this.$axios.post(this.api + 'postEmpDataByIDs', {
                empId: this.empId,
            });
            this.empData = res.data;
        },
        toggleSide() {
            this.side = !this.side;
        },
        fmtDate(input) {
            return dayjs(input).format('DD.MM.YYYY');
        },
        print(){
            window.print();
        }
    },
    computed: {
        sideComp() {
            return (this.side) ? 's-f' : 's-b';
        },
    },
    mounted() {
        this.getDataById();
    },
}
</script>
