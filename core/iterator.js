(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './string', './Symbol'], factory);
    }
})(function (require, exports) {
    "use strict";
    const string_1 = require('./string');
    const Symbol_1 = require('./Symbol');
    const staticDone = { done: true, value: undefined };
    /**
     * A class that provides "shims" an iterator interface on array like
     * objects.
     */
    class ShimIterator {
        constructor(list) {
            this._nextIndex = -1;
            this._list = list;
        }
        ;
        /**
         * Return the next iteration result for the Iterator
         */
        next() {
            if (!this._list) {
                return staticDone;
            }
            if (++this._nextIndex < this._list.length) {
                return {
                    done: false,
                    value: this._list[this._nextIndex]
                };
            }
            return staticDone;
        }
        ;
        [Symbol_1.default.iterator]() {
            return this;
        }
    }
    exports.ShimIterator = ShimIterator;
    /**
     * A type guard for checking if something has an Iterable interface
     * @param value The value to type guard against
     */
    function isIterable(value) {
        return value && typeof value[Symbol_1.default.iterator] !== 'undefined';
    }
    exports.isIterable = isIterable;
    /**
     * A type guard for checking if something is ArrayLike
     * @param value The value to type guard against
     */
    function isArrayLike(value) {
        return value && typeof value.length !== 'undefined';
    }
    exports.isArrayLike = isArrayLike;
    /**
     * Returns the iterator for an object
     * @param iterable The iterable object to return the itertator for
     */
    function get(iterable) {
        if (isIterable(iterable)) {
            /* have to cast as any, because the assumed index is implicit any */
            return iterable[Symbol_1.default.iterator]();
        }
        else if (isArrayLike(iterable)) {
            return new ShimIterator(iterable);
        }
    }
    exports.get = get;
    ;
    /**
     * Shims the functionality of `for ... of` blocks
     */
    function forOf(iterable, callback, thisArg) {
        let broken = false;
        function doBreak() {
            broken = true;
        }
        /* We need to handle iteration of double byte strings properly */
        if (!isIterable(iterable) && typeof iterable === 'string') {
            const l = iterable.length;
            for (let i = 0; i < l; ++i) {
                let char = iterable[i];
                if ((i + 1) < l) {
                    const code = char.charCodeAt(0);
                    if ((code >= string_1.HIGH_SURROGATE_MIN) && (code <= string_1.HIGH_SURROGATE_MAX)) {
                        char += iterable[++i];
                    }
                }
                callback.call(thisArg, char, iterable, doBreak);
                if (broken) {
                    return;
                }
            }
        }
        else {
            const iterator = get(iterable);
            let result = iterator.next();
            while (!result.done) {
                callback.call(thisArg, result.value, iterable, doBreak);
                if (broken) {
                    return;
                }
                result = iterator.next();
            }
        }
    }
    exports.forOf = forOf;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaXRlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBQUEseUJBQXVELFVBQVUsQ0FBQyxDQUFBO0lBQ2xFLHlCQUFtQixVQUFVLENBQUMsQ0FBQTtJQXFCOUIsTUFBTSxVQUFVLEdBQXdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFFekU7OztPQUdHO0lBQ0g7UUFJQyxZQUFZLElBQWtCO1lBRnRCLGVBQVUsR0FBVyxDQUFDLENBQUMsQ0FBQztZQUcvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDOztRQUVEOztXQUVHO1FBQ0gsSUFBSTtZQUNILEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDbkIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQztvQkFDTixJQUFJLEVBQUUsS0FBSztvQkFDWCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUNsQyxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDbkIsQ0FBQzs7UUFFRCxDQUFDLGdCQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO0lBQ0YsQ0FBQztJQTNCWSxvQkFBWSxlQTJCeEIsQ0FBQTtJQUVEOzs7T0FHRztJQUNILG9CQUEyQixLQUFVO1FBQ3BDLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMs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U1VSUk9HQVRFX01BWCB9IGZyb20gJy4vc3RyaW5nJztcbmltcG9ydCBTeW1ib2wgZnJvbSAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0ZG9uZTogYm9vbGVhbjtcblx0dmFsdWU/OiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yPFQ+IHtcblx0bmV4dCh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXHRyZXR1cm4/KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cdHRocm93PyhlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmFibGU8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZUl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+O1xufVxuXG5jb25zdCBzdGF0aWNEb25lOiBJdGVyYXRvclJlc3VsdDxhbnk+ID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG5cbi8qKlxuICogQSBjbGFzcyB0aGF0IHByb3ZpZGVzIFwic2hpbXNcIiBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZVxuICogb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoaW1JdGVyYXRvcjxUPiB7XG5cdHByaXZhdGUgX2xpc3Q6IEFycmF5TGlrZTxUPjtcblx0cHJpdmF0ZSBfbmV4dEluZGV4OiBudW1iZXIgPSAtMTtcblxuXHRjb25zdHJ1Y3RvcihsaXN0OiBBcnJheUxpa2U8VD4pIHtcblx0XHR0aGlzLl9saXN0ID0gbGlzdDtcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJuIHRoZSBuZXh0IGl0ZXJhdGlvbiByZXN1bHQgZm9yIHRoZSBJdGVyYXRvclxuXHQgKi9cblx0bmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG5cdFx0aWYgKCF0aGlzLl9saXN0KSB7XG5cdFx0XHRyZXR1cm4gc3RhdGljRG9uZTtcblx0XHR9XG5cdFx0aWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGRvbmU6IGZhbHNlLFxuXHRcdFx0XHR2YWx1ZTogdGhpcy5fbGlzdFt0aGlzLl9uZXh0SW5kZXhdXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gc3RhdGljRG9uZTtcblx0fTtcblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBJdGVyYWJsZTxhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdICE9PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgQXJyYXlMaWtlPGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgZm9yIGFuIG9iamVjdFxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBpdGVyYWJsZSBvYmplY3QgdG8gcmV0dXJuIHRoZSBpdGVydGF0b3IgZm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXQ8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQ+IHwgQXJyYXlMaWtlPFQ+KTogSXRlcmF0b3I8VD4ge1xuXHRpZiAoaXNJdGVyYWJsZShpdGVyYWJsZSkpIHtcblx0XHQvKiBoYXZlIHRvIGNhc3QgYXMgYW55LCBiZWNhdXNlIHRoZSBhc3N1bWVkIGluZGV4IGlzIGltcGxpY2l0IGFueSAqL1xuXHRcdHJldHVybiAoPGFueT4gaXRlcmFibGUpW1N5bWJvbC5pdGVyYXRvcl0oKTtcblx0fVxuXHRlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG5cdH1cbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9yT2ZDYWxsYmFjazxUPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBhIGZvck9mKCkgaXRlcmF0aW9uXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgY3VycmVudCB2YWx1ZVxuXHQgKiBAcGFyYW0gb2JqZWN0IFRoZSBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3ZlclxuXHQgKiBAcGFyYW0gZG9CcmVhayBBIGZ1bmN0aW9uLCBpZiBjYWxsZWQsIHdpbGwgc3RvcCB0aGUgaXRlcmF0aW9uXG5cdCAqL1xuXHQodmFsdWU6IFQsIG9iamVjdDogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4sIGRvQnJlYWs6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvck9mPFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZywgY2FsbGJhY2s6IEZvck9mQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiBhbnkpOiB2b2lkIHtcblx0bGV0IGJyb2tlbiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIGRvQnJlYWsoKSB7XG5cdFx0YnJva2VuID0gdHJ1ZTtcblx0fVxuXG5cdC8qIFdlIG5lZWQgdG8gaGFuZGxlIGl0ZXJhdGlvbiBvZiBkb3VibGUgYnl0ZSBzdHJpbmdzIHByb3Blcmx5ICovXG5cdGlmICghaXNJdGVyYWJsZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xuXHRcdGNvbnN0IGwgPSBpdGVyYWJsZS5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcblx0XHRcdGxldCBjaGFyID0gaXRlcmFibGVbaV07XG5cdFx0XHRpZiAoKGkgKyAxKSA8IGwpIHtcblx0XHRcdFx0Y29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcblx0XHRcdFx0aWYgKChjb2RlID49IEhJR0hfU1VSUk9HQVRFX01JTikgJiYgKGNvZGUgPD0gSElHSF9TVVJST0dBVEVfTUFYKSkge1xuXHRcdFx0XHRcdGNoYXIgKz0gaXRlcmFibGVbKytpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRpZiAoYnJva2VuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0Y29uc3QgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xuXHRcdGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cblx0XHR3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xuXHRcdFx0aWYgKGJyb2tlbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cdFx0fVxuXHR9XG5cbn1cbiJdfQ==