var TeleSignSDK = require('telesignsdk');
    var customerId = "FFFFFFFF-EEEE-DDDD-1234-AB1234567890"; // find in portal.telesign.com
    var apiKey = "EXAMPLE----TE8sTgg45yusumoN4BYsBVkh+yRJ5czgsnCehZaOYldPJdmFh6NeX8kunZ2zU1YWaUw/0wV6xfw==";
    var restEndpoint = "https://rest-api.telesign.com";
    var timeout = 10*1000; // 10 secs

    var telesign = new TeleSignSDK( customerId,
                                    apiKey,
                                    restEndpoint,
                                    timeout // optional
                                  );

var phoneNumber = "phone_number"; // Your end user’s phone number, as a string of digits without spaces or
    // punctuation, beginning with the country dialing code (for example, “1” for North America)
    var message = "You're scheduled for a dentist appointment at 2:30PM.";
    var messageType = "ARN"; // ARN = Alerts, Reminders, and Notifications; OTP = One time password; MKT = Marketing
    var referenceId = null; // need this to check status later

    telesign.sms.message(function(err, reply){
            if(err){
                console.log("Error: Could not reach TeleSign's servers");
                console.error(err); // network failure likely cause for error
            }
            else{
                console.log("YAY!, the SMS message is being sent now by TeleSign!");
                console.log(reply);
                referenceId=reply.reference_id; // save the reference_id to check status of the message
            }
        },
        phoneNumber,
        message,
        messageType
    );