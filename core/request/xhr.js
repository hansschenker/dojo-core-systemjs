(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../async/Task', './errors/RequestTimeoutError', '../global', '../has', '../util', './util'], factory);
    }
})(function (require, exports) {
    "use strict";
    const Task_1 = require('../async/Task');
    const RequestTimeoutError_1 = require('./errors/RequestTimeoutError');
    const global_1 = require('../global');
    const has_1 = require('../has');
    const util_1 = require('../util');
    const util_2 = require('./util');
    /**
     * A lookup table for valid `XMLHttpRequest#responseType` values.
     *
     * 'json' deliberately excluded since it is not supported in all environments, and as there is
     * already a filter for it in '../request'. Default '' and 'text' values also deliberately excluded.
     */
    const responseTypeMap = {
        arraybuffer: 'arraybuffer',
        // XHR2 environments that do not support `responseType=blob` still support `responseType=arraybuffer`,
        // which is a better way of handling blob data than as a string representation.
        blob: has_1.default('xhr2-blob') ? 'blob' : 'arraybuffer',
        document: 'document'
    };
    /* a noop handle for cancelled requests */
    const noop = function () { };
    /**
     * Converts a string to an array buffer
     * @param str The string to convert
     */
    function stringToArrayBuffer(str) {
        const buf = new ArrayBuffer(str.length * 2);
        const bufView = new Uint8Array(buf);
        for (let i = 0; i < str.length; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    ;
    function xhr(url, options = {}) {
        const request = new XMLHttpRequest();
        const requestUrl = util_2.generateRequestUrl(url, options);
        const response = {
            data: null,
            nativeResponse: request,
            requestOptions: options,
            statusCode: null,
            statusText: null,
            url: requestUrl,
            getHeader(name) {
                return request.getResponseHeader(name);
            }
        };
        let isAborted = false;
        function abort() {
            isAborted = true;
            if (request) {
                request.abort();
                request.onreadystatechange = noop;
            }
        }
        const promise = new Task_1.default(function (resolve, reject) {
            if (!options.method) {
                options.method = 'GET';
            }
            if ((!options.user || !options.password) && options.auth) {
                let auth = options.auth.split(':');
                options.user = decodeURIComponent(auth[0]);
                options.password = decodeURIComponent(auth[1]);
            }
            request.open(options.method, requestUrl, !options.blockMainThread, options.user, options.password);
            if (has_1.default('xhr2') && options.responseType in responseTypeMap) {
                request.responseType = responseTypeMap[options.responseType];
            }
            let timeoutHandle;
            request.onreadystatechange = function () {
                if (!isAborted && request.readyState === 4) {
                    request.onreadystatechange = noop;
                    timeoutHandle && timeoutHandle.destroy();
                    if (options.responseType === 'xml') {
                        response.data = request.responseXML;
                    }
                    else {
                        response.data = ('response' in request) ? request.response : request.responseText;
                        /* Android 4 has a defect where it doesn't respect the responseType
                         * See https://github.com/dojo/core/issues/125 */
                        if (options.responseType === 'arraybuffer' && typeof response.data === 'string' && has_1.default('arraybuffer')) {
                            response.data = stringToArrayBuffer(response.data);
                        }
                    }
                    response.statusCode = request.status;
                    response.statusText = request.statusText;
                    if (response.statusCode > 0 && response.statusCode < 400) {
                        resolve(response);
                    }
                    else {
                        reject(response.statusText ?
                            new Error(response.statusText) :
                            new Error('An error prevented completion of the request.'));
                    }
                }
            };
            if (options.timeout > 0 && options.timeout !== Infinity) {
                timeoutHandle = util_1.createTimer(function () {
                    // Reject first, since aborting will also fire onreadystatechange which would reject with a
                    // less specific error.  (This is also why we set up our own timeout rather than using
                    // native timeout and ontimeout, because that aborts and fires onreadystatechange before ontimeout.)
                    reject(new RequestTimeoutError_1.default('The XMLHttpRequest request timed out.'));
                    abort();
                }, options.timeout);
            }
            const headers = options.headers;
            let hasContentTypeHeader = false;
            for (let header in headers) {
                if (header.toLowerCase() === 'content-type') {
                    hasContentTypeHeader = true;
                }
                request.setRequestHeader(header, headers[header]);
            }
            if (!headers || !('X-Requested-With' in headers)) {
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
            if (!hasContentTypeHeader && has_1.default('formdata') && options.data instanceof global_1.default.FormData) {
                // Assume that most forms do not contain large binary files. If that is not the case,
                // then "multipart/form-data" should be manually specified as the "Content-Type" header.
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            if (options.responseType === 'xml' && request.overrideMimeType) {
                // This forces the XHR to parse the response as XML regardless of the MIME-type returned by the server
                request.overrideMimeType('text/xml');
            }
            request.send(options.data);
        }, function () {
            abort();
        });
        return promise;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = xhr;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcXVlc3QveGhyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHVCQUFpQixlQUFlLENBQUMsQ0FBQTtJQUNqQyxzQ0FBZ0MsOEJBQThCLENBQUMsQ0FBQTtJQUMvRCx5QkFBbUIsV0FBVyxDQUFDLENBQUE7SUFDL0Isc0JBQWdCLFFBQVEsQ0FBQyxDQUFBO0lBRXpCLHVCQUE0QixTQUFTLENBQUMsQ0FBQTtJQUV0Qyx1QkFBbUMsUUFBUSxDQUFDLENBQUE7SUFNNUM7Ozs7O09BS0c7SUFDSCxNQUFNLGVBQWUsR0FBK0I7UUFDbkQsV0FBVyxFQUFFLGFBQWE7UUFDMUIsc0dBQXNHO1FBQ3RHLCtFQUErRTtRQUMvRSxJQUFJLEVBQUUsYUFBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxhQUFhO1FBQy9DLFFBQVEsRUFBRSxVQUFVO0tBQ3BCLENBQUM7SUFFRiwwQ0FBMEM7SUFDMUMsTUFBTSxJQUFJLEdBQUcsY0FBYSxDQUFDLENBQUM7SUFFNUI7OztPQUdHO0lBQ0gsNkJBQTZCLEdBQVc7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFBQSxDQUFDO0lBRUYsYUFBK0IsR0FBVyxFQUFFLE9BQU8s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QUFDLENBQUM7UUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFuSEQ7eUJBbUhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFzayBmcm9tICcuLi9hc3luYy9UYXNrJztcbmltcG9ydCBSZXF1ZXN0VGltZW91dEVycm9yIGZyb20gJy4vZXJyb3JzL1JlcXVlc3RUaW1lb3V0RXJyb3InO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuLi9oYXMnO1xuaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBjcmVhdGVUaW1lciB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgUmVxdWVzdE9wdGlvbnMsIFJlc3BvbnNlLCBSZXNwb25zZVByb21pc2UgfSBmcm9tICcuLi9yZXF1ZXN0JztcbmltcG9ydCB7IGdlbmVyYXRlUmVxdWVzdFVybCB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgWGhyUmVxdWVzdE9wdGlvbnMgZXh0ZW5kcyBSZXF1ZXN0T3B0aW9ucyB7XG5cdGJsb2NrTWFpblRocmVhZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBsb29rdXAgdGFibGUgZm9yIHZhbGlkIGBYTUxIdHRwUmVxdWVzdCNyZXNwb25zZVR5cGVgIHZhbHVlcy5cbiAqXG4gKiAnanNvbicgZGVsaWJlcmF0ZWx5IGV4Y2x1ZGVkIHNpbmNlIGl0IGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWxsIGVudmlyb25tZW50cywgYW5kIGFzIHRoZXJlIGlzXG4gKiBhbHJlYWR5IGEgZmlsdGVyIGZvciBpdCBpbiAnLi4vcmVxdWVzdCcuIERlZmF1bHQgJycgYW5kICd0ZXh0JyB2YWx1ZXMgYWxzbyBkZWxpYmVyYXRlbHkgZXhjbHVkZWQuXG4gKi9cbmNvbnN0IHJlc3BvbnNlVHlwZU1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH0gPSB7XG5cdGFycmF5YnVmZmVyOiAnYXJyYXlidWZmZXInLFxuXHQvLyBYSFIyIGVudmlyb25tZW50cyB0aGF0IGRvIG5vdCBzdXBwb3J0IGByZXNwb25zZVR5cGU9YmxvYmAgc3RpbGwgc3VwcG9ydCBgcmVzcG9uc2VUeXBlPWFycmF5YnVmZmVyYCxcblx0Ly8gd2hpY2ggaXMgYSBiZXR0ZXIgd2F5IG9mIGhhbmRsaW5nIGJsb2IgZGF0YSB0aGFuIGFzIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuXHRibG9iOiBoYXMoJ3hocjItYmxvYicpID8gJ2Jsb2InIDogJ2FycmF5YnVmZmVyJyxcblx0ZG9jdW1lbnQ6ICdkb2N1bWVudCdcbn07XG5cbi8qIGEgbm9vcCBoYW5kbGUgZm9yIGNhbmNlbGxlZCByZXF1ZXN0cyAqL1xuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkgeyB9O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIHRvIGFuIGFycmF5IGJ1ZmZlclxuICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIHRvIGNvbnZlcnRcbiAqL1xuZnVuY3Rpb24gc3RyaW5nVG9BcnJheUJ1ZmZlcihzdHI6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcblx0Y29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGggKiAyKTtcblx0Y29uc3QgYnVmVmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG5cdFx0YnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuXHR9XG5cdHJldHVybiBidWY7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB4aHI8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFhoclJlcXVlc3RPcHRpb25zID0ge30pOiBSZXNwb25zZVByb21pc2U8VD4ge1xuXHRjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdGNvbnN0IHJlcXVlc3RVcmwgPSBnZW5lcmF0ZVJlcXVlc3RVcmwodXJsLCBvcHRpb25zKTtcblx0Y29uc3QgcmVzcG9uc2U6IFJlc3BvbnNlPFQ+ID0ge1xuXHRcdGRhdGE6IG51bGwsXG5cdFx0bmF0aXZlUmVzcG9uc2U6IHJlcXVlc3QsXG5cdFx0cmVxdWVzdE9wdGlvbnM6IG9wdGlvbnMsXG5cdFx0c3RhdHVzQ29kZTogbnVsbCxcblx0XHRzdGF0dXNUZXh0OiBudWxsLFxuXHRcdHVybDogcmVxdWVzdFVybCxcblxuXHRcdGdldEhlYWRlcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuIHJlcXVlc3QuZ2V0UmVzcG9uc2VIZWFkZXIobmFtZSk7XG5cdFx0fVxuXHR9O1xuXHRsZXQgaXNBYm9ydGVkID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gYWJvcnQoKSB7XG5cdFx0aXNBYm9ydGVkID0gdHJ1ZTtcblx0XHRpZiAocmVxdWVzdCkge1xuXHRcdFx0cmVxdWVzdC5hYm9ydCgpO1xuXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHByb21pc2UgPSBuZXcgVGFzazxSZXNwb25zZTxUPj4oZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCk6IHZvaWQge1xuXHRcdGlmICghb3B0aW9ucy5tZXRob2QpIHtcblx0XHRcdG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG5cdFx0fVxuXG5cdFx0aWYgKCghb3B0aW9ucy51c2VyIHx8ICFvcHRpb25zLnBhc3N3b3JkKSAmJiBvcHRpb25zLmF1dGgpIHtcblx0XHRcdGxldCBhdXRoID0gb3B0aW9ucy5hdXRoLnNwbGl0KCc6Jyk7XG5cdFx0XHRvcHRpb25zLnVzZXIgPSBkZWNvZGVVUklDb21wb25lbnQoYXV0aFswXSk7XG5cdFx0XHRvcHRpb25zLnBhc3N3b3JkID0gZGVjb2RlVVJJQ29tcG9uZW50KGF1dGhbMV0pO1xuXHRcdH1cblxuXHRcdHJlcXVlc3Qub3BlbihvcHRpb25zLm1ldGhvZCwgcmVxdWVzdFVybCwgIW9wdGlvbnMuYmxvY2tNYWluVGhyZWFkLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xuXG5cdFx0aWYgKGhhcygneGhyMicpICYmIG9wdGlvbnMucmVzcG9uc2VUeXBlIGluIHJlc3BvbnNlVHlwZU1hcCkge1xuXHRcdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGVNYXBbb3B0aW9ucy5yZXNwb25zZVR5cGVdO1xuXHRcdH1cblxuXHRcdGxldCB0aW1lb3V0SGFuZGxlOiBIYW5kbGU7XG5cdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG5cdFx0XHRpZiAoIWlzQWJvcnRlZCAmJiByZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wO1xuXHRcdFx0XHR0aW1lb3V0SGFuZGxlICYmIHRpbWVvdXRIYW5kbGUuZGVzdHJveSgpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ3htbCcpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhID0gcmVxdWVzdC5yZXNwb25zZVhNTDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhID0gKCdyZXNwb25zZScgaW4gcmVxdWVzdCkgPyByZXF1ZXN0LnJlc3BvbnNlIDogcmVxdWVzdC5yZXNwb25zZVRleHQ7XG5cdFx0XHRcdFx0LyogQW5kcm9pZCA0IGhhcyBhIGRlZmVjdCB3aGVyZSBpdCBkb2Vzbid0IHJlc3BlY3QgdGhlIHJlc3BvbnNlVHlwZVxuXHRcdFx0XHRcdCAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG9qby9jb3JlL2lzc3Vlcy8xMjUgKi9cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5yZXNwb25zZVR5cGUgPT09ICdhcnJheWJ1ZmZlcicgJiYgdHlwZW9mIHJlc3BvbnNlLmRhdGEgPT09ICdzdHJpbmcnICYmIGhhcygnYXJyYXlidWZmZXInKSkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UuZGF0YSA9IDxhbnk+IHN0cmluZ1RvQXJyYXlCdWZmZXIoKDxhbnk+IHJlc3BvbnNlKS5kYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNwb25zZS5zdGF0dXNDb2RlID0gcmVxdWVzdC5zdGF0dXM7XG5cdFx0XHRcdHJlc3BvbnNlLnN0YXR1c1RleHQgPSByZXF1ZXN0LnN0YXR1c1RleHQ7XG5cdFx0XHRcdGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID4gMCAmJiByZXNwb25zZS5zdGF0dXNDb2RlIDwgNDAwKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlLnN0YXR1c1RleHQgP1xuXHRcdFx0XHRcdFx0bmV3IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpIDpcblx0XHRcdFx0XHRcdG5ldyBFcnJvcignQW4gZXJyb3IgcHJldmVudGVkIGNvbXBsZXRpb24gb2YgdGhlIHJlcXVlc3QuJylcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChvcHRpb25zLnRpbWVvdXQgPiAwICYmIG9wdGlvbnMudGltZW91dCAhPT0gSW5maW5pdHkpIHtcblx0XHRcdHRpbWVvdXRIYW5kbGUgPSBjcmVhdGVUaW1lcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdC8vIFJlamVjdCBmaXJzdCwgc2luY2UgYWJvcnRpbmcgd2lsbCBhbHNvIGZpcmUgb25yZWFkeXN0YXRlY2hhbmdlIHdoaWNoIHdvdWxkIHJlamVjdCB3aXRoIGFcblx0XHRcdFx0Ly8gbGVzcyBzcGVjaWZpYyBlcnJvci4gIChUaGlzIGlzIGFsc28gd2h5IHdlIHNldCB1cCBvdXIgb3duIHRpbWVvdXQgcmF0aGVyIHRoYW4gdXNpbmdcblx0XHRcdFx0Ly8gbmF0aXZlIHRpbWVvdXQgYW5kIG9udGltZW91dCwgYmVjYXVzZSB0aGF0IGFib3J0cyBhbmQgZmlyZXMgb25yZWFkeXN0YXRlY2hhbmdlIGJlZm9yZSBvbnRpbWVvdXQuKVxuXHRcdFx0XHRyZWplY3QobmV3IFJlcXVlc3RUaW1lb3V0RXJyb3IoJ1RoZSBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0IHRpbWVkIG91dC4nKSk7XG5cdFx0XHRcdGFib3J0KCk7XG5cdFx0XHR9LCBvcHRpb25zLnRpbWVvdXQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG5cdFx0bGV0IGhhc0NvbnRlbnRUeXBlSGVhZGVyOiBib29sZWFuID0gZmFsc2U7XG5cdFx0Zm9yIChsZXQgaGVhZGVyIGluIGhlYWRlcnMpIHtcblx0XHRcdGlmIChoZWFkZXIudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcblx0XHRcdFx0aGFzQ29udGVudFR5cGVIZWFkZXIgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuXHRcdH1cblxuXHRcdGlmICghaGVhZGVycyB8fCAhKCdYLVJlcXVlc3RlZC1XaXRoJyBpbiBoZWFkZXJzKSkge1xuXHRcdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKCFoYXNDb250ZW50VHlwZUhlYWRlciAmJiBoYXMoJ2Zvcm1kYXRhJykgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSB7XG5cdFx0XHQvLyBBc3N1bWUgdGhhdCBtb3N0IGZvcm1zIGRvIG5vdCBjb250YWluIGxhcmdlIGJpbmFyeSBmaWxlcy4gSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsXG5cdFx0XHQvLyB0aGVuIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIHNob3VsZCBiZSBtYW51YWxseSBzcGVjaWZpZWQgYXMgdGhlIFwiQ29udGVudC1UeXBlXCIgaGVhZGVyLlxuXHRcdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAneG1sJyAmJiByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUpIHtcblx0XHRcdC8vIFRoaXMgZm9yY2VzIHRoZSBYSFIgdG8gcGFyc2UgdGhlIHJlc3BvbnNlIGFzIFhNTCByZWdhcmRsZXNzIG9mIHRoZSBNSU1FLXR5cGUgcmV0dXJuZWQgYnkgdGhlIHNlcnZlclxuXHRcdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L3htbCcpO1xuXHRcdH1cblxuXHRcdHJlcXVlc3Quc2VuZChvcHRpb25zLmRhdGEpO1xuXHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0YWJvcnQoKTtcblx0fSk7XG5cblx0cmV0dXJuIHByb21pc2U7XG59XG4iXX0=