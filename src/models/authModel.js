const db = require('../config/mySQL')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otp = require('otp-generator')
const nodemailer = require('nodemailer')
const { error } = require('../helpers/form')

module.exports = {
    postNewUser: (body) => {
        return new Promise((resolve, reject) => {
            const saltRounds = Math.floor(Math.random() * 10) + 1
            //hashPw
            bcrypt.hash(body.password, saltRounds, (err, hashedPassword) => {
                //generate newBody from newPw
                const newUser = { ...body, password: hashedPassword }
                const queryStr = `INSERT INTO tb_user SET ?`
                db.query(queryStr, newUser, (err, data) => {
                    if (!err) {
                        const otpCode = otp.generate(6, { alphabets: true, upperCase: true, specialChars: false })
                        const OTPsend = {
                            email: body.email,
                            otp: otpCode
                        }
                        const queryStr = `INSERT INTO tb_otp_activation SET ?`
                        db.query(queryStr, OTPsend, (err, data) => {
                            if (!err) {
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    host: 'smtp.gmail.com',
                                    port: 578,
                                    secure: false,
                                    auth: {
                                        user: process.env.USER_EMAIL,
                                        pass: process.env.PASS_EMAIL
                                    }
                                })
                                // console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

                                let mailOptions = {
                                    from: "BlanjaApp Team <blanja@mail.com>",
                                    to: body.email,
                                    subject: 'OTP Code Activation Account',
                                    html:
                                        ` 
                                                <h1> OTP CODE from Blanja.in Team </h1>
                                                <p> Hello, this is you OTP code ${otpCode} </p> 
                                                <p> Use it to Activate Account </p>
                                                `
                                }
                                transporter.sendMail(mailOptions, (err, data) => {
                                    if (err) {
                                        console.log("Its Error: ", err);
                                    } else {
                                        console.log(`Sent to ${body.email} Success!!!!`);
                                        resolve({
                                            status: 200,
                                            message: `Kode OTP telah dikirim ke email anda`
                                        })
                                    }
                                })

                            } else {
                                reject({
                                    status: 500,
                                    message: `Internal server error`,
                                    details: err
                                })
                            }
                        })
                    } else {
                        reject({
                            msg: `ERROR!`,
                            details: err
                        })
                    }
                })
            })
        })
    },
    activate: (email, otp) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM tb_otp_activation WHERE email = ? AND otp = ?`
            db.query(queryStr, [email, otp], (err, data) => {
                if (!err) {
                    if (data[0]) {
                        const qs = `DELETE FROM tb_otp_activation WHERE email = ? and otp = ?`
                        db.query(qs, [email, otp], (err, data) => {
                            if (!err) {
                                const activateAcc = `UPDATE tb_user SET isActive = 1 WHERE email = ?`
                                db.query(activateAcc, email, (err, data) => {
                                    if (!err) {
                                        resolve({
                                            status: 200,
                                            message: `Selamat akun anda berhasil diaktivasi`,
                                            email: email
                                        })
                                    } else {
                                        reject({
                                            status: 500,
                                            message: `INTERNAL SERVER ERROR`,
                                            details: err
                                        })
                                    }
                                })
                            } else {
                                reject({
                                    status: 500,
                                    message: `INTERNAL SERVER ERROR`,
                                    details: err
                                })
                            }
                        })
                    } else {
                        reject({
                            status: 404,
                            message: `Kode OTP tidak sesuai atau email belum terdaftar atau akun sudah pernah di aktivasi`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: `INTERNAL SERVER ERROR`,
                        details: err
                    })
                }
            })
        })
    },
    resend: (email) => {
        return new Promise((resolve, reject) => {
            const getUser = `SELECT email, isActive FROM tb_user WHERE email = ?`
            db.query(getUser, email, (err, data) => {
                if (!err) {
                    if (data[0]) {
                        if (data[0].isActive != 0) {
                            resolve({
                                status: 200,
                                message: `Akun anda sudah pernah di aktivasi`
                            })
                        } else {
                            const delOtp = `DELETE FROM tb_otp_activation WHERE email = ?`
                            db.query(delOtp, email, (err, data) => {
                                if (!err) {
                                    const otpCode = otp.generate(6, { alphabets: true, upperCase: true, specialChars: false })
                                    const dataResend = {
                                        email: email,
                                        otp: otpCode
                                    }
                                    const queryStr = `INSERT INTO tb_otp_activation SET ?`
                                    db.query(queryStr, dataResend, (err, data) => {
                                        if (!err) {
                                            let transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                host: 'smtp.gmail.com',
                                                port: 578,
                                                secure: false,
                                                auth: {
                                                    user: process.env.USER_EMAIL,
                                                    pass: process.env.PASS_EMAIL
                                                }
                                            })
                                            // console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

                                            let mailOptions = {
                                                from: "BlanjaApp Team <blanja@mail.com>",
                                                to: email,
                                                subject: 'OTP Code Activation Account',
                                                html:
                                                    ` 
                                                <h1> OTP CODE from Blanja.in Team </h1>
                                                <p> Hello, this is you OTP code ${otpCode} </p> 
                                                <p> Use it to Activate Account </p>
                                                `
                                            }
                                            transporter.sendMail(mailOptions, (err, data) => {
                                                if (err) {
                                                    console.log("Its Error: ", err);
                                                } else {
                                                    console.log("Sent Success!!!!");
                                                    resolve({
                                                        status: 200,
                                                        message: `Kode OTP telah dikirim ulang ke email anda`
                                                    })
                                                }
                                            })

                                        } else {
                                            reject({
                                                status: 500,
                                                message: `Internal server error`,
                                                details: err
                                            })
                                        }
                                    })
                                } else {
                                    reject({
                                        status: 500,
                                        message: `Internal server error`,
                                        details: err
                                    })
                                }
                            })
                        }
                    } else {
                        reject({
                            status: 404,
                            message: `Email tidak ditemukan`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: `Internal server error`,
                        details: err
                    })
                }
            })

        })
    },
    postLogin: (body) => {
        return new Promise((resolve, reject) => {
            const { email, password } = body
            const queryStr = `SELECT id, email, password, level_id, fullname, isActive FROM tb_user WHERE email = ?`
            db.query(queryStr, email, (err, data) => {
                if (err) {
                    reject({
                        status: 500,
                        msg: `Error ditemukan pada query`
                    })
                } else {
                    //no result data 
                    if (data.length < 1) {
                        reject({
                            status: 404,
                            msg: `Username atau password salah!`
                        })
                    } else if (data[0].isActive == 0) {
                        reject({
                            status: 401,
                            msg: `Please activate your account first!`
                        })
                    } else {
                        //comparing pw
                        bcrypt.compare(password, data[0].password, (error, result) => {
                            //what is this ?
                            if (error) {
                                reject({
                                    status: 500,
                                    msg: `Proses Hash Error!`
                                })
                            }
                            //result error ?
                            if (!result) {
                                reject({
                                    status: 404,
                                    msg: `Username atau Password salah!`
                                })
                            } else {
                                //sign result to payload jwt
                                const payload = {
                                    user_id: data[0].id,
                                    email,
                                    fullname: data[0].fullname,
                                    level: data[0].level_id
                                }
                                //generate token 
                                const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '72h' })
                                //resolve token to user(FE)
                                resolve({
                                    user_id: data[0].id,
                                    email,
                                    name: data[0].fullname,
                                    level: data[0].level_id,
                                    token
                                })
                            }

                        })

                    }
                }

            })
        })
    },
    postForgot: (email) => {
        return new Promise((resolve, reject) => {
            const getUser = `SELECT email FROM tb_user WHERE email = ?`
            db.query(getUser, email, (err, data) => {
                if (!err) {
                    if (data[0]) {
                        const delOtp = `DELETE FROM tb_otp WHERE email = ?`
                        db.query(delOtp, email, (err, data) => {
                            if (!err) {
                                const otpCode = otp.generate(6, { alphabets: true, upperCase: true, specialChars: false })
                                const dataResend = {
                                    email: email,
                                    otp: otpCode
                                }
                                const queryStr = `INSERT INTO tb_otp SET ?`
                                db.query(queryStr, dataResend, (err, data) => {
                                    if (!err) {
                                        let transporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            host: 'smtp.gmail.com',
                                            port: 578,
                                            secure: false,
                                            auth: {
                                                user: process.env.USER_EMAIL,
                                                pass: process.env.PASS_EMAIL
                                            }
                                        })
                                        // console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

                                        let mailOptions = {
                                            from: "BlanjaApp Team <blanja@mail.com>",
                                            to: email,
                                            subject: 'OTP Code Reset Password',
                                            html:
                                                ` 
                                                <h1> OTP CODE from Blanja.in Team </h1>
                                                <p> Hello, this is you OTP code ${otpCode} </p> 
                                                <p> Use it to reset your password </p>
                                                `
                                        }
                                        transporter.sendMail(mailOptions, (err, data) => {
                                            if (err) {
                                                console.log("Its Error: ", err);
                                            } else {
                                                console.log("Sent Success!!!!");
                                                resolve({
                                                    status: 200,
                                                    message: `Kode OTP telah dikirim ulang ke email anda`
                                                })
                                            }
                                        })

                                    } else {
                                        reject({
                                            status: 500,
                                            message: `Internal server error`,
                                            details: err
                                        })
                                    }
                                })
                            } else {
                                reject({
                                    status: 500,
                                    message: `Internal server error`,
                                    details: err
                                })
                            }
                        })
                    } else {
                        reject({
                            status: 404,
                            message: `Email tidak ditemukan`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: `Internal server error`,
                        details: err
                    })
                }
            })

        })
    },
    getOtp: (email, otp) => {
        return new Promise((resolve, reject) => {
            const queryStr = `SELECT * FROM tb_otp WHERE email = ? AND otp = ?`
            db.query(queryStr, [email, otp], (err, data) => {
                if (!err) {
                    if (data[0]) {
                        const qs = `DELETE FROM tb_otp WHERE email = ? and otp = ?`
                        db.query(qs, [email, otp], (err, data) => {
                            if (!err) {
                                resolve({
                                    status: 200,
                                    message: `Silahkan set ulang password anda`,
                                    email: email
                                })
                            } else {
                                reject({
                                    status: 500,
                                    message: `INTERNAL SERVER ERROR`,
                                    details: err
                                })
                            }
                        })
                    } else {
                        reject({
                            status: 404,
                            message: `Kode OTP tidak sesuai`
                        })
                    }
                } else {
                    reject({
                        status: 500,
                        message: `INTERNAL SERVER ERROR`,
                        details: err
                    })
                }
            })
        })
    },
    resetPassword: (email, newPassword) => {
        return new Promise((resolve, reject) => {
            const saltRounds = Math.floor(Math.random() * 10) + 1
            bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
                if (!err) {
                    newPassword = hashedPassword
                    const queryStr = `UPDATE tb_user SET password = ? WHERE email = ?`
                    db.query(queryStr, [newPassword, email], (err, data) => {
                        console.log(err, data)
                        if (!err) {
                            console.log('sukses')
                            resolve({
                                status: 200,
                                message: `Password berhasil di ubah`
                            })
                        } else {
                            reject({
                                status: 500,
                                message: `INTERNAL SERVER ERROR`,
                                details: err
                            })
                        }
                    })
                } else {
                    reject({
                        status: 500,
                        message: `INTERNAL SERVER ERROR`,
                        details: err
                    })
                }
            })

        })
    },
    postLogout: (blacklisToken) => {
        return new Promise((resolve, reject) => {
            const queryStr = "INSERT INTO blacklist_token SET ?"
            db.query(queryStr, blacklisToken, (err, data) => {
                if (!err) {
                    resolve({
                        msg: `Logout succesful`
                    })
                } else {
                    reject({
                        msg: `GAGAL!`
                    })
                }
            })
        })
    },
    expiredToken: (token) => {
        return new Promise((resolve, reject) => {
            try {
                const tokenNotExpired = jwt.verify(token, process.env.SECRET_KEY)
                console.log(tokenNotExpired)
                resolve({
                    status: 200,
                    message: `Token masih berfungsi`
                })
            } catch (error) {
                reject({
                    status: 401,
                    message: 'token Expired'
                })
            }
        })
    },

}