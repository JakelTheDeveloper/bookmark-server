const express = require('express')
const {v4:uuid} = require('uuid')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
const logger = require('../logger') 
const { bookmarks } = require('../store')

bookmarkRouter
.route('/bookmarks')
.get((req,res)=>{
    res.json(bookmarks)
})

.post(bodyParser, (req,res)=>{
    const { title, rating, url, description } = req.body;

    if (!title) {
        logger.error(`Title is required`);
        return res
            .status(400)
            .send('Invalid data');
    }
    if (!rating) {
        logger.error(`rating is required`);
        return res
            .status(400)
            .send('Invalid data');
    }
    if (!url) {
        logger.error(`url is required`);
        return res
            .status(400)
            .send('Invalid data');
    }
    if (!description) {
        logger.error(`description is required`);
        return res
            .status(400)
            .send('Invalid data');
    }


    const id = uuid();

    const bookmark = {
        id,
        title,
        rating,
        url,
        description
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(bookmark);
})

bookmarkRouter
.route('/bookmark/:id')
.get((req,res)=>{
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    // make sure we found a card
    if (!bookmark) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
            .status(404)
            .send('Bookmark Not Found');
    }

    res.json(bookmark);
})

module.exports = bookmarkRouter