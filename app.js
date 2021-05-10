//init 
const express = require('express');
const config  = require('config');
const validUrl = require('valid-url');
const shortId = require('shortid');
const app = express();
const port = 3000;
const Url = require('./url');

//connect to mongodb
const connectDB = require('./config/db');
connectDB();

// render static page
app.use('/', express.static('./public'));

// listen to routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// @route /api/shrink 
// @desc handler to shrink long url
app.post('/api/shrink', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl'); 
    if(!validUrl.isUri(baseUrl)) {
        return res.status(400).json('Invalid base url');
    }
    const urlId = shortId.generate();
    if(validUrl.isUri(longUrl)) {
        try {
            let urlRecord = await Url.findOne({ longUrl });
            if(urlRecord) return res.json(urlRecord);
            const shortUrl = baseUrl + '/' + urlId;
            const newUrlRecord = new Url({
                longUrl,
                shortUrl,
                urlId
            })
            await newUrlRecord.save();
            return res.json(newUrlRecord);


        } catch (err) {
            console.error(err.message);
            return res.status(500).json('Internal server error');   

        }
    } else {
        return res.status(400).json('Invalid URL');   
    }
});

// @route /api/expand 
// @desc handler to expand short url
app.post('/api/expand', async (req, res) => {
    const { shortUrl } = req.body;
    const baseUrl = config.get('baseUrl'); 
    if(!validUrl.isUri(baseUrl)) {
        return res.status(400).json('Invalid base url');
    }
    try {
        let urlRecord = await Url.findOne({ shortUrl });
        if(urlRecord) return res.json(urlRecord);
        return res.status(400).json('URL cannot be expanded'); 
    } catch (err) {
        console.error(err.message);
        return res.status(500).json('Internal server error');
    }
});

// @route /api/getLong 
// @desc redirect to long url
app.get('/:shortUrl', async (req,res) => {
    try {
        let urlRecord = await Url.findOne({urlId: req.params.shortUrl});
        if(urlRecord) return res.redirect(urlRecord.longUrl);
        return res.status(400).json('Invalid short url'); 
    } catch (err) {
        console.error(err.message);
        return res.status(500).json('Internal server error');
    }
});

// @route /api/getRecords 
// @desc handler to return all records from short - long url map
app.get('/api/getRecords', async (req, res) => {
    try {
        let urlRecord = await Url.find();
        return res.json(urlRecord);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json('Internal server error');
    }
})

app.listen(process.env.PORT || port, () => console.log(`Lisiting on ${port}`) );