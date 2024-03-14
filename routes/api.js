var express = require('express');
var router = express.Router();

const Distributors = require('../models/distributors')
const Furits = require('../models/fruits')

router.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body;
        const newDistributors = new Distributors({
            name: data.name
        });
        const result = await newDistributors.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/add-furit', async (req, res) => {
    try {
        const data = req.body;
        const newFruit = new Furits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newFruit.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Thêm không thành công",
                "data": []
            })

        }
    } catch (error) {
        console.log(error);
    }
})

//get fruits by id
router.get('/get-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await Furits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})


//get fruits by price
router.get('/get-fruit-in-price', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;

        const query = { price: { $gte: minPrice, $lte: maxPrice } };

        const data = await Furits.find(query, "name quantity price id_distributor")
            .populate('id_distributor')
            .sort({ quantity: -1 })
            .skip(0)
            .limit(2)
        res.json({
            'status': 200,
            'messenger': 'Danh sách fruit',
            'data': data
        })
    } catch (error) {
        console.log(error);
    }
})

//get fruit have name a or x
router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    try {
        const query = {
            $or: [
                { name: { $regex: 'A' } },
                { name: { $regex: 'X' } },
            ]
        }


        const data = await Furits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor')

        res.json({
            'status': 200,
            'messenger': 'Danh sách fruit',
            'data': data
        })
    } catch (error) {
        console.log(error);
    }
})

router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const updatefruit = await Furits.findById(id)
        let result = null;
        if (updatefruit) {
            updatefruit.name = data.name ?? updatefruit.name,
                updatefruit.quantity = data.quantity ?? updatefruit.quantity,
                updatefruit.price = data.price ?? updatefruit.price,
                updatefruit.status = data.status ?? updatefruit.status,
                updatefruit.image = data.image ?? updatefruit.image,
                updatefruit.description = data.description ?? updatefruit.description,
                updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor,
                result = await updatefruit.save();
        }
        if (result) {
            res.json({
                'status': 200,
                'messenger': 'Cập nhật thành công',
                'data': result
            })
        } else {
            res.json({
                'status': 400,
                'messenger': 'Cập nhật không thành công',
                'data': []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
