<template>
<div>
    <v-file-input outlined color="indigo" accept=".xlsx, .xls" @change="readExcel($event)" hide-details ref="excelFile" placeholder="File Excel" prepend-icon="mdi-file-excel" label="Trainees Import"></v-file-input>
    <!-- <v-col v-show="excelData" cols="6">
            <v-file-input accept=".txt" @change="readTxt($event)" hide-details ref="txtFile" placeholder="File Txt" prepend-icon="mdi-note-text" label="Dữ liệu thôi việc"></v-file-input>
        </v-col> -->
</div>
</template>

<script>
import XLSX from 'xlsx/dist/xlsx.full.min'
import Papa from 'papaparse'
export default {
    data() {
        return {
            excelData: null,
            // txtData: null,
        }
    },
    methods: {
        readExcel($event) {
            let self = this;
            var f = $event;

            var reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });
                var d = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
                self.$set(self, 'excelData', d);
                self.$emit('excelData', d);

            };
            reader.readAsArrayBuffer(f);
        },
        readTxt($event) {
            let self = this;
            let f = $event;
            Papa.parse(f, {
                header: true,
                dynamicTyping: true,
                complete: function (res) {
                    self.$set(self, 'txtData', res.data);
                }
            })

        },
    },
    watch: {
        txtData: function (n) {
            this.$emit('txtData', this.txtData);
        }
    }
}
</script>>
