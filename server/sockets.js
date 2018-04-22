module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment'),
        telesign = require('telesignsdk')
        customerId = "4B352C45-9C92-4AE0-9D89-F4FCA6B50E56";
        apiKey = "iUlB03dfTFyNTpDL3e+dSudBD007bl4e9TnLuYhk4P9mmiMuX38bSQcuUHJ4WiDJV8GZhxuo/ulFttapMN8eEA==";
        restEndpoint = "https://rest-api.telesign.com";
        timeout = 10*1000; // 10 secs

    const adminEmail = "bfazeli1@gmail.com"
    

    

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        telesign = new TeleSignSDK( customerId,
            apiKey,
            restEndpoint,
            timeout // optional
          );
          
        // on making a connection - load in the content already present on the server
        socket.emit('refresh-messages', messages)
        socket.emit('refresh-users', users)

        socket.on('join-user', email => {
            if (email == adminEmail) {
                
                io.emit('successful-join', email)
            }
            else {
                io.emit('unsuccessful-join', email)
            }
        })

        socket.on('send-message', phoneNumber => {
            // punctuation, beginning with the country dialing code (for example, “1” for North America)
            var message = "Here is your 20% off code. Y1j2Kl";
            var messageType = "ARN"; // ARN = Alerts, Reminders, and Notifications; OTP = One time password; MKT = Marketing
            var referenceId = null; // need this to check status later
            telesign.sms.message(function(err, reply){
                if(err){
                    console.log("Error: Could not reach TeleSign's servers");
                    console.error(err); // network failure likely cause for error
                    io.emit('unsuccessful-sign-up')
                }
                else{
                    console.log("YAY!, the SMS message is being sent now by TeleSign!");
                    console.log(reply);
                    referenceId=reply.reference_id; // save the reference_id to check status of the message
                    const client = { number: phoneNumber}

                    io.emit('successful-sign-up', client)
                }
            },
            phoneNumber,
            message,
            messageType
        );
        })

        socket.on('send-message', data => {
            const content = {
                user: data.user,
                message: data.message,
                date: moment(new Date()).format('MM/DD/YY h:mm a')
            }

            messages.push(content)

            io.emit('successful-message', content)
        })

        socket.on('disconnect', () => {
            users = users.filter(user => {
                return user.id != socket.id
            })

            io.emit('refresh-users', users)
        })
    })
}
