(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './lang'], factory);
    }
})(function (require, exports) {
    "use strict";
    const lang_1 = require('./lang');
    let nextId = 0;
    function advise(dispatcher, type, advice, receiveArguments) {
        let previous = dispatcher[type];
        let advised = {
            id: nextId++,
            advice: advice,
            receiveArguments: receiveArguments
        };
        if (previous) {
            if (type === 'after') {
                // add the listener to the end of the list
                // note that we had to change this loop a little bit to workaround a bizarre IE10 JIT bug
                while (previous.next && (previous = previous.next)) { }
                previous.next = advised;
                advised.previous = previous;
            }
            else {
                // add to the beginning
                dispatcher.before = advised;
                advised.next = previous;
                previous.previous = advised;
            }
        }
        else {
            dispatcher[type] = advised;
        }
        advice = previous = null;
        return lang_1.createHandle(function () {
            let previous = advised.previous;
            let next = advised.next;
            if (!previous && !next) {
                dispatcher[type] = null;
            }
            else {
                if (previous) {
                    previous.next = next;
                }
                else {
                    dispatcher[type] = next;
                }
                if (next) {
                    next.previous = previous;
                }
            }
            dispatcher = advised.advice = advised = null;
        });
    }
    function getDispatcher(target, methodName) {
        const existing = target[methodName];
        let dispatcher;
        if (!existing || existing.target !== target) {
            // no dispatcher
            target[methodName] = dispatcher = function () {
                let executionId = nextId;
                let args = arguments;
                let results;
                let before = dispatcher.before;
                while (before) {
                    if (before.advice) {
                        args = before.advice.apply(this, args) || args;
                    }
                    before = before.next;
                }
                if (dispatcher.around) {
                    results = dispatcher.around.advice(this, args);
                }
                let after = dispatcher.after;
                while (after && after.id < executionId) {
                    if (after.advice) {
                        if (after.receiveArguments) {
                            let newResults = after.advice.apply(this, args);
                            results = newResults === undefined ? results : newResults;
                        }
                        else {
                            results = after.advice.call(this, results, args);
                        }
                    }
                    after = after.next;
                }
                return results;
            };
            if (existing) {
                dispatcher.around = {
                    advice: function (target, args) {
                        return existing.apply(target, args);
                    }
                };
            }
            dispatcher.target = target;
        }
        else {
            dispatcher = existing;
        }
        target = null;
        return dispatcher;
    }
    /**
     * Attaches "after" advice to be executed after the original method.
     * The advising function will receive the original method's return value and arguments object.
     * The value it returns will be returned from the method when it is called (even if the return value is undefined).
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the original method's return value and arguments object
     * @return A handle which will remove the aspect when destroy is called
     */
    function after(target, methodName, advice) {
        return advise(getDispatcher(target, methodName), 'after', advice);
    }
    exports.after = after;
    /**
     * Attaches "around" advice around the original method.
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the original function
     * @return A handle which will remove the aspect when destroy is called
     */
    function around(target, methodName, advice) {
        let dispatcher = getDispatcher(target, methodName);
        let previous = dispatcher.around;
        let advised = advice(function () {
            return previous.advice(this, arguments);
        });
        dispatcher.around = {
            advice: function (target, args) {
                return advised ?
                    advised.apply(target, args) :
                    previous.advice(target, args);
            }
        };
        advice = null;
        return lang_1.createHandle(function () {
            advised = dispatcher = null;
        });
    }
    exports.around = around;
    /**
     * Attaches "before" advice to be executed before the original method.
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the same arguments as the original, and may return new arguments
     * @return A handle which will remove the aspect when destroy is called
     */
    function before(target, methodName, advice) {
        return advise(getDispatcher(target, methodName), 'before', advice);
    }
    exports.before = before;
    /**
     * Attaches advice to be executed after the original method.
     * The advising function will receive the same arguments as the original method.
     * The value it returns will be returned from the method when it is called *unless* its return value is undefined.
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the same arguments as the original method
     * @return A handle which will remove the aspect when destroy is called
     */
    function on(target, methodName, advice) {
        return advise(getDispatcher(target, methodName), 'after', advice, true);
    }
    exports.on = on;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FzcGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFDQSx1QkFBNkIsUUFBUSxDQUFDLENBQUE7SUFrQnRDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLGdCQUFnQixVQUFzQixFQUFFLElBQVksRUFBRSxNQUFnQixFQUFFLGdCQUEwQjtRQUNqRyxJQUFJLFFBQVEsR0FBVSxVQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxPQUFPLEdBQVk7WUFDdEIsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUNaLE1BQU0sRUFBRSxNQUFNO1lBQ2QsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ2xDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLDBDQUEwQztnQkFDMUMseUZBQXlGO2dCQUN6RixPQUFPLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUN0RCxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDeEIsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDN0IsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNMLHVCQUF1QjtnQkFDdkIsVUFBVSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO2dCQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM3QixDQUFDO1FBQ0YsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0UsVUFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFekIsTUFBTSxDQUFDLG1CQUFZLENBQUM7WUFDbkIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNoQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBRXhCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakIsVUFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDZCxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDdEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRSxVQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBQzFCLENBQUM7WUFDRixDQUFDO1lBRUQsVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCx1QkFBdUIsTUFBVyxFQUFFLFVBQWtCO1FBQ3JELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxJQUFJLFVBQXNCLENBQUM7UUFFM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLGdCQUFnQjtZQUNoQixNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxHQUFnQjtnQkFDOUMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDO2dCQUN6QixJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQ3JCLElBQUksT0FBWSxDQUFDO2dCQUNqQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO2dCQUUvQixPQUFPLE1BQU0sRUFBRSxDQUFDO29CQUNmLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztvQkFDaEQsQ0FBQztvQkFDRCxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDdEIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDdkIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDaEQsQ0FBQztnQkFFRCxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUM3QixPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO29CQUN4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs0QkFDNUIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUNoRCxPQUFPLEdBQUcsVUFBVSxLQUFLLFNBQVMsR0FBRyxPQUFPLEdBQUcsVUFBVSxDQUFDO3dCQUMzRCxDQUFDO3dCQUNELElBQUksQ0FBQyxDQUFDOzRCQUNMLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNsRCxDQUFDO29CQUNGLENBQUM7b0JBQ0QsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNoQixDQUFDLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFVBQVUsQ0FBQyxNQUFNLEdBQUc7b0JBQ25CLE1BQU0sRUFBRSxVQUFVLE1BQVcsRUFBRSxJQUFXO3dCQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3JDLENBQUM7aUJBQ0QsQ0FBQztZQUNILENBQUM7WUFFRCxVQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM1QixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDTCxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRWQsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxlQUFzQixNQUFXLEVBQUUsVUFBa0IsRUFBRSxNQUE4RDtRQUNwSCxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFGZSxhQUFLLFFBRXBCLENBQUE7SUFFRDs7Ozs7O09BTUc7SUFDSCxnQkFBdUIsTUFBVyxFQUFFLFVBQWtCLEVBQUUsTUFBd0M7UUFDL0YsSUFBSSxVQUFVLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUNwQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsTUFBTSxHQUFHO1lBQ25CLE1BQU0sRUFBRSxVQUFVLE1BQVcsRUFBRSxJQUFXO2dCQUN6QyxNQUFNLENBQUMsT0FBTztvQkFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7b0JBQzNCLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUM7U0FDRCxDQUFDO1FBRUYsTUFBTSxHQUFHLElBQUksQ0FBQztRQUVkLE1BQU0sQ0FBQyxtQkFBWSxDQUFDO1lBQ25CLE9BQU8sR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXBCZSxjQUFNLFNBb0JyQixDQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsZ0JBQXVCLE1BQVcsRUFBRSxVQUFrQixFQUFFLE1BQWdEO1FBQ3ZHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUZlLGNBQU0sU0FFckIsQ0FBQTtJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsWUFBbUIsTUFBVyxFQUFFLFVBQWtCLEVBQUUsTUFBdUM7UUFDMUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUZlLFVBQUUsS0FFakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBjcmVhdGVIYW5kbGUgfSBmcm9tICcuL2xhbmcnO1xuXG5pbnRlcmZhY2UgQWR2aXNlZCB7XG5cdGlkPzogbnVtYmVyO1xuXHRhZHZpY2U6IEZ1bmN0aW9uO1xuXHRwcmV2aW91cz86IEFkdmlzZWQ7XG5cdG5leHQ/OiBBZHZpc2VkO1xuXHRyZWNlaXZlQXJndW1lbnRzPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoZXIge1xuXHQoKTogYW55O1xuXHR0YXJnZXQ6IGFueTtcblx0YmVmb3JlPzogQWR2aXNlZDtcblx0YXJvdW5kPzogQWR2aXNlZDtcblx0YWZ0ZXI/OiBBZHZpc2VkO1xufVxuXG5sZXQgbmV4dElkID0gMDtcblxuZnVuY3Rpb24gYWR2aXNlKGRpc3BhdGNoZXI6IERpc3BhdGNoZXIsIHR5cGU6IHN0cmluZywgYWR2aWNlOiBGdW5jdGlvbiwgcmVjZWl2ZUFyZ3VtZW50cz86IGJvb2xlYW4pOiBIYW5kbGUge1xuXHRsZXQgcHJldmlvdXMgPSAoPGFueT4gZGlzcGF0Y2hlcilbdHlwZV07XG5cdGxldCBhZHZpc2VkOiBBZHZpc2VkID0ge1xuXHRcdGlkOiBuZXh0SWQrKyxcblx0XHRhZHZpY2U6IGFkdmljZSxcblx0XHRyZWNlaXZlQXJndW1lbnRzOiByZWNlaXZlQXJndW1lbnRzXG5cdH07XG5cblx0aWYgKHByZXZpb3VzKSB7XG5cdFx0aWYgKHR5cGUgPT09ICdhZnRlcicpIHtcblx0XHRcdC8vIGFkZCB0aGUgbGlzdGVuZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuXHRcdFx0Ly8gbm90ZSB0aGF0IHdlIGhhZCB0byBjaGFuZ2UgdGhpcyBsb29wIGEgbGl0dGxlIGJpdCB0byB3b3JrYXJvdW5kIGEgYml6YXJyZSBJRTEwIEpJVCBidWdcblx0XHRcdHdoaWxlIChwcmV2aW91cy5uZXh0ICYmIChwcmV2aW91cyA9IHByZXZpb3VzLm5leHQpKSB7fVxuXHRcdFx0cHJldmlvdXMubmV4dCA9IGFkdmlzZWQ7XG5cdFx0XHRhZHZpc2VkLnByZXZpb3VzID0gcHJldmlvdXM7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gYWRkIHRvIHRoZSBiZWdpbm5pbmdcblx0XHRcdGRpc3BhdGNoZXIuYmVmb3JlID0gYWR2aXNlZDtcblx0XHRcdGFkdmlzZWQubmV4dCA9IHByZXZpb3VzO1xuXHRcdFx0cHJldmlvdXMucHJldmlvdXMgPSBhZHZpc2VkO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHQoPGFueT4gZGlzcGF0Y2hlcilbdHlwZV0gPSBhZHZpc2VkO1xuXHR9XG5cblx0YWR2aWNlID0gcHJldmlvdXMgPSBudWxsO1xuXG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuXHRcdGxldCBwcmV2aW91cyA9IGFkdmlzZWQucHJldmlvdXM7XG5cdFx0bGV0IG5leHQgPSBhZHZpc2VkLm5leHQ7XG5cblx0XHRpZiAoIXByZXZpb3VzICYmICFuZXh0KSB7XG5cdFx0XHQoPGFueT4gZGlzcGF0Y2hlcilbdHlwZV0gPSBudWxsO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChwcmV2aW91cykge1xuXHRcdFx0XHRwcmV2aW91cy5uZXh0ID0gbmV4dDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQoPGFueT4gZGlzcGF0Y2hlcilbdHlwZV0gPSBuZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZGlzcGF0Y2hlciA9IGFkdmlzZWQuYWR2aWNlID0gYWR2aXNlZCA9IG51bGw7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXREaXNwYXRjaGVyKHRhcmdldDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcpOiBEaXNwYXRjaGVyIHtcblx0Y29uc3QgZXhpc3RpbmcgPSB0YXJnZXRbbWV0aG9kTmFtZV07XG5cdGxldCBkaXNwYXRjaGVyOiBEaXNwYXRjaGVyO1xuXG5cdGlmICghZXhpc3RpbmcgfHwgZXhpc3RpbmcudGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHQvLyBubyBkaXNwYXRjaGVyXG5cdFx0dGFyZ2V0W21ldGhvZE5hbWVdID0gZGlzcGF0Y2hlciA9IDxEaXNwYXRjaGVyPiBmdW5jdGlvbiAoKTogYW55IHtcblx0XHRcdGxldCBleGVjdXRpb25JZCA9IG5leHRJZDtcblx0XHRcdGxldCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0bGV0IHJlc3VsdHM6IGFueTtcblx0XHRcdGxldCBiZWZvcmUgPSBkaXNwYXRjaGVyLmJlZm9yZTtcblxuXHRcdFx0d2hpbGUgKGJlZm9yZSkge1xuXHRcdFx0XHRpZiAoYmVmb3JlLmFkdmljZSkge1xuXHRcdFx0XHRcdGFyZ3MgPSBiZWZvcmUuYWR2aWNlLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IGFyZ3M7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmVmb3JlID0gYmVmb3JlLm5leHQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkaXNwYXRjaGVyLmFyb3VuZCkge1xuXHRcdFx0XHRyZXN1bHRzID0gZGlzcGF0Y2hlci5hcm91bmQuYWR2aWNlKHRoaXMsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWZ0ZXIgPSBkaXNwYXRjaGVyLmFmdGVyO1xuXHRcdFx0d2hpbGUgKGFmdGVyICYmIGFmdGVyLmlkIDwgZXhlY3V0aW9uSWQpIHtcblx0XHRcdFx0aWYgKGFmdGVyLmFkdmljZSkge1xuXHRcdFx0XHRcdGlmIChhZnRlci5yZWNlaXZlQXJndW1lbnRzKSB7XG5cdFx0XHRcdFx0XHRsZXQgbmV3UmVzdWx0cyA9IGFmdGVyLmFkdmljZS5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBuZXdSZXN1bHRzID09PSB1bmRlZmluZWQgPyByZXN1bHRzIDogbmV3UmVzdWx0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gYWZ0ZXIuYWR2aWNlLmNhbGwodGhpcywgcmVzdWx0cywgYXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGFmdGVyID0gYWZ0ZXIubmV4dDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHRcdGlmIChleGlzdGluZykge1xuXHRcdFx0ZGlzcGF0Y2hlci5hcm91bmQgPSB7XG5cdFx0XHRcdGFkdmljZTogZnVuY3Rpb24gKHRhcmdldDogYW55LCBhcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0XHRcdFx0cmV0dXJuIGV4aXN0aW5nLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZGlzcGF0Y2hlci50YXJnZXQgPSB0YXJnZXQ7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hlciA9IGV4aXN0aW5nO1xuXHR9XG5cblx0dGFyZ2V0ID0gbnVsbDtcblxuXHRyZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFmdGVyXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3QuXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAoZXZlbiBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZCkuXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0XG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXIodGFyZ2V0OiBhbnksIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAob3JpZ2luYWxSZXR1cm46IGFueSwgb3JpZ2luYWxBcmdzOiBJQXJndW1lbnRzKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRyZXR1cm4gYWR2aXNlKGdldERpc3BhdGNoZXIodGFyZ2V0LCBtZXRob2ROYW1lKSwgJ2FmdGVyJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFyb3VuZFwiIGFkdmljZSBhcm91bmQgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZCh0YXJnZXQ6IGFueSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6IChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKTogSGFuZGxlIHtcblx0bGV0IGRpc3BhdGNoZXIgPSBnZXREaXNwYXRjaGVyKHRhcmdldCwgbWV0aG9kTmFtZSk7XG5cdGxldCBwcmV2aW91cyA9IGRpc3BhdGNoZXIuYXJvdW5kO1xuXHRsZXQgYWR2aXNlZCA9IGFkdmljZShmdW5jdGlvbiAoKTogYW55IHtcblx0XHRyZXR1cm4gcHJldmlvdXMuYWR2aWNlKHRoaXMsIGFyZ3VtZW50cyk7XG5cdH0pO1xuXG5cdGRpc3BhdGNoZXIuYXJvdW5kID0ge1xuXHRcdGFkdmljZTogZnVuY3Rpb24gKHRhcmdldDogYW55LCBhcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gYWR2aXNlZCA/XG5cdFx0XHRcdGFkdmlzZWQuYXBwbHkodGFyZ2V0LCBhcmdzKSA6XG5cdFx0XHRcdHByZXZpb3VzLmFkdmljZSh0YXJnZXQsIGFyZ3MpO1xuXHRcdH1cblx0fTtcblxuXHRhZHZpY2UgPSBudWxsO1xuXG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuXHRcdGFkdmlzZWQgPSBkaXNwYXRjaGVyID0gbnVsbDtcblx0fSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJiZWZvcmVcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgbWF5IHJldHVybiBuZXcgYXJndW1lbnRzXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlKHRhcmdldDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueVtdIHwgdm9pZCk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2UoZ2V0RGlzcGF0Y2hlcih0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYmVmb3JlJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAqdW5sZXNzKiBpdHMgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZC5cbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gb24odGFyZ2V0OiBhbnksIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIGFkdmlzZShnZXREaXNwYXRjaGVyKHRhcmdldCwgbWV0aG9kTmFtZSksICdhZnRlcicsIGFkdmljZSwgdHJ1ZSk7XG59XG4iXX0=