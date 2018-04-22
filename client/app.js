const chatComponent = {
    template: ` <div class="chat-box">
                   <p v-for="data in content">
                       <img v-bind:src=data.user.img class="circle" width="30px">
                       <span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
                       <br />
                       {{data.message}}
                   </p>
               </div>`,
    props: ['content']
}

// Users Component
const users = {
    template: ` <div class="user-list">
                   <h6>Active Users ({{users.length}})</h6>
                   <ul v-for="user in users">
                       <li>
                            <img v-bind:src=user.img class="circle" width="30px">
                            <span>{{user.name}}</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['users']
}

// admin's clients
const adminClients = {
    template: ` <div class="user-list" v-if="clients.length > 0">
                   <h6>Clients: ({{clients.length}})</h6>
                   <ul v-for="obj in clients">
                       <li>
                            <span>{{obj.phone}}</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['clients']
}

// Welcome Component
const welcomeComponent = {
    template: `<div class="me h5" style="text-align: center" v-if=user.name>
                    <h3>Welcome</h3>
                    <img class="circle" v-bind:src=user.img width=30%>
                    <h4>{{user.name}}</h4>
                </div>`,
    props: ['user']
}

const socket = io()


const app = new Vue({
    el: '#rmndfl-app',
    data: {
        firstName: '',
        lastName: '',
        number: '',
        client: {},
        admin: "",
        email:"",
        clients: [],
        signedUp: false,
        successful: false,
        loggedIn: false,
        clientMessage: false

    },
    methods: {
        joinUser: function () {
            if (!this.email)
                return

            socket.emit('join-user', this.email)
        },
        sendMessage: function () {
            if (!this.message)
                return

            socket.emit('send-message', { message: this.message, user: this.user })
        },

        customerSignUp: function() {
            if(!this.number)
                return
            socket.emit('signed-up', this.number)
        } 
    },
    components: {
        'chat-component': chatComponent,
        'welcome-component': welcomeComponent,
        'admin-component': adminClients
    }
})


// Client Side Socket Event
// socket.on('refresh-messages', messages => {
//     app.messages = messages
// })
// socket.on('refresh-users', users => {
//     app.users = users
// })

socket.on('successful-join', adminEmail => {
    // the successful-join event is emitted on all connections (open browser windows)
    // so we need to ensure the loggedIn is set to true and user is set for matching user only
    if (adminEmail === app.admin) {
        app.admin = adminEmail
        app.loggedIn = true
    }
    app.successful = true
})

socket.on('unsuccessful-join', user => {
    app.successful = false
})

// TODO: succcessful-sign-up
socket.on('successful-sign-up', numberObj => {
    console.log('help', numberObj);
    app.clients.push(numberObj)
    console.log(numberObj.phone)
    app.clientMessage = true
})

// TODO: unsuccessful-sign-up


socket.on('successful-message', content => {
    // clear the message after success send
    app.message = ''
    app.clients.push(content)
    
})
