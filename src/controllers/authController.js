const authModel = require('../models/authModel')
const form = require('../helpers/form')

module.exports = {
    signup: (req, res) => {
        const { body } = req
        authModel.postNewUser(body)
            .then((result) => {
                res.status(200).json(result)
            }).catch((error) => {
                res.status(500).json(error)
            })
    },
    activate: (req, res) => {
        const {email, otp} = req.params
        authModel.activate(email, otp)
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    },
    resend: (req, res) => {
        const {email} = req.body
        authModel.resend(email)
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) =>{
            res.status(error.status).json(error)
        })
    },
    login: (req, res) => {
        const { body } = req
        authModel.postLogin(body)
            .then((result) => {
                res.status(200).json({
                    message:`sukses`,
                    result
                })
            }).catch((error) => {
                res.status(error.status).json(error)
            })
    },
    forgot: (req, res) => {
        const {email} = req.body
        authModel.postForgot(email)
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    },
    otp: (req, res) => {
        const {email, otp} = req.params
        authModel.getOtp(email, otp)
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    },
    reset: (req,res) => {
        const {email, newPassword} = req.body
        authModel.resetPassword(email, newPassword)
        .then((result) =>{
            res.status(200).json(result)
        }).catch((error) =>{
            res.status(500).json(error)
        })
    },
    logout: (req, res) => {
        const bearerToken = req.header("x-access-token");
        if (!bearerToken) {
            res.json({
                msg: `token null!`
            })
        } else {
            blacklisToken = {
                token: bearerToken.split(" ")[1]
            }
            authModel.postLogout(blacklisToken)
                .then((result) => {
                    res.status(200).json(result)
                }).catch((error) => {
                    res.status(500).json(error)
                })
        }
    },
    checkExpired: (req, res) =>{
        const {token} = req.params
        authModel.expiredToken(token)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(error.status).json(error)
        })
    }
}