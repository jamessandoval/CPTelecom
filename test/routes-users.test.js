var chai = require('chai');
var chaiHttp = require('chai-http');
//var user = require('../src/routes/users');
var express = require('express');
var app = express();
var db = require('../models/dbconnect');
var should = chai.should();
chai.use(chaiHttp);
var assert = require('assert');

describe('routes - user', function() {
    describe('start', function() {
        xit('should handle errors', function() {});
        it('should load the page', function(done) {
            chai.request(app).get('/').end((err, res) => {
                should(res.status === 200);
                done();
            });
        });
        // 
    });
});

