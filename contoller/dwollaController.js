var Client = require("dwolla-v2").Client;

const appKey = "2KqnvEWkCJynFCPMnEBc92P1cH3FWI3ykoDwE9gAHohkOi6Ezq";
const appSecret = "eOU8N4GydaI2H5rmSNZPPVRpitJxygy4Yrk7YpJKRo0KiTo45P";
const dwolla = new Client({
    key: appKey,
    secret: appSecret,
    environment: "sandbox",
});


const { Customer } = require("../model/customer")
const { Token } = require("../model/Token")



// const { processorTokenRequest } = require("../service/plaidController")


// Creating Customer , I referred the dwolloDeveloper document, given  below the link
//https://developers.dwolla.com/guides/send-money/create-a-customer

const createCustomer = async (req, res) => {
    const customers = new Customer(req.body)
    // await customers.save()
    var customerCreated = false

    try {

        var requestBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            type: req.body.type,
            address1: req.body.address1,
            type: req.body.type,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            dateOfBirth: req.body.dateOfBirth,
            ssn: req.body.ssn
        }
        await dwolla.post("customers", requestBody).then(function (res) {
            res.headers.get("location");
            if (res.status === 201) {
                customers.customerUrl = res.headers.get("location")
                customers.save()
                customerCreated = true
            }

        });
        if (customerCreated) {
            res.send("customer details are added")
        }
    }
    catch (error) {
        console.error(error);
        res.send("customer details not added, error occured");
    }
}

// for adding bankAccountDetails , I referred the dwollo Developer document, given  below the link
//https://developers.dwolla.com/guides/send-money/add-funding-source
//


//     Adding Bank details -Using Only Dwolla


// const addingCustBankDetails = async (req, res) => {
//     const bankDetails = new BankDetails(req.body)
//     var bankDetailsAdded = false

//     try {
//         const customer = await Customer.find({ "mobileNumber": req.body.mobileNumber })
//         var customerUrl = customer[0].customerUrl
//         console.log(customerUrl)
//         var requestBody = {
//             name: req.body.bankName,
//             routingNumber: req.body.routingNumber,
//             accountNumber: req.body.accountNumber,
//             bankAccountType: req.body.bankAccountType
//         }

//         await dwolla.post(`${customerUrl}/funding-sources`, requestBody).then(function (res) {
//             res.headers.get("location");
//             if (res.status === 201) {
//                 bankDetails.accountUrl = res.headers.get("location")
//                 bankDetails.save()
//                 bankDetailsAdded = true
//             }
//         });
//         if (bankDetailsAdded) {
//             res.send("bank Details Added")
//         }

//     }
//     catch (error) {
//         console.error(error);
//         res.send("bank Details not added Added,error occured");
//     }
// }





///  Verifying Bank Account using dwolla + plaid

const addingBankAndMakingAuth = async (req, res) => {
    try {
        let bankVerified = false
        const customer = await Customer.findOne({ "mobileNumber": req.body.mobileNumber })
        const tokens = await Token.findOne({ "mobileNumber": req.body.mobileNumber })
        const processorToken = tokens.processorToken
        const customerUrl = customer.customerUrl
        customer.bankName = req.body.bankName



        const requestBody = {
            plaidToken: processorToken,
            name: req.body.bankName
        }
        await dwolla.post(`${customerUrl}/funding-sources`, requestBody).then(function (res) {
            res.headers.get("location")
            if (res.status === 201) {
                customer.accountUrl = res.headers.get("location")
                customer.save()
                console.log(res.headers.get("location"))
                bankVerified = true
            }
        });
        if (bankVerified) {
            res.send("Bank account is verified")
        }

    }
    catch (error) {
        console.error(error);
        res.send("error occured");
    }
}






//// for creating Transaction , I referred the dwollo Developer document, given  below the link
//https://developers.dwolla.com/guides/send-money/create-transfer



