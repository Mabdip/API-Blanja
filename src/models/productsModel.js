const db = require('../config/mySQL')
module.exports = {
    SearchAndSort: (addQuery, urlQuery, total_result, page, offset, limit) => {
        return new Promise((resolve, reject) => {
            let queryStr =
                `SELECT p.id, p.product_name,p.product_img, c.category_name, cl.color_name, s.size_name, cd.condition_name,p.product_price, IFNULL(rev.rating,0) as rating, IFNULL(rev.dibeli,0) as dibeli
            FROM products p
            JOIN category c ON p.category_id = c.id
            JOIN color cl ON p.color_id = cl.id
            JOIN size s ON p.size_id = s.id
            JOIN conditions cd ON p.condition_id = cd.id
            LEFT JOIN (SELECT product_id, AVG(rating) as rating, count(rating) as dibeli from tb_review GROUP BY product_id) rev ON p.id = rev.product_id `
                + addQuery +
                `LIMIT ${limit} OFFSET ${offset}`
            // console.log(queryStr)
            db.query(queryStr, (err, data) => {
                if (!err) {
                    if (data.length) {
                        newData = {
                            products: data,
                            pageInfo: {
                                result: total_result,
                                totalPage: total_result % limit === 0 ? total_result / limit : Math.floor(total_result / limit) + 1,
                                currentPage: page || 1,
                                previousPage:
                                    page === 1 ? null : `/products?${urlQuery}page=${page - 1}&limit=${limit}`,
                                nextpage: offset + limit >= total_result //dia sudah pada result2 terakhir
                                    ? null
                                    : `/products?${urlQuery}page=${page + 1}&limit=${limit}`
                            }
                        }
                        resolve(newData)
                    } else {
                        reject({
                            status: 404,
                            msg: `Not Found`
                        })
                    }
                } else {
                    reject(err)
                }
            })
        })
    },
    countResult: (addQuery) => {
        return new Promise((resolve, reject) => {
            let queryStr =
                `SELECT COUNT(p.id) as total_result
                FROM products p
                JOIN category c ON p.category_id = c.id
                JOIN color cl ON p.color_id = cl.id
                JOIN size s ON p.size_id = s.id
                JOIN conditions cd ON p.condition_id = cd.id
                LEFT JOIN (SELECT product_id, AVG(rating) as rating, count(rating) as dibeli from tb_review GROUP BY product_id) rev ON p.id = rev.product_id `
                + addQuery;
                // console.log(queryStr)
            db.query(queryStr, (err, data) => {
                if (!err) {
                    resolve(data)
                } else {
                    reject(err)
                }
            })

        })
    },
}