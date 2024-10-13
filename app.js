require('dotenv').config();
const AWS = require("aws-sdk");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const apiVersion = "2006-03-01"
const originalPhotoBucket = 'kavya-pictures-originals'
const thumbnailPhotoBucket = 'kavya-pictures-optimized'

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOLID
});
var s3_originals = new AWS.S3({
    apiVersion: apiVersion,
    params: { Bucket: originalPhotoBucket },
});
var s3_optimized = new AWS.S3({
    apiVersion: apiVersion,
    params: { Bucket: thumbnailPhotoBucket },
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/public/views" });
});

app.get('/gallery', (req, res) => {
    res.sendFile('gallery.html', { root: __dirname + "/public/views" });
});

app.get('/aws-config/album-list', (req, res) => {
        res.json(data.Body.toString("utf-8"))
    s3_originals.getObject({ Key: 'albums.json' }, function (err, data) {
    })
})

app.get('/aws-config/1x-photo-url', async (req, res) => {
    var photoKey = decodeURIComponent(req.query.photoKey)
    const params = {
        Bucket: thumbnailPhotoBucket,
        Key: '1x/' + photoKey,
        Expires: 60
    };
    try {
        const url = await s3_optimized.getSignedUrlPromise('getObject', params);
        res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/aws-config/2x-photo-url', async (req, res) => {
    var photoKey = decodeURIComponent(req.query.photoKey)
    const params = {
        Bucket: thumbnailPhotoBucket,
        Key: '2x/' + photoKey,
        Expires: 60
    };
    try {
        const url = await s3_optimized.getSignedUrlPromise('getObject', params);
        res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/aws-config/album-photos', (req, res) => {
    var albumKey = decodeURIComponent(req.query.albumKey)
    s3_originals.listObjects({ Prefix: albumKey }, function (err, data) {
        res.json(data.Contents.filter(file => file.Size > 0))
    })
})