require('dotenv').config();
const AWS = require("aws-sdk");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const bucket = "kavya-photos"
const bucketURL = `https://${encodeURIComponent(bucket)}.s3.amazonaws.com/`;
const apiVersion = "2006-03-01"

app.use(express.static(__dirname + '/public'));

app.listen(port, "0.0.0.0", () => {
    console.log(`Now listening on port ${port}`); 
});

AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOLID
});
var s3 = new AWS.S3({
    apiVersion: apiVersion,
    params: {Bucket: bucket},
});

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + "/public/views"});
});

app.get('/gallery', (req, res) => {
    res.sendFile('gallery.html', {root: __dirname + "/public/views"});
});

app.get('/aws-config/bucket-URL', (req, res) => {
    res.json(bucketURL)
})

app.get('/aws-config/album-list', (req, res) => {
    s3.getObject({Key: "albums.json"}, function (err, data) {
        res.json(data.Body.toString("utf-8"))
    })
})

app.get('/aws-config/album-photos', (req, res) => {
    var albumKey = decodeURIComponent(req.query.albumKey)
    s3.listObjects({Prefix: albumKey}, function (err, data) {
        res.json(data.Contents.filter(file => file.Size > 0))
    })
})