<template>
<v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
            <div v-for="(l,index) of sideNavItems" :key="index">
                <v-list-item @click="drawer = false" :to="l.link">
                    <v-list-item-action>
                        <v-icon>{{ l.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ l.label }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <VDivider v-show="l.divider"></VDivider>
            </div>
            <VDivider></VDivider>
            <v-list-item link @click="logout">
                <v-list-item-action>
                    <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Logout
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="cyan" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>APP QUẢN LÝ CNV NHÀ THẦU PHỤ - VG</v-toolbar-title>
    </v-app-bar>

    <v-main>
        <Nuxt></Nuxt>
    </v-main>
    <v-footer padless style="opacity: 0.8">
        <v-col col="12" class="text-right m0 p0">
            <small>&copy; {{ new Date().getFullYear() }} VG Sub Contract Database Management | HR Project team</small>
        </v-col>
    </v-footer>
</v-app>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$session.destroy();
            this.$router.push('/');
        }
    },
    data: () => ({
        drawer: false,
        sideNavItems: [
            {
                link: '/empListing',
                icon: 'mdi-view-list',
                label: 'Emp. listing',
                divider: false,
            },
            {
                link: '/newEmp',
                icon: 'mdi-file-import',
                label: 'New Employee',
                divider: false,
            },
        ]
    }),
}
</script>