const createTransfer = async (req, res) => {
    try {
        const Recievingcustomer = await Customer.findOne({ "mobileNumber": req.body.mobileNumber })

        var currency = req.body.currency
        var amount = req.body.amount
        let transferDone = false

        var RecCustomerAcntUrl = Recievingcustomer.accountUrl

        var transferRequest = {
            _links: {
                source: {
                    href: "https://api-sandbox.dwolla.com/funding-sources/396ccaca-8366-490a-bb71-8905031823b8"
                },
                destination: {
                    href: RecCustomerAcntUrl,
                },
            },
            amount: {
                currency: currency,
                value: amount
            },
        };

        await dwolla.post("transfers", transferRequest).then(function (res) {
            res.headers.get("location");
            if (res.status == 201) {
                transferDone = true
            }
            console.log("res", res)
            // console.log(res.headers.get("location"))
        })

        if (transferDone) {
            res.send("money is transfered")
        }
    }
    catch (error) {
        console.error(error);
        res.send("money is not transfered, error occured")
    }
}


const createTransferBetweenCustomer = async (req, res) => {
    try {
        const Sendingcustomer = await Customer.findOne({ "mobileNumber": req.body.sendCusNumber })
        const Recievingcustomer = await Customer.findOne({ "mobileNumber": req.body.recdCusNumber })

        var currency = req.body.currency
        var amount = req.body.amount
        let transferDone = false
        var SendCustomerAcntUrl = Sendingcustomer.accountUrl
        var RecCustomerAcntUrl = Recievingcustomer.accountUrl


        var transferRequest = {
            _links: {
                source: {
                    href: SendCustomerAcntUrl
                },
                destination: {
                    href: RecCustomerAcntUrl,
                },
            },
            amount: {
                currency: currency,
                value: amount
            },
        };

        await dwolla.post("transfers", transferRequest).then(function (res) {
            res.headers.get("location");
            Sendingcustomer.transferUrl = res.headers.get("location");
            Sendingcustomer.save()
            if (res.status == 201) {
                transferDone = true
            }
            console.log("res", res)
            // console.log(res.headers.get("location"))
        })

        if (transferDone) {
            res.send("money is transfered")
        }
    }
    catch (error) {
        console.error(error);
        res.send("money is not transfered, error occured")
    }
}

const statusOfYourTransfer = async (req, res) => {
    try {

        var status = ""
        const Sendingcustomer = await Customer.findOne({ "mobileNumber": req.body.sendCusNumber })
        var transferUrl = Sendingcustomer.transferUrl

        await dwolla.get(transferUrl).then((res) => {
            res.body.status
            status = res.body.status
            console.log(status)
        });
        res.send(`status:${status}`)

        // For Dwolla API applications, an dwolla can be used for this endpoint. (https://developers.dwolla.com/api-reference/authorization/application-authorization)
        // => 'pending'
    }
    catch (error) {
        console.error(error);
        res.send(error)
    }
}


const createWebhookSubscription = async (req, res) => {
    try {
        var webhookUrl = ""
        var requestBody = {
            url: "https://nodenewhost.herokuapp.com/dwolla/dwollawebhook",
            secret: "123456Sfq",
        };
        await dwolla.post("webhook-subscriptions", requestBody)
            .then((res) => {
                res.headers.get("location")
                console.log(res.headers.get("location"))
                webhookUrl = res.headers.get("location")
            });
        res.send(`webhookSubscriptionUrl:${webhookUrl}`)
    }
    catch (error) {
        console.error(error);
        res.send(error)
    }
}


const retrieveAwebhookSubscription = async (req, res) => {
    try {
        var created=""
        var webhookSubscriptionUrl = req.body.webhookUrl;

        await dwolla.get(webhookSubscriptionUrl).then((res) => {
            res.body.created
            console.log(res.body.created)
            created=res.body.created
        });
        res.send(`created:${created}`)
    }
    catch (error) {
        console.error(error);
        res.send(error)
    }
}




module.exports = {
    createCustomer,
    // addingCustBankDetails,
    createTransfer,
    addingBankAndMakingAuth,
    createTransferBetweenCustomer,
    statusOfYourTransfer,
    createWebhookSubscription,
    retrieveAwebhookSubscription
}
