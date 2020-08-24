<template>
<v-container fluid>
    <v-row>
        <auth></auth>
        <div class="col-12 col-md-3">
            <v-card class="" elevation="5" max-width="">
                <v-card-text>
                    <p class="">
                        <v-icon small color="green">
                            mdi-checkbox-blank-circle
                        </v-icon>
                        Đang online
                    </p>
                    <v-divider></v-divider>
                    <div :class="(selectingTargetIndex === index)?'user active':'user'" v-for="(user,index) of userOnline" :key="index" @click="setActiveUser(user,index)">
                        <h4>
                            {{ user.nickname }}
                        </h4>
                        <small v-if="user.lastMsg">
                            {{ user.lastMsg }}
                        </small>
                    </div>
                </v-card-text>

            </v-card>
        </div>
        <div class="col-md-9 col-12">
            <v-card v-if="targetObj" elevation="5">
                <div id="chatWrapper">
                    <div v-for="(c,cIndex) of chatLogs" :key="cIndex">
                        <div v-if="c.me" class="myMsg my-3 text-left">
                            <div class="bubble">
                                {{ c.me }}
                            </div>
                        </div>
                        <div v-if="c.you" class="yourMsg my-3 text-right">
                            <div class="bubble">
                                {{ c.you }}
                            </div>
                        </div>
                    </div>
                </div>
                <v-card-actions>
                    <v-text-field outlined v-model="chatMsg" @keypress.enter="sendMsg" type="text"></v-text-field>
                </v-card-actions>
            </v-card>

        </div>

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
            api: 'https://hr051.cansportsvg.com/api/vgchatApi/',
            selectingTargetIndex: null,
            messageRxd: null,
            chatMsg: '',
            userName: null,
            targetObj: null,
            userOnline: [],
            chatLogs: [],
            currentSession: null,
            loginData: null,
            myId: null,
            tabFocus: true,
        }
    },
    methods: {
        sendMsg() {
            this.socket.emit('passMsgToClient', {
                chatMsg: this.chatMsg,
                toId: this.targetObj.id,
                fromId: this.myId,
            });
            this.chatLogs.push({
                me: this.chatMsg,
                you: null,
            })
            this.chatMsg = null;
            this.$nextTick(() => {
                this.scrollToBottom();
            })
        },
        setActiveUser(u, index) {
            this.selectingTargetIndex = index;
            this.targetObj = u;
        },
        getlist() {
            this.socket.emit('getOnlineUser');
        },
        scrollToBottom() {
            let chatWrapper = document.querySelector('#chatWrapper');
            chatWrapper.scrollTop = chatWrapper.scrollHeight
        },
        saveChatLogs() {
            let name = [this.loginData.id, this.targetObj].sort().join("-");
            let logData = {
                from: this.loginData.id,
                to: this.targetObj.id,
                chats: this.chatLogs, // {me: null,you: null}
            }
            // localStorage.setItem(name,)
        },
        showNotify(text) {
            if (Notification.permission == 'granted') {
                //   console.log(text);
                if (!this.tabFocus) {
                    var n = new Notification('VG-Chat - có tin nhắn mới', {body: text});
                    n.onclick = function (x) {
                        window.focus();
                        this.close();
                    };
                    this.tabFocus = true;
                    // n.show();
                }
            }
        }
    },
    computed: {
        targetDbId() {
            return this.targetObj.dbId;
        }
    },
    mounted() {
        let oriTitle = document.title;
        window.addEventListener('focus', () => {
            document.title = '😀' + oriTitle;
            console.log('focus');
            this.tabFocus = true;
        })
        window.addEventListener('blur', () => {
            document.title = '😪' + oriTitle;
            console.log('blur');
            this.tabFocus = false;
        })
        Notification.requestPermission(function (status) {
            console.log('Notification permission status:', status);
        });
        this.socket = this.$nuxtSocket({
            name: 'home', // Use socket "home"
            channel: '', // connect to '/index'
            reconnection: false
        });
        this.socket.on('connect', () => {
            this.myId = this.socket.id;
            let data = {
                id: this.myId,
                nickname: this.loginData.nickname,
                dbId: this.loginData.id,
            };
            this.socket.emit('joinRoom', data);
        })
        this.socket.on('notifyNewUserHasLogin', list => {
            console.log('Có user mới connected');
            this.userOnline = list;
        })
        this.socket.on('passMsg', data => {
            console.log(data, this.targetObj);
            let i = this.userOnline.findIndex(x => x.fromId = data.fromId);
            this.targetObj = this.userOnline[i];
            this.targetObj.id = data.fromId;
            this.selectingTargetIndex = i;

            if (data.fromId !== this.myId) {
                this.showNotify(data.chatMsg);
                console.log('yeah');
            }
            // this.targetObj.id = data.fromId;    
            this.chatLogs.push({
                me: null,
                you: data.chatMsg,
            });

            this.$nextTick(() => {
                this.scrollToBottom();
            })
        })

        // this.socket.on('logOut', id => {
        //     this.userOnline.splice(this.userOnline.findIndex(x => x.id === id),1);
        //     console.log(id,'disconnected',this.userOnline);
        // })
        this.loginData = (this.$session.get('vgchat')) ? this.$session.get('vgchat') : null;

    },
}
</script>

<style>
.myMsg {
    display: block;
    width: 100%;
    float: left;
}

.myMsg .bubble {
    border: 1px solid #03A9F4;
    padding: 13px;
    border-radius: 16px 16px 0 16px;
    float: right;
}

.yourMsg .bubble {
    border: 1px solid #E91E63;
    padding: 13px;
    border-radius: 16px 16px 16px 0;
    float: left;
    text-align: left;
}

.yourMsg {
    width: 100%;
    display: block;
    float: left;
}

#chatWrapper {
    height: 50vh;
    border: 1px solid #f1f1f1;
    padding: 20px;
    overflow-y: scroll;
}

.bubble {
    max-width: 50%;
}

.user {
    padding: 15px 5px 15px 15px;
    border-bottom: 1px solid #f1f1f1;
    border-radius: 7px;
    margin: 10px 0;
}

.user.active {
    background: gainsboro;
    padding-left: 15px;
}
</style>
