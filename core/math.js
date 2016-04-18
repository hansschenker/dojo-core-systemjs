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
    const FRACTION_UNITS = Math.pow(2, 23);
    const MAX_FLOAT32 = 3.4028234663852886e+38;
    const MIN_FLOAT32 = 1.401298464324817e-45;
    /**
     * Returns the hyperbolic arccosine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function acosh(n) {
        return Math.log(n + Math.sqrt(n * n - 1));
    }
    exports.acosh = acosh;
    /**
     * Returns the hyperbolic arcsine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function asinh(n) {
        if (n === -Infinity) {
            return n;
        }
        else {
            return Math.log(n + Math.sqrt(n * n + 1));
        }
    }
    exports.asinh = asinh;
    /**
     * Returns the hyperbolic arctangent of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function atanh(n) {
        return Math.log((1 + n) / (1 - n)) / 2;
    }
    exports.atanh = atanh;
    /**
     * Returns the cube root of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function cbrt(n) {
        const y = Math.pow(Math.abs(n), 1 / 3);
        return n < 0 ? -y : y;
    }
    exports.cbrt = cbrt;
    /**
     * Returns the number of leading zero bits in the 32-bit
     * binary representation of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function clz32(n) {
        n = Number(n) >>> 0;
        return n ? 32 - n.toString(2).length : 32;
    }
    exports.clz32 = clz32;
    /**
     * Returns the hyperbolic cosine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function cosh(n) {
        const m = Math.exp(n);
        return (m + 1 / m) / 2;
    }
    exports.cosh = cosh;
    /**
     * Returns e raised to the specified power minus one.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function expm1(n) {
        return Math.exp(n) - 1;
    }
    exports.expm1 = expm1;
    /**
     * Returns the nearest single-precision float representation of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.fround = has_1.default('float32array') ? function (n) {
        return new Float32Array([n])[0];
    } :
        function (n) {
            // Further fallback for IE9, which doesn't support Float32Array.
            // This gives a fair approximation in most cases.
            if (n === 0 || !isFinite(n)) {
                return n;
            }
            if (Math.abs(n) > MAX_FLOAT32) {
                return n > 0 ? Infinity : -Infinity;
            }
            if (Math.abs(n) < MIN_FLOAT32) {
                return 0;
            }
            const exponent = Math.floor(log2(Math.abs(n)));
            return (Math.round((n / Math.pow(2, exponent) - 1) * FRACTION_UNITS) / FRACTION_UNITS + 1) * Math.pow(2, exponent);
        };
    /**
     * Returns the square root of the sum of squares of its arguments.
     *
     * @return The result
     */
    function hypot(...args) {
        // See: http://mzl.la/1HDi6xP
        let n = 0;
        for (let arg of args) {
            if (arg === Infinity || arg === -Infinity) {
                return Infinity;
            }
            n += arg * arg;
        }
        return Math.sqrt(n);
    }
    exports.hypot = hypot;
    /**
     * Returns the result of the 32-bit multiplication of the two parameters.
     *
     * @param n The number to use in calculation
     * @param m The number to use in calculation
     * @return The result
     */
    function imul(n, m) {
        // See: http://mzl.la/1K279FK
        const ah = (n >>> 16) & 0xffff;
        const al = n & 0xffff;
        const bh = (m >>> 16) & 0xffff;
        const bl = m & 0xffff;
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
    }
    exports.imul = imul;
    /**
     * Returns the base 2 logarithm of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function log2(n) {
        return Math.log(n) / Math.LN2;
    }
    exports.log2 = log2;
    /**
     * Returns the base 10 logarithm of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function log10(n) {
        return Math.log(n) / Math.LN10;
    }
    exports.log10 = log10;
    /**
     * Returns the natural logarithm of 1 + a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function log1p(n) {
        return Math.log(1 + n);
    }
    exports.log1p = log1p;
    /**
     * Returns the sign of a number, indicating whether the number is positive.
     *
     * @param n The number to use in calculation
     * @return 1 if the number is positive, -1 if the number is negative, or 0 if the number is 0
     */
    function sign(n) {
        n = Number(n);
        if (n === 0 || n !== n) {
            return n;
        }
        return n > 0 ? 1 : -1;
    }
    exports.sign = sign;
    /**
     * Returns the hyperbolic sine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function sinh(n) {
        const m = Math.exp(n);
        return (m - 1 / m) / 2;
    }
    exports.sinh = sinh;
    /**
     * Returns the hyperbolic tangent of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function tanh(n) {
        if (n === Infinity) {
            return 1;
        }
        else if (n === -Infinity) {
            return -1;
        }
        else {
            const y = Math.exp(2 * n);
            return (y - 1) / (y + 1);
        }
    }
    exports.tanh = tanh;
    /**
     * Returns the integral part of a number by removing any fractional digits.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    function trunc(n) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    }
    exports.trunc = trunc;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHNCQUFnQixPQUFPLENBQUMsQ0FBQTtJQUV4QixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QyxNQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQztJQUUxQzs7Ozs7T0FLRztJQUNILGVBQXNCLENBQVM7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFGZSxhQUFLLFFBRXBCLENBQUE7SUFFRDs7Ozs7T0FLRztJQUNILGVBQXNCLENBQVM7UUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDRixDQUFDO0lBUGUsYUFBSyxRQU9wQixDQUFBO0lBRUQ7Ozs7O09BS0c7SUFDSCxlQUFzQixDQUFTO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFGZSxhQUFLLFFBRXBCLENBQUE7SUFF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QUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDRixDQUFDO0lBWGUsWUFBSSxPQVduQixDQUFBO0lBRUQ7Ozs7O09BS0c7SUFDSCxlQUFzQixDQUFTO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRmUsYUFBSyxRQUVwQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGhhcyBmcm9tICcuL2hhcyc7XG5cbmNvbnN0IEZSQUNUSU9OX1VOSVRTID0gTWF0aC5wb3coMiwgMjMpO1xuY29uc3QgTUFYX0ZMT0FUMzIgPSAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4O1xuY29uc3QgTUlOX0ZMT0FUMzIgPSAxLjQwMTI5ODQ2NDMyNDgxN2UtNDU7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaHlwZXJib2xpYyBhcmNjb3NpbmUgb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWNvc2gobjogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgubG9nKG4gKyBNYXRoLnNxcnQobiAqIG4gLSAxKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaHlwZXJib2xpYyBhcmNzaW5lIG9mIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSBuIFRoZSBudW1iZXIgdG8gdXNlIGluIGNhbGN1bGF0aW9uXG4gKiBAcmV0dXJuIFRoZSByZXN1bHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzaW5oKG46IG51bWJlcik6IG51bWJlciB7XG5cdGlmIChuID09PSAtSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gbjtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gTWF0aC5sb2cobiArIE1hdGguc3FydChuICogbiArIDEpKTtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGh5cGVyYm9saWMgYXJjdGFuZ2VudCBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdGFuaChuOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2coKDEgKyBuKSAvICgxIC0gbikpIC8gMjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdWJlIHJvb3Qgb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2JydChuOiBudW1iZXIpOiBudW1iZXIge1xuXHRjb25zdCB5ID0gTWF0aC5wb3coTWF0aC5hYnMobiksIDEgLyAzKTtcblx0cmV0dXJuIG4gPCAwID8gLXkgOiB5O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm8gYml0cyBpbiB0aGUgMzItYml0XG4gKiBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2x6MzIobjogbnVtYmVyKTogbnVtYmVyIHtcblx0biA9IE51bWJlcihuKSA+Pj4gMDtcblx0cmV0dXJuIG4gPyAzMiAtIG4udG9TdHJpbmcoMikubGVuZ3RoIDogMzI7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29zaChuOiBudW1iZXIpOiBudW1iZXIge1xuXHRjb25zdCBtID0gTWF0aC5leHAobik7XG5cdHJldHVybiAobSArIDEgLyBtKSAvIDI7XG59XG5cbi8qKlxuICogUmV0dXJucyBlIHJhaXNlZCB0byB0aGUgc3BlY2lmaWVkIHBvd2VyIG1pbnVzIG9uZS5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBtMShuOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5leHAobikgLSAxO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG5lYXJlc3Qgc2luZ2xlLXByZWNpc2lvbiBmbG9hdCByZXByZXNlbnRhdGlvbiBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBjb25zdCBmcm91bmQ6IChuOiBudW1iZXIpID0+IG51bWJlciA9IGhhcygnZmxvYXQzMmFycmF5JykgPyBmdW5jdGlvbiAobjogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW25dKVswXTtcbn0gOlxuZnVuY3Rpb24gKG46IG51bWJlcik6IG51bWJlciB7XG5cdC8vIEZ1cnRoZXIgZmFsbGJhY2sgZm9yIElFOSwgd2hpY2ggZG9lc24ndCBzdXBwb3J0IEZsb2F0MzJBcnJheS5cblx0Ly8gVGhpcyBnaXZlcyBhIGZhaXIgYXBwcm94aW1hdGlvbiBpbiBtb3N0IGNhc2VzLlxuXG5cdGlmIChuID09PSAwIHx8ICFpc0Zpbml0ZShuKSkge1xuXHRcdHJldHVybiBuO1xuXHR9XG5cdGlmIChNYXRoLmFicyhuKSA+IE1BWF9GTE9BVDMyKSB7XG5cdFx0cmV0dXJuIG4gPiAwID8gSW5maW5pdHkgOiAtSW5maW5pdHk7XG5cdH1cblx0aWYgKE1hdGguYWJzKG4pIDwgTUlOX0ZMT0FUMzIpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXHRjb25zdCBleHBvbmVudCA9IE1hdGguZmxvb3IobG9nMihNYXRoLmFicyhuKSkpO1xuXHRyZXR1cm4gKE1hdGgucm91bmQoKG4gLyBNYXRoLnBvdygyLCBleHBvbmVudCkgLSAxKSAqIEZSQUNUSU9OX1VOSVRTKSAvIEZSQUNUSU9OX1VOSVRTICsgMSkgKiBNYXRoLnBvdygyLCBleHBvbmVudCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzdW0gb2Ygc3F1YXJlcyBvZiBpdHMgYXJndW1lbnRzLlxuICpcbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaHlwb3QoLi4uYXJnczogbnVtYmVyW10pOiBudW1iZXIge1xuXHQvLyBTZWU6IGh0dHA6Ly9temwubGEvMUhEaTZ4UFxuXHRsZXQgbiA9IDA7XG5cblx0Zm9yIChsZXQgYXJnIG9mIGFyZ3MpIHtcblx0XHRpZiAoYXJnID09PSBJbmZpbml0eSB8fCBhcmcgPT09IC1JbmZpbml0eSkge1xuXHRcdFx0cmV0dXJuIEluZmluaXR5O1xuXHRcdH1cblx0XHRuICs9IGFyZyAqIGFyZztcblx0fVxuXHRyZXR1cm4gTWF0aC5zcXJ0KG4pO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgMzItYml0IG11bHRpcGxpY2F0aW9uIG9mIHRoZSB0d28gcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHBhcmFtIG0gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW11bChuOiBudW1iZXIsIG06IG51bWJlcik6IG51bWJlciB7XG5cdC8vIFNlZTogaHR0cDovL216bC5sYS8xSzI3OUZLXG5cdGNvbnN0IGFoID0gKG4gPj4+IDE2KSAmIDB4ZmZmZjtcblx0Y29uc3QgYWwgPSBuICYgMHhmZmZmO1xuXHRjb25zdCBiaCA9IChtID4+PiAxNikgJiAweGZmZmY7XG5cdGNvbnN0IGJsID0gbSAmIDB4ZmZmZjtcblx0cmV0dXJuICgoYWwgKiBibCkgKyAoKChhaCAqIGJsICsgYWwgKiBiaCkgPDwgMTYpID4+PiAwKSB8IDApO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nMihuOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2cobikgLyBNYXRoLkxOMjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIDEwIGxvZ2FyaXRobSBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2cxMChuOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5sb2cobikgLyBNYXRoLkxOMTA7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgMSArIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSBuIFRoZSBudW1iZXIgdG8gdXNlIGluIGNhbGN1bGF0aW9uXG4gKiBAcmV0dXJuIFRoZSByZXN1bHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZzFwKG46IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmxvZygxICsgbik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc2lnbiBvZiBhIG51bWJlciwgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBudW1iZXIgaXMgcG9zaXRpdmUuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gMSBpZiB0aGUgbnVtYmVyIGlzIHBvc2l0aXZlLCAtMSBpZiB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlLCBvciAwIGlmIHRoZSBudW1iZXIgaXMgMFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2lnbihuOiBudW1iZXIpOiBudW1iZXIge1xuXHRuID0gTnVtYmVyKG4pO1xuXHRpZiAobiA9PT0gMCB8fCBuICE9PSBuKSB7XG5cdFx0cmV0dXJuIG47XG5cdH1cblx0cmV0dXJuIG4gPiAwID8gMSA6IC0xO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaW5oKG46IG51bWJlcik6IG51bWJlciB7XG5cdGNvbnN0IG0gPSBNYXRoLmV4cChuKTtcblx0cmV0dXJuIChtIC0gMSAvIG0pIC8gMjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIG4gVGhlIG51bWJlciB0byB1c2UgaW4gY2FsY3VsYXRpb25cbiAqIEByZXR1cm4gVGhlIHJlc3VsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFuaChuOiBudW1iZXIpOiBudW1iZXIge1xuXHRpZiAobiA9PT0gSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXHRlbHNlIGlmIChuID09PSAtSW5maW5pdHkpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Y29uc3QgeSA9IE1hdGguZXhwKDIgKiBuKTtcblx0XHRyZXR1cm4gKHkgLSAxKSAvICh5ICsgMSk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnRlZ3JhbCBwYXJ0IG9mIGEgbnVtYmVyIGJ5IHJlbW92aW5nIGFueSBmcmFjdGlvbmFsIGRpZ2l0cy5cbiAqXG4gKiBAcGFyYW0gbiBUaGUgbnVtYmVyIHRvIHVzZSBpbiBjYWxjdWxhdGlvblxuICogQHJldHVybiBUaGUgcmVzdWx0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnVuYyhuOiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gbiA8IDAgPyBNYXRoLmNlaWwobikgOiBNYXRoLmZsb29yKG4pO1xufVxuIl19