(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './has', './request', './Promise'], factory);
    }
})(function (require, exports) {
    "use strict";
    const has_1 = require('./has');
    const request_1 = require('./request');
    const Promise_1 = require('./Promise');
    /*
     * Strips <?xml ...?> declarations so that external SVG and XML
     * documents can be added to a document without worry. Also, if the string
     * is an HTML document, only the part inside the body tag is returned.
     */
    function strip(text) {
        if (!text) {
            return '';
        }
        text = text.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, '');
        let matches = text.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
        text = matches ? matches[1] : text;
        return text;
    }
    /*
     * Host-specific method to retrieve text
     */
    let getText;
    if (has_1.default('host-browser')) {
        getText = function (url, callback) {
            request_1.default(url).then(function (response) {
                callback(response.data);
            });
        };
    }
    else if (has_1.default('host-node')) {
        let fs = require.nodeRequire ? require.nodeRequire('fs') : require('fs');
        getText = function (url, callback) {
            fs.readFile(url, { encoding: 'utf8' }, function (error, data) {
                if (error) {
                    throw error;
                }
                callback(data);
            });
        };
    }
    else {
        getText = function () {
            throw new Error('dojo/text not supported on this platform');
        };
    }
    /*
     * Cache of previously-loaded text resources
     */
    let textCache = {};
    /*
     * Cache of pending text resources
     */
    let pending = {};
    function get(url) {
        let promise = new Promise_1.default(function (resolve, reject) {
            getText(url, function (text) {
                resolve(text);
            });
        });
        return promise;
    }
    exports.get = get;
    function normalize(id, toAbsMid) {
        let parts = id.split('!');
        let url = parts[0];
        return (/^\./.test(url) ? toAbsMid(url) : url) + (parts[1] ? '!' + parts[1] : '');
    }
    exports.normalize = normalize;
    function load(id, require, load, config) {
        let parts = id.split('!');
        let stripFlag = parts.length > 1;
        let mid = parts[0];
        let url = require.toUrl(mid);
        let text;
        function finish(text) {
            load(stripFlag ? strip(text) : text);
        }
        if (mid in textCache) {
            text = textCache[mid];
        }
        else if (url in textCache) {
            text = textCache[url];
        }
        if (!text) {
            if (pending[url]) {
                pending[url].push(finish);
            }
            else {
                let pendingList = pending[url] = [finish];
                getText(url, function (value) {
                    textCache[mid] = textCache[url] = value;
                    for (let i = 0; i < pendingList.length;) {
                        pendingList[i++](value);
                    }
                    delete pending[url];
                });
            }
        }
        else {
            finish(text);
        }
    }
    exports.load = load;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHNCQUFnQixPQUFPLENBQUMsQ0FBQTtJQUN4QiwwQkFBa0MsV0FBVyxDQUFDLENBQUE7SUFDOUMsMEJBQW9CLFdBQVcsQ0FBQyxDQUFBO0lBRWhDOzs7O09BSUc7SUFDSCxlQUFlLElBQVk7UUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQywwREFBMEQsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDakUsSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5DLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLE9BQWlFLENBQUM7SUFFdEUsRUFBRSxDQUFDLENBQUMsYUFBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPLEdBQUcsVUFBUyxHQUFXLEVBQUUsUUFBaUM7WUFDaEUsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxRQUEwQjtnQkFDcEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztJQUNILENBQUM7SUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLEVBQUUsR0FBVSxPQUFRLENBQUMsV0FBVyxHQUFVLE9BQVEsQ0FBQyxX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QUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxVQUFTLEtBQWE7b0JBQ2xDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUN4QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUksQ0FBQzt3QkFDMUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLENBQUM7b0JBQ0QsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztRQUNGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUM7SUFDRixDQUFDO0lBbENlLFlBQUksT0FrQ25CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcbmltcG9ydCByZXF1ZXN0LCB7IFJlc3BvbnNlIH0gZnJvbSAnLi9yZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4vUHJvbWlzZSc7XG5cbi8qXG4gKiBTdHJpcHMgPD94bWwgLi4uPz4gZGVjbGFyYXRpb25zIHNvIHRoYXQgZXh0ZXJuYWwgU1ZHIGFuZCBYTUxcbiAqIGRvY3VtZW50cyBjYW4gYmUgYWRkZWQgdG8gYSBkb2N1bWVudCB3aXRob3V0IHdvcnJ5LiBBbHNvLCBpZiB0aGUgc3RyaW5nXG4gKiBpcyBhbiBIVE1MIGRvY3VtZW50LCBvbmx5IHRoZSBwYXJ0IGluc2lkZSB0aGUgYm9keSB0YWcgaXMgcmV0dXJuZWQuXG4gKi9cbmZ1bmN0aW9uIHN0cmlwKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmICghdGV4dCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqPFxcP3htbChcXHMpK3ZlcnNpb249W1xcJ1xcXCJdKFxcZCkqLihcXGQpKltcXCdcXFwiXShcXHMpKlxcPz4vaW0sICcnKTtcblx0bGV0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC88Ym9keVtePl0qPlxccyooW1xcc1xcU10rKVxccyo8XFwvYm9keT4vaW0pO1xuXHR0ZXh0ID0gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiB0ZXh0O1xuXG5cdHJldHVybiB0ZXh0O1xufVxuXG4vKlxuICogSG9zdC1zcGVjaWZpYyBtZXRob2QgdG8gcmV0cmlldmUgdGV4dFxuICovXG5sZXQgZ2V0VGV4dDogKHVybDogc3RyaW5nLCBjYWxsYmFjazogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQpID0+IHZvaWQ7XG5cbmlmIChoYXMoJ2hvc3QtYnJvd3NlcicpKSB7XG5cdGdldFRleHQgPSBmdW5jdGlvbih1cmw6IHN0cmluZywgY2FsbGJhY2s6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG5cdFx0cmVxdWVzdCh1cmwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2U6IFJlc3BvbnNlPHN0cmluZz4pIHtcblx0XHRcdGNhbGxiYWNrKHJlc3BvbnNlLmRhdGEpO1xuXHRcdH0pO1xuXHR9O1xufVxuZWxzZSBpZiAoaGFzKCdob3N0LW5vZGUnKSkge1xuXHRsZXQgZnMgPSAoPGFueT4gcmVxdWlyZSkubm9kZVJlcXVpcmUgPyAoPGFueT4gcmVxdWlyZSkubm9kZVJlcXVpcmUoJ2ZzJykgOiByZXF1aXJlKCdmcycpO1xuXHRnZXRUZXh0ID0gZnVuY3Rpb24odXJsOiBzdHJpbmcsIGNhbGxiYWNrOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuXHRcdGZzLnJlYWRGaWxlKHVybCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0sIGZ1bmN0aW9uKGVycm9yOiBFcnJvciwgZGF0YTogc3RyaW5nKTogdm9pZCB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cblx0XHRcdGNhbGxiYWNrKGRhdGEpO1xuXHRcdH0pO1xuXHR9O1xufVxuZWxzZSB7XG5cdGdldFRleHQgPSBmdW5jdGlvbigpOiB2b2lkIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Rvam8vdGV4dCBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgcGxhdGZvcm0nKTtcblx0fTtcbn1cblxuLypcbiAqIENhY2hlIG9mIHByZXZpb3VzbHktbG9hZGVkIHRleHQgcmVzb3VyY2VzXG4gKi9cbmxldCB0ZXh0Q2FjaGU6IHsgW2tleTogc3RyaW5nXTogYW55OyB9ID0ge307XG5cbi8qXG4gKiBDYWNoZSBvZiBwZW5kaW5nIHRleHQgcmVzb3VyY2VzXG4gKi9cbmxldCBwZW5kaW5nOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHVybDogc3RyaW5nKTogUHJvbWlzZSA8c3RyaW5nPiB7XG5cdGxldCBwcm9taXNlID0gbmV3IFByb21pc2UgPHN0cmluZz4gKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRnZXRUZXh0KHVybCwgZnVuY3Rpb24gKHRleHQpIHtcblx0XHRcdHJlc29sdmUodGV4dCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHJldHVybiBwcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKGlkOiBzdHJpbmcsIHRvQWJzTWlkOiAobW9kdWxlSWQ6IHN0cmluZykgPT4gc3RyaW5nKTogc3RyaW5nIHtcblx0bGV0IHBhcnRzID0gaWQuc3BsaXQoJyEnKTtcblx0bGV0IHVybCA9IHBhcnRzWzBdO1xuXG5cdHJldHVybiAoL15cXC4vLnRlc3QodXJsKSA/IHRvQWJzTWlkKHVybCkgOiB1cmwpICsgKHBhcnRzWzFdID8gJyEnICsgcGFydHNbMV0gOiAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKGlkOiBzdHJpbmcsIHJlcXVpcmU6IERvam9Mb2FkZXIuUmVxdWlyZSwgbG9hZDogKHZhbHVlPzogYW55KSA9PiB2b2lkLCBjb25maWc/OiBEb2pvTG9hZGVyLkNvbmZpZyk6IHZvaWQge1xuXHRsZXQgcGFydHMgPSBpZC5zcGxpdCgnIScpO1xuXHRsZXQgc3RyaXBGbGFnID0gcGFydHMubGVuZ3RoID4gMTtcblx0bGV0IG1pZCA9IHBhcnRzWzBdO1xuXHRsZXQgdXJsID0gcmVxdWlyZS50b1VybChtaWQpO1xuXHRsZXQgdGV4dDogc3RyaW5nO1xuXG5cdGZ1bmN0aW9uIGZpbmlzaCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcblx0XHRsb2FkKHN0cmlwRmxhZyA/IHN0cmlwKHRleHQpIDogdGV4dCk7XG5cdH1cblxuXHRpZiAobWlkIGluIHRleHRDYWNoZSkge1xuXHRcdHRleHQgPSB0ZXh0Q2FjaGVbbWlkXTtcblx0fVxuXHRlbHNlIGlmICh1cmwgaW4gdGV4dENhY2hlKSB7XG5cdFx0dGV4dCA9IHRleHRDYWNoZVt1cmxdO1xuXHR9XG5cblx0aWYgKCF0ZXh0KSB7XG5cdFx0aWYgKHBlbmRpbmdbdXJsXSkge1xuXHRcdFx0cGVuZGluZ1t1cmxdLnB1c2goZmluaXNoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IHBlbmRpbmdMaXN0ID0gcGVuZGluZ1t1cmxdID0gW2ZpbmlzaF07XG5cdFx0XHRnZXRUZXh0KHVybCwgZnVuY3Rpb24odmFsdWU6IHN0cmluZykge1xuXHRcdFx0XHR0ZXh0Q2FjaGVbbWlkXSA9IHRleHRDYWNoZVt1cmxdID0gdmFsdWU7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGVuZGluZ0xpc3QubGVuZ3RoOyApIHtcblx0XHRcdFx0XHRwZW5kaW5nTGlzdFtpKytdKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgcGVuZGluZ1t1cmxdO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZpbmlzaCh0ZXh0KTtcblx0fVxufVxuIl19