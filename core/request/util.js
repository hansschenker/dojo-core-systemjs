(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../UrlSearchParams'], factory);
    }
})(function (require, exports) {
    "use strict";
    const UrlSearchParams_1 = require('../UrlSearchParams');
    /**
     * Returns a URL formatted with optional query string and cache-busting segments.
     *
     * @param url The base URL.
     * @param options The options hash that is used to generate the query string.
     */
    function generateRequestUrl(url, options) {
        let query = new UrlSearchParams_1.default(options.query).toString();
        if (options.cacheBust) {
            const cacheBust = String(Date.now());
            query += query ? '&' + cacheBust : cacheBust;
        }
        const separator = url.indexOf('?') > -1 ? '&' : '?';
        return query ? url + separator + query : url;
    }
    exports.generateRequestUrl = generateRequestUrl;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXF1ZXN0L3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBQ0Esa0NBQTRCLG9CQUFvQixDQUFDLENBQUE7SUFFakQ7Ozs7O09BS0c7SUFDSCw0QkFBbUMsR0FBVyxFQUFFLE9BQXVCO1FBQ3RFLElBQUksS0FBSyxHQUFHLElBQUkseUJBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFMUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEtBQUssSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDOUMsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRCxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUM5QyxDQUFDO0lBVmUsMEJBQWtCLHFCQVVqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICcuLi9yZXF1ZXN0JztcbmltcG9ydCBVcmxTZWFyY2hQYXJhbXMgZnJvbSAnLi4vVXJsU2VhcmNoUGFyYW1zJztcblxuLyoqXG4gKiBSZXR1cm5zIGEgVVJMIGZvcm1hdHRlZCB3aXRoIG9wdGlvbmFsIHF1ZXJ5IHN0cmluZyBhbmQgY2FjaGUtYnVzdGluZyBzZWdtZW50cy5cbiAqXG4gKiBAcGFyYW0gdXJsIFRoZSBiYXNlIFVSTC5cbiAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIGhhc2ggdGhhdCBpcyB1c2VkIHRvIGdlbmVyYXRlIHRoZSBxdWVyeSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVJlcXVlc3RVcmwodXJsOiBzdHJpbmcsIG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zKTogc3RyaW5nIHtcblx0bGV0IHF1ZXJ5ID0gbmV3IFVybFNlYXJjaFBhcmFtcyhvcHRpb25zLnF1ZXJ5KS50b1N0cmluZygpO1xuXG5cdGlmIChvcHRpb25zLmNhY2hlQnVzdCkge1xuXHRcdGNvbnN0IGNhY2hlQnVzdCA9IFN0cmluZyhEYXRlLm5vdygpKTtcblx0XHRxdWVyeSArPSBxdWVyeSA/ICcmJyArIGNhY2hlQnVzdCA6IGNhY2hlQnVzdDtcblx0fVxuXG5cdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCc/JykgPiAtMSA/ICcmJyA6ICc/Jztcblx0cmV0dXJuIHF1ZXJ5ID8gdXJsICsgc2VwYXJhdG9yICsgcXVlcnkgOiB1cmw7XG59XG4iXX0=