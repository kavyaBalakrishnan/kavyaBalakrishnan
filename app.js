require('dotenv').config();
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const originalPhotoBucket = 'kavya-pictures-originals'
const thumbnailPhotoBucket = 'kavya-pictures-optimized'
const apiVersion = '2006-03-01'

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOLID
});
const s3_originals = new AWS.S3({
    apiVersion: apiVersion,
    params: { Bucket: originalPhotoBucket },
});

const thumbnailPhotoBucketURL = `https://${encodeURIComponent(thumbnailPhotoBucket)}.s3.amazonaws.com/`;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public/views' });
});

app.get('/gallery', (req, res) => {
    res.sendFile('gallery.html', { root: __dirname + '/public/views' });
});

app.get('/aws-config/album-list', (req, res) => {
    s3_originals.getObject({ Key: 'albums.json' }, function (err, data) {
        res.json(data.Body.toString('utf-8'))
    })
})

app.get('/aws-config/album-photos', (req, res) => {
    var albumKey = decodeURIComponent(req.query.albumKey)
    s3_originals.listObjects({ Prefix: albumKey }, function (err, data) {
        res.json(data.Contents.filter(file => file.Size > 0))
    })
})

app.get('/aws-config/1x-photo-url', (req, res) => {
    const photoKey = decodeURIComponent(req.query.photoKey)
    const thumbnailSizePrefix = '1x/'
    const url = `${thumbnailPhotoBucketURL}${thumbnailSizePrefix}${photoKey}`;
    res.json(url);
})

app.get('/aws-config/2x-photo-url', (req, res) => {
    const photoKey = decodeURIComponent(req.query.photoKey)
    const thumbnailSizePrefix = '2x/'
    const url = `${thumbnailPhotoBucketURL}${thumbnailSizePrefix}${photoKey}`;
    res.json(url);
})