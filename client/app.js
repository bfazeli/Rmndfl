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
const usersComponent = {
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
        email: "",
        admin: "",
        client: {},
        clients: [],
        signedUp: false,
        unsuccessful: false,
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
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'welcome-component': welcomeComponent
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
    app.unsuccessful = false
    app.users.push(user)
})

socket.on('unsuccessful-join', user => {
    app.unsuccessful = true
})

// TODO: succcessful-sign-up
socket.on('successful-sign-up', number => {
    app.clients.push(number)
    app.clientMessage = true
})

// TODO: unsuccessful-sign-up


socket.on('successful-message', content => {
    // clear the message after success send
    app.message = ''
    app.messages.push(content)
})
