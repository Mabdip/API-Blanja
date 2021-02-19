const chatModel = require('./../models/chatModel')

module.exports = {
    addNewMessage: (req, res) => {
        let { body } = req
        body = {
            ...body,
            create_at: new Date(Date.now())
        }
        chatModel.addNewMessage(body)
            .then((result) => {
                if(global.io.to(body.seller).to(body.buyer).emit('refresh', 'someMessage')){
                    console.log(`Refresh to ${body.seller} and ${body.buyer}`)
                }
                res.status(result.status).json(result)
            }).catch((error) => {
                res.status(error.status).json(error)
            })
    },
    getListChatSeller: (req, res) => {
        const {user_id} = req.decodedToken
        chatModel.getListChatSeller(user_id)
            .then((result) => {
                res.status(result.status).json(result)
            }).catch((error) => {
                res.status(error.status).json(error)
            })
    },
    getListChatBuyer: (req, res) => {
        const {user_id} = req.decodedToken
        console.log(user_id)
        chatModel.getListChatBuyer(user_id)
            .then((result) => {
                res.status(result.status).json(result)
            }).catch((error) => {
                res.status(error.status).json(error)
            })
    },
    getNewMessage: (req, res) => {
        const { roomChat } = req.params
        chatModel.getNewMessage(roomChat)
            .then((result) => {
                res.status(result.status).json(result)
            }).catch((error) => {
                res.status(error.status).json(error)
            })
    }
}