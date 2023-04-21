const getUniversidades = async(req, res = response) => {

    return res.status(200).json({
        eee: 'hello world'
    })
}

const newUniversidad = async(req, res = response) => {
    return res.status(200).json({
        req
    })
}

module.exports = { getUniversidades, newUniversidad }