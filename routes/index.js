const express = require('express');
const router = express.Router();
const Server = require('../schemas/server');
const cache = require('express-redis-cache')({ expire: 60 });

let shouldCache = function (req, res, next) {
    res.use_express_redis_cache = !req.user;

    next();
};

router.get('/:page(\\d+)?', shouldCache, cache.route(), function (req, res, next) {
    Server.paginate({}, { page: Math.abs(req.params.page) || 1, limit: 10, sort: { likes: -1, players: -1 }}, function (err, result) {
        if(err) return next(err);

        if(result.page > result.pages) return res.redirect(result.pages);
        if(result.page !== 1) {
            res.render('index', {title: 'Highlights', user: req.user, servers: result.docs, pagination: result});
        } else {
            Server.find({ top: true }, function (err, top) {
                if(err) return next(err);

                res.render('index', {title: 'Highlights', user: req.user, servers: result.docs, pagination: result, top: top});
            });
        }
    });
});

router.get('/players/:page(\\d+)?', shouldCache, cache.route(), function (req, res, next) {
    Server.paginate({}, { page: Math.abs(req.params.page) || 1, limit: 10, sort: { players: -1, likes: -1 }}, function (err, result) {
        if(err) return next(err);

        if(result.page > result.pages) return res.redirect(result.pages);
        res.render('view', {title: 'Servers with the most players', user: req.user, servers: result.docs, pagination: result, show_type: true, url: '/players'});
    });
});

router.get('/free/:page(\\d+)?', shouldCache, cache.route(), function (req, res, next) {
    Server.paginate({ type: { $ne: 2 } }, { page: Math.abs(req.params.page) || 1, limit: 10, sort: { likes: -1, players: -1 }}, function (err, result) {
        if(err) return next(err);

        if(result.page > result.pages) return res.redirect(result.pages);
        res.render('view', {title: 'Non Premium Servers', user: req.user, servers: result.docs, pagination: result, show_type: false, url: '/free'});
    });
});

router.get('/premium/:page(\\d+)?', shouldCache, cache.route(), function (req, res, next) {
    Server.paginate({ type: 2 }, { page: Math.abs(req.params.page) || 1, limit: 10, sort: { likes: -1, players: -1 }}, function (err, result) {
        if(err) return next(err);

        if(result.page > result.pages) return res.redirect(result.pages);
        res.render('view', {title: 'Premium Servers', user: req.user, servers: result.docs, pagination: result, show_type: false, url: '/premium'});
    });
});

router.get('/tos', function (req, res, next) {
    res.render('tos', {title: 'Terms of Service', user: req.user});
});
router.get('/privacy', function (req, res, next) {
    res.render('tos', {title: 'Privacy Policy', user: req.user});
});

router.get('/who', function (req, res, next) {
    if(req.user) {
        res.send(req.user._id)
    } else {
        res.send('Log out')
    }
});

module.exports = router;
