(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './has'], factory);
    }
})(function (require, exports) {
    "use strict";
    const has_1 = require('./has');
    function hasClass(feature, trueClass, falseClass) {
        return function (target) {
            return (has_1.default(feature) ? trueClass : falseClass);
        };
    }
    exports.hasClass = hasClass;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHNCQUFnQixPQUFPLENBQUMsQ0FBQTtJQUV4QixrQkFBeUIsT0FBZSxFQUFFLFNBQW1CLEVBQUUsVUFBb0I7UUFDbEYsTUFBTSxDQUFDLFVBQThCLE1BQVM7WUFDN0MsTUFBTSxDQUFPLENBQUMsYUFBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUM7SUFDSCxDQUFDO0lBSmUsZ0JBQVEsV0FJdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoYXMgZnJvbSAnLi9oYXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2xhc3MoZmVhdHVyZTogc3RyaW5nLCB0cnVlQ2xhc3M6IEZ1bmN0aW9uLCBmYWxzZUNsYXNzOiBGdW5jdGlvbik6IENsYXNzRGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uIDxUIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVCk6IFQge1xuXHRcdHJldHVybiA8YW55PiAoaGFzKGZlYXR1cmUpID8gdHJ1ZUNsYXNzIDogZmFsc2VDbGFzcyk7XG5cdH07XG59XG4iXX0=