const express = require('express')
const routerPlaid = express.Router()

const { createPublicToken,
    createAccessToken,
    choosingAccountIdforProcessorToken,
    createProcessorToken,
    accountBalance,
    institutionsGetRequest,
    authGetRequest,
    ItemGetRequest,
    InstitutionsGetByIdRequest,
    ItemRemoveRequest,
    } = require("../contoller/plaidApiContoller")

   

routerPlaid.post('/createPublicToken', createPublicToken)
routerPlaid.post('/createAccessToken', createAccessToken)
routerPlaid.post('/choosingAccountIdforProcessorToken', choosingAccountIdforProcessorToken)
routerPlaid.post('/createProcessorToken', createProcessorToken)
routerPlaid.post('/accountBalance',accountBalance)
routerPlaid.post('/institutionsGetRequest',institutionsGetRequest)
routerPlaid.post('/authGetRequest',authGetRequest)
routerPlaid.post('/ItemGetRequest',ItemGetRequest)
routerPlaid.post('/InstitutionsGetByIdRequest',InstitutionsGetByIdRequest)
routerPlaid.post('/ItemRemoveRequest',ItemRemoveRequest)




module.exports = routerPlaid