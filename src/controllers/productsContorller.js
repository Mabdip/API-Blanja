const productsModel = require('../models/productsModel')
const form = require('../helpers/form')
module.exports = {
  SearchAndSort: (req, res) => {
    //pagination
    const { query } = req
    const limit = Number(query.limit) || 6 //jika tidak terdeklarasi limit otomatis 5
    const page = Number(query.page) || 1 //jika tidak terdeklarasi page otomatis 1
    const offset = (page - 1) * limit
    //search and filter
    const { name, color, size, category } = req.query;
    let addQuery = ``
    let urlQuery = ``
    let query_length = Object.keys(req.query).length
    if (query.page) {
      query_length -= 1
    }
    if (query.limit) {
      query_length -= 1
    }
    if (query.sortBy) {
      query_length -= 1
    }
    if (query.orderBy) {
      query_length -= 1
    }
    // console.log("ini query length: "+query_length)
    let initial = 1
    if (query_length != 0) {
      addQuery += `WHERE `
      if (name != null) {
        addQuery += `product_name like '%${name}%' `
        urlQuery += `name=${name}`
        urlQuery += `&`
        if (initial != query_length) {
          addQuery += `AND `
          initial += 1
        }
      }
      if (color != null) {
        addQuery += `color_id = ${color} `
        urlQuery += `color=${color}`
        urlQuery += `&`
        if (initial != query_length) {
          addQuery += `AND `

          initial += 1
        }
      }
      if (size != null) {
        addQuery += `size_id = ${size} `
        urlQuery += `size=${size}`
        urlQuery += `&`
        if (initial != query_length) {
          addQuery += `AND `

          initial += 1
        }
      }
      if (category != null) {
        addQuery += `category_id = ${category} `
        urlQuery += `category=${category}`
        urlQuery += `&`
        if (initial != query_length) {
          addQuery += `AND `
          initial += 1
        }
      }
    }

    //SORT
    const { sortBy, orderBy } = req.query
    if (sortBy != null) {
      if (orderBy == `desc`) {
        addQuery += `ORDER BY ${sortBy} DESC `
        urlQuery += `sortBy=${sortBy}&orderBy=desc&`
      } else {
        addQuery += `ORDER BY ${sortBy} ASC `
        urlQuery += `sortBy=${sortBy}&orderBy=asc&`
      }
    } else {
      addQuery += `ORDER BY created_at DESC `
      urlQuery += `sortBy=created_at&orderBy=desc&`
    }

    // console.log(urlQuery)
    // console.log(addQuery)
    productsModel.countResult(addQuery)
      .then((result) => {
        productsModel.SearchAndSort(addQuery, urlQuery, result[0].total_result, page, offset, limit)
          .then((data) => {
            form.success(res, data)
          }).catch((err) => {
            form.error(res, err)
          })
      }).catch((error) => {
        res.status(500).json(error)
      })
  },
}