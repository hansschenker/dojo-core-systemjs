(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './has', './global', './util'], factory);
    }
})(function (require, exports) {
    "use strict";
    const has_1 = require('./has');
    const global_1 = require('./global');
    const util_1 = require('./util');
    var Shim;
    (function (Shim) {
        let Symbol;
        let InternalSymbol;
        const defineProperties = Object.defineProperties;
        const defineProperty = Object.defineProperty;
        const create = Object.create;
        const objPrototype = Object.prototype;
        const globalSymbols = {};
        const getSymbolName = (function () {
            const created = create(null);
            return function (desc) {
                let postfix = 0;
                let name;
                while (created[String(desc) + (postfix || '')]) {
                    ++postfix;
                }
                desc += String(postfix || '');
                created[desc] = true;
                name = '@@' + desc;
                defineProperty(objPrototype, name, {
                    set: function (value) {
                        defineProperty(this, name, util_1.getValueDescriptor(value));
                    }
                });
                return name;
            };
        }());
        InternalSymbol = function Symbol(description) {
            if (this instanceof InternalSymbol) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            return Symbol(description);
        };
        Symbol = function Symbol(description) {
            if (this instanceof Symbol) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            const sym = Object.create(InternalSymbol.prototype);
            description = (description === undefined ? '' : String(description));
            return defineProperties(sym, {
                __description__: util_1.getValueDescriptor(description),
                __name__: util_1.getValueDescriptor(getSymbolName(description))
            });
        };
        /**
         * A custom guard function that determines if an object is a symbol or not
         * @param  {any}       value The value to check to see if it is a symbol or not
         * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
         */
        function isSymbol(value) {
            return (value && ((typeof value === 'symbol') || (value['@@toStringTag'] === 'Symbol'))) || false;
        }
        Shim.isSymbol = isSymbol;
        /**
         * Throws if the value is not a symbol, used internally within the Shim
         * @param  {any}    value The value to check
         * @return {symbol}       Returns the symbol or throws
         */
        function validateSymbol(value) {
            if (!isSymbol(value)) {
                throw new TypeError(value + ' is not a symbol');
            }
            return value;
        }
        /* Decorate the Symbol function with the appropriate properties */
        defineProperties(Symbol, {
            for: util_1.getValueDescriptor(function (key) {
                if (globalSymbols[key]) {
                    return globalSymbols[key];
                }
                return (globalSymbols[key] = Symbol(String(key)));
            }),
            keyFor: util_1.getValueDescriptor(function (sym) {
                let key;
                validateSymbol(sym);
                for (key in globalSymbols) {
                    if (globalSymbols[key] === sym) {
                        return key;
                    }
                }
            }),
            hasInstance: util_1.getValueDescriptor(Symbol('hasInstance'), false, false),
            isConcatSpreadable: util_1.getValueDescriptor(Symbol('isConcatSpreadable'), false, false),
            iterator: util_1.getValueDescriptor(Symbol('iterator'), false, false),
            match: util_1.getValueDescriptor(Symbol('match'), false, false),
            replace: util_1.getValueDescriptor(Symbol('replace'), false, false),
            search: util_1.getValueDescriptor(Symbol('search'), false, false),
            species: util_1.getValueDescriptor(Symbol('species'), false, false),
            split: util_1.getValueDescriptor(Symbol('split'), false, false),
            toPrimitive: util_1.getValueDescriptor(Symbol('toPrimitive'), false, false),
            toStringTag: util_1.getValueDescriptor(Symbol('toStringTag'), false, false),
            unscopables: util_1.getValueDescriptor(Symbol('unscopables'), false, false)
        });
        /* Decorate the InternalSymbol object */
        defineProperties(InternalSymbol.prototype, {
            constructor: util_1.getValueDescriptor(Symbol),
            toString: util_1.getValueDescriptor(function () { return this.__name__; }, false, false)
        });
        /* Decorate the Symbol.prototype */
        defineProperties(Symbol.prototype, {
            toString: util_1.getValueDescriptor(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
            valueOf: util_1.getValueDescriptor(function () { return validateSymbol(this); })
        });
        defineProperty(Symbol.prototype, Symbol.toPrimitive, util_1.getValueDescriptor(function () { return validateSymbol(this); }));
        defineProperty(Symbol.prototype, Symbol.toStringTag, util_1.getValueDescriptor('Symbol', false, false, true));
        defineProperty(InternalSymbol.prototype, Symbol.toPrimitive, util_1.getValueDescriptor(Symbol.prototype[Symbol.toPrimitive], false, false, true));
        defineProperty(InternalSymbol.prototype, Symbol.toStringTag, util_1.getValueDescriptor(Symbol.prototype[Symbol.toStringTag], false, false, true));
        Shim.Exposed = Symbol;
    })(Shim = exports.Shim || (exports.Shim = {}));
    const SymbolShim = has_1.default('es6-symbol') ? global_1.default.Symbol : Shim.Exposed;
    /**
     * Fill any missing well known symbols if the native Symbol is missing the well known
     */
    ['hasInstance', 'isConcatSpreadable', 'iterator', 'species', 'replace', 'search', 'split', 'match', 'toPrimitive',
        'toStringTag', 'unscopables'].forEach((wellKnown) => {
        if (!SymbolShim[wellKnown]) {
            Object.defineProperty(SymbolShim, wellKnown, util_1.getValueDescriptor(SymbolShim(wellKnown), false, false));
        }
    });
    exports.isSymbol = Shim.isSymbol;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SymbolShim;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ltYm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N5bWJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFBQSxzQkFBZ0IsT0FBTyxDQUFDLENBQUE7SUFDeEIseUJBQW1CLFVBQVUsQ0FBQyxDQUFBO0lBQzlCLHVCQUFtQyxRQUFRLENBQUMsQ0FBQTtJQUU1QyxJQUFpQixJQUFJLENBNkpwQjtJQTdKRCxXQUFpQixJQUFJLEVBQUMsQ0FBQztRQUN0QixJQUFJLE1BQTZCLENBQUM7UUFDbEMsSUFBSSxjQUFxQyxDQUFDO1FBNEIxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFN0IsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQU10QyxNQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO1FBUXhDLE1BQU0sYUFBYSxHQUFHLENBQUM7WUFDdEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxVQUFVLElBQW1CO2dCQUNuQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksSUFBWSxDQUFDO2dCQUNqQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNoRCxFQUFFLE9BQU8sQ0FBQztnQkFDWCxDQUFDO2dCQUNELElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDbkIs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QVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVwSSxZQUFPLEdBQUcsTUFBTSxDQUFDO0lBQy9CLENBQUMsRUE3SmdCLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQTZKcEI7SUFFRCxNQUFNLFVBQVUsR0FBK0IsYUFBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLGdCQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFFaEc7O09BRUc7SUFDSCxDQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhO1FBQ2pILGFBQWEsRUFBRSxhQUFhLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQVEsVUFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUseUJBQWtCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3ZHLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztJQUVTLGdCQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUV0QztzQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgZ2V0VmFsdWVEZXNjcmlwdG9yIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSBTaGltIHtcblx0bGV0IFN5bWJvbDogU3ltYm9sU2hpbUNvbnN0cnVjdG9yO1xuXHRsZXQgSW50ZXJuYWxTeW1ib2w6IFN5bWJvbFNoaW1Db25zdHJ1Y3RvcjtcblxuXHRleHBvcnQgaW50ZXJmYWNlIFN5bWJvbFNoaW0ge1xuXHRcdHRvU3RyaW5nKCk6IHN0cmluZztcblx0XHR2YWx1ZU9mKCk6IE9iamVjdDtcblx0XHRbU3ltYm9sLnRvU3RyaW5nVGFnXTogc3RyaW5nO1xuXHRcdFtTeW1ib2wudG9QcmltaXRpdmVdOiBzeW1ib2w7XG5cdFx0W3M6IHN0cmluZ106IGFueTtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgU3ltYm9sU2hpbUNvbnN0cnVjdG9yIHtcblx0XHRwcm90b3R5cGU6IFN5bWJvbFNoaW07XG5cdFx0KGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbDtcblx0XHRmb3Ioa2V5OiBzdHJpbmcpOiBzeW1ib2w7XG5cdFx0a2V5Rm9yKHN5bTogc3ltYm9sKTogc3RyaW5nO1xuXHRcdGhhc0luc3RhbmNlOiBzeW1ib2w7XG5cdFx0aXNDb25jYXRTcHJlYWRhYmxlOiBzeW1ib2w7XG5cdFx0aXRlcmF0b3I6IHN5bWJvbDtcblx0XHRtYXRjaDogc3ltYm9sO1xuXHRcdHJlcGxhY2U6IHN5bWJvbDtcblx0XHRzZWFyY2g6IHN5bWJvbDtcblx0XHRzcGVjaWVzOiBzeW1ib2w7XG5cdFx0c3BsaXQ6IHN5bWJvbDtcblx0XHR0b1ByaW1pdGl2ZTogc3ltYm9sO1xuXHRcdHRvU3RyaW5nVGFnOiBzeW1ib2w7XG5cdFx0dW5zY29wYWJsZXM6IHN5bWJvbDtcblx0fVxuXG5cdGNvbnN0IGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblx0Y29uc3QgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cdGNvbnN0IGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cblx0Y29uc3Qgb2JqUHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXHRpbnRlcmZhY2UgR2xvYmFsU3ltYm9scyB7XG5cdFx0W2tleTogc3RyaW5nXTogc3ltYm9sO1xuXHR9XG5cblx0Y29uc3QgZ2xvYmFsU3ltYm9sczogR2xvYmFsU3ltYm9scyA9IHt9O1xuXG5cdGludGVyZmFjZSBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxUPiBleHRlbmRzIFByb3BlcnR5RGVzY3JpcHRvciB7XG5cdFx0dmFsdWU/OiBUO1xuXHRcdGdldD8gKCk6IFQ7XG5cdFx0c2V0PyAodjogVCk6IHZvaWQ7XG5cdH1cblxuXHRjb25zdCBnZXRTeW1ib2xOYW1lID0gKGZ1bmN0aW9uICgpIHtcblx0XHRjb25zdCBjcmVhdGVkID0gY3JlYXRlKG51bGwpO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZGVzYzogc3RyaW5nfG51bWJlcik6IHN0cmluZyB7XG5cdFx0XHRsZXQgcG9zdGZpeCA9IDA7XG5cdFx0XHRsZXQgbmFtZTogc3RyaW5nO1xuXHRcdFx0d2hpbGUgKGNyZWF0ZWRbU3RyaW5nKGRlc2MpICsgKHBvc3RmaXggfHwgJycpXSkge1xuXHRcdFx0XHQrK3Bvc3RmaXg7XG5cdFx0XHR9XG5cdFx0XHRkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcblx0XHRcdGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xuXHRcdFx0bmFtZSA9ICdAQCcgKyBkZXNjO1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0XHRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9O1xuXHR9KCkpO1xuXG5cdEludGVybmFsU3ltYm9sID0gPGFueT4gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBJbnRlcm5hbFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0cmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XG5cdH07XG5cblx0U3ltYm9sID0gPGFueT4gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uPzogc3RyaW5nfG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlKTtcblx0XHRkZXNjcmlwdGlvbiA9IChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pKTtcblx0XHRyZXR1cm4gZGVmaW5lUHJvcGVydGllcyhzeW0sIHtcblx0XHRcdF9fZGVzY3JpcHRpb25fXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcblx0XHRcdF9fbmFtZV9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZShkZXNjcmlwdGlvbikpXG5cdFx0fSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XG5cdCAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3Rcblx0ICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcblx0ICovXG5cdGV4cG9ydCBmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3ltYm9sIHtcblx0XHRyZXR1cm4gKHZhbHVlICYmICgodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJykgfHwgKHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkpIHx8IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXG5cdCAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4ge3N5bWJvbH0gICAgICAgUmV0dXJucyB0aGUgc3ltYm9sIG9yIHRocm93c1xuXHQgKi9cblx0ZnVuY3Rpb24gdmFsaWRhdGVTeW1ib2wodmFsdWU6IGFueSk6IHN5bWJvbCB7XG5cdFx0aWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhTeW1ib2wsIHtcblx0XHRmb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoa2V5OiBzdHJpbmcpOiBzeW1ib2wge1xuXHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkge1xuXHRcdFx0XHRyZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcblx0XHR9KSxcblx0XHRrZXlGb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoc3ltOiBzeW1ib2wpOiBzdHJpbmcge1xuXHRcdFx0bGV0IGtleTogc3RyaW5nO1xuXHRcdFx0dmFsaWRhdGVTeW1ib2woc3ltKTtcblx0XHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcblx0XHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLFxuXHRcdGhhc0luc3RhbmNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdGlzQ29uY2F0U3ByZWFkYWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2woJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0bWF0Y2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2woJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0cmVwbGFjZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgncmVwbGFjZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNlYXJjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c3BlY2llczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCgnc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwbGl0OiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCdzcGxpdCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvUHJpbWl0aXZlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvU3RyaW5nVGFnOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHVuc2NvcGFibGVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKCd1bnNjb3BhYmxlcycpLCBmYWxzZSwgZmFsc2UpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBJbnRlcm5hbFN5bWJvbCBvYmplY3QgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHRjb25zdHJ1Y3RvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCksXG5cdFx0dG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9fbmFtZV9fOyB9LCBmYWxzZSwgZmFsc2UpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLnByb3RvdHlwZSwge1xuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1N5bWJvbCAoJyArICg8YW55PiB2YWxpZGF0ZVN5bWJvbCh0aGlzKSkuX19kZXNjcmlwdGlvbl9fICsgJyknOyB9KSxcblx0XHR2YWx1ZU9mOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7IH0pXG5cdH0pO1xuXG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpOyB9KSk7XG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcblxuXHRkZWZpbmVQcm9wZXJ0eShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIDxhbnk+IFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XG5cdGRlZmluZVByb3BlcnR5KEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwgPGFueT4gU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcblxuXHRleHBvcnQgY29uc3QgRXhwb3NlZCA9IFN5bWJvbDtcbn1cblxuY29uc3QgU3ltYm9sU2hpbTogU2hpbS5TeW1ib2xTaGltQ29uc3RydWN0b3IgPSBoYXMoJ2VzNi1zeW1ib2wnKSA/IGdsb2JhbC5TeW1ib2wgOiBTaGltLkV4cG9zZWQ7XG5cbi8qKlxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGUgd2VsbCBrbm93blxuICovXG5bICdoYXNJbnN0YW5jZScsICdpc0NvbmNhdFNwcmVhZGFibGUnLCAnaXRlcmF0b3InLCAnc3BlY2llcycsICdyZXBsYWNlJywgJ3NlYXJjaCcsICdzcGxpdCcsICdtYXRjaCcsICd0b1ByaW1pdGl2ZScsXG5cdCd0b1N0cmluZ1RhZycsICd1bnNjb3BhYmxlcycgXS5mb3JFYWNoKCh3ZWxsS25vd24pID0+IHtcblx0XHRpZiAoISg8YW55PiBTeW1ib2xTaGltKVt3ZWxsS25vd25dKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sU2hpbSwgd2VsbEtub3duLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sU2hpbSh3ZWxsS25vd24pLCBmYWxzZSwgZmFsc2UpKTtcblx0XHR9XG5cdH0pO1xuXG5leHBvcnQgY29uc3QgaXNTeW1ib2wgPSBTaGltLmlzU3ltYm9sO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2xTaGltO1xuIl19