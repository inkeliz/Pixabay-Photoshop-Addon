/**
 * Created by lucas on 07/10/2017.
 */

var open = indexedDB.open("CacheDB", 1);
var getCache = function () {
    return false;
};

var putCache = function () {
    return false;
};

open.onupgradeneeded = function () {
    var db = open.result;
    var store = db.createObjectStore("Cache", {keyPath: "id", autoIncrement: true});
    var index = store.createIndex("URL", "URL", {unique: true});
};

open.onsuccess = function () {


    getCache = function (callback, url) {
        var db = open.result;
        var tx = db.transaction("Cache", "readwrite");
        var store = tx.objectStore("Cache");
        var index = store.index("URL");

        var g = index.get(url);

        g.onsuccess = function () {
            if (g.result === undefined || g.result.TIME === undefined) {
                callback(false);
                return;
            } else {

                if (g.result.TIME > Math.floor(Date.now() / 1000) && (g.result.TIME - Math.floor(Date.now() / 1000)) < 82801) {
                    callback(g.result.DATA);
                    return;
                } else {
                    deleteCache(function () {
                    }, url);
                }
            }

            callback(false);
        };

        g.onerror = function () {
            callback(false);
        }

    };

    deleteCache = function (callback, url) {
        var db = open.result;
        var tx = db.transaction("Cache", "readwrite");
        var store = tx.objectStore("Cache");
        var index = store.index("URL");

        var g = index.get(url);

        g.onsuccess = function () {

            if (g.result !== undefined) {
                var d = store.delete(g.result.id);
                
                d.onsuccess = function () {
                    callback(true);
                };

                d.onerror = function () {
                    callback(true);
                }

            } else {
                callback(true);
            }

        };

        g.onerror = function () {
            callback(true);
        };


    };

    putCache = function (url, data) {
        deleteCache(function (e) {
            var db = open.result;
            var tx = db.transaction("Cache", "readwrite");
            var store = tx.objectStore("Cache");

            store.put({
                URL: url,
                DATA: data,
                TIME: (Math.floor(Date.now() / 1000) + 82800)
            });
        }, url);
    };
};