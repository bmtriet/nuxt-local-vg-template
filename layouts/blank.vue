<template>
<v-app>
    <Nuxt></Nuxt>
    <v-footer style="opacity: 0.8" padless :absolute="true" app>
        <v-col col="12" class="text-right m0 p0">
          <small>&copy;  {{ new Date().getFullYear() }} VG Sub Contract Data Management | HR Project team</small>
        </v-col>
    </v-footer>
</v-app>
</template>

<script>
export default {}
</script>
