

const 
    path = require('path')

const socket = io()
const app = new Vue({
    el: '#rmndfl-app',
    data: {
        firstName: '',
        lastName: '',
        number: '',
        email: "",
        admin: "",
        client: {},
        clients: [],
        signedUp: false,
        unsuccessful: false,
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
            socket.emit('signed-up', number)
        } 
    },
    components: {
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'welcome-component': welcomeComponent
    }
})


// Client Side Socket Event
socket.on('refresh-messages', messages => {
    app.messages = messages
})
socket.on('refresh-users', users => {
    app.users = users
})

socket.on('successful-join', adminEmail => {
    // the successful-join event is emitted on all connections (open browser windows)
    // so we need to ensure the loggedIn is set to true and user is set for matching user only
    if (adminEmail === app.admin) {
        app.admin = adminEmail
        app.loggedIn = true
    }
    app.unsuccessful = false
    app.users.push(user)
})

socket.on('unsuccessful-join', user => {
    app.unsuccessful = true
})

// TODO: succcessful-sign-up
socket.on('successful-sign-up', client => {
    app.clients.add(client)
    app.clientMessage = true
})

// TODO: unsuccessful-sign-up


socket.on('successful-message', content => {
    // clear the message after success send
    app.message = ''
    app.messages.push(content)
})
