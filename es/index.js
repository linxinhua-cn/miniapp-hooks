"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorBoundary = exports.useDebugValue = exports.useContext = exports.useCallback = exports.useMemo = exports.useImperativeHandle = exports.useRef = exports.useLayoutEffect = exports.useEffect = exports.useReducer = exports.useState = void 0;
var miniapp_1 = require("./miniapp");
var currentIndex;
var currentComponent;
var currentHook = 0;
var afterPaintEffects = [];
var oldBeforeDiff = miniapp_1.options._diff;
var oldBeforeRender = miniapp_1.options._render;
var oldAfterDiff = miniapp_1.options.diffed;
var oldCommit = miniapp_1.options._commit;
var oldBeforeUnmount = miniapp_1.options.unmount;
var RAF_TIMEOUT = 100;
var prevRaf;
miniapp_1.options._diff = function (vnode) {
    currentComponent = null;
    if (oldBeforeDiff)
        oldBeforeDiff(vnode);
};
miniapp_1.options._render = function (vnode) {
    if (oldBeforeRender)
        oldBeforeRender(vnode);
    currentComponent = vnode._component;
    currentIndex = 0;
    var hooks = currentComponent.__hooks;
    if (hooks) {
        hooks._pendingEffects.forEach(invokeCleanup);
        hooks._pendingEffects.forEach(invokeEffect);
        hooks._pendingEffects = [];
    }
};
miniapp_1.options.diffed = function (vnode) {
    if (oldAfterDiff)
        oldAfterDiff(vnode);
    var c = vnode._component;
    if (c && c.__hooks && c.__hooks._pendingEffects.length) {
        afterPaint(afterPaintEffects.push(c));
    }
    currentComponent = null;
};
miniapp_1.options._commit = function (vnode, commitQueue) {
    commitQueue.some(function (component) {
        try {
            component._renderCallbacks.forEach(invokeCleanup);
            component._renderCallbacks = component._renderCallbacks.filter(function (cb) {
                return cb._value ? invokeEffect(cb) : true;
            });
        }
        catch (e) {
            commitQueue.some(function (c) {
                if (c._renderCallbacks)
                    c._renderCallbacks = [];
            });
            commitQueue = [];
            miniapp_1.options._catchError(e, component._vnode);
        }
    });
    if (oldCommit)
        oldCommit(vnode, commitQueue);
};
miniapp_1.options.unmount = function (vnode) {
    if (oldBeforeUnmount)
        oldBeforeUnmount(vnode);
    var c = vnode._component;
    if (c && c.__hooks) {
        var hasErrored_1;
        c.__hooks._list.forEach(function (s) {
            try {
                invokeCleanup(s);
            }
            catch (e) {
                hasErrored_1 = e;
            }
        });
        if (hasErrored_1)
            miniapp_1.options._catchError(hasErrored_1, c._vnode);
    }
};
function getHookState(index, type) {
    if (miniapp_1.options._hook) {
        miniapp_1.options._hook(currentComponent, index, currentHook || type);
    }
    currentHook = 0;
    var hooks = currentComponent.__hooks ||
        (currentComponent.__hooks = {
            _list: [],
            _pendingEffects: []
        });
    if (index >= hooks._list.length) {
        hooks._list.push({});
    }
    return hooks._list[index];
}
function useState(initialState) {
    currentHook = 1;
    return useReducer(invokeOrReturn, initialState);
}
exports.useState = useState;
function useReducer(reducer, initialState, init) {
    var hookState = getHookState(currentIndex++, 2);
    hookState._reducer = reducer;
    if (!hookState._component) {
        hookState._value = [
            !init ? invokeOrReturn(undefined, initialState) : init(initialState),
            function (action) {
                var nextValue = hookState._reducer(hookState._value[0], action);
                if (hookState._value[0] !== nextValue) {
                    hookState._value = [nextValue, hookState._value[1]];
                    hookState._component.setState({});
                }
            }
        ];
        hookState._component = currentComponent;
    }
    return hookState._value;
}
exports.useReducer = useReducer;
function useEffect(callback, args) {
    var state = getHookState(currentIndex++, 3);
    if (!miniapp_1.options._skipEffects && argsChanged(state._args, args)) {
        state._value = callback;
        state._args = args;
        currentComponent.__hooks._pendingEffects.push(state);
    }
}
exports.useEffect = useEffect;
function useLayoutEffect(callback, args) {
    var state = getHookState(currentIndex++, 4);
    if (!miniapp_1.options._skipEffects && argsChanged(state._args, args)) {
        state._value = callback;
        state._args = args;
        currentComponent._renderCallbacks.push(state);
    }
}
exports.useLayoutEffect = useLayoutEffect;
function useRef(initialValue) {
    currentHook = 5;
    return useMemo(function () { return ({ current: initialValue }); }, []);
}
exports.useRef = useRef;
function useImperativeHandle(ref, createHandle, args) {
    currentHook = 6;
    useLayoutEffect(function () {
        if (typeof ref == 'function') {
            ref(createHandle());
            return function () { return ref(null); };
        }
        else if (ref) {
            ref.current = createHandle();
            return function () { return ref.current = null; };
        }
    }, args == null ? args : args.concat(ref));
}
exports.useImperativeHandle = useImperativeHandle;
function useMemo(factory, args) {
    var state = getHookState(currentIndex++, 7);
    if (argsChanged(state._args, args)) {
        state._value = factory();
        state._args = args;
        state._factory = factory;
    }
    return state._value;
}
exports.useMemo = useMemo;
function useCallback(callback, args) {
    currentHook = 8;
    return useMemo(function () { return callback; }, args);
}
exports.useCallback = useCallback;
function useContext(context) {
    var provider = currentComponent.context[context._id];
    var state = getHookState(currentIndex++, 9);
    state._context = context;
    if (!provider)
        return context._defaultValue;
    if (state._value == null) {
        state._value = true;
        provider.sub(currentComponent);
    }
    return provider.props.value;
}
exports.useContext = useContext;
function useDebugValue(value, formatter) {
    if (miniapp_1.options.useDebugValue) {
        miniapp_1.options.useDebugValue(formatter ? formatter(value) : value);
    }
}
exports.useDebugValue = useDebugValue;
function useErrorBoundary(cb) {
    var state = getHookState(currentIndex++, 10);
    var errState = useState();
    state._value = cb;
    if (!currentComponent.componentDidCatch) {
        currentComponent.componentDidCatch = function (err) {
            if (state._value)
                state._value(err);
            errState[1](err);
        };
    }
    return [
        errState[0],
        function () {
            errState[1](undefined);
        }
    ];
}
exports.useErrorBoundary = useErrorBoundary;
function flushAfterPaintEffects() {
    var component;
    while ((component = afterPaintEffects.shift())) {
        if (!component._parentDom)
            continue;
        try {
            component.__hooks._pendingEffects.forEach(invokeCleanup);
            component.__hooks._pendingEffects.forEach(invokeEffect);
            component.__hooks._pendingEffects = [];
        }
        catch (e) {
            component.__hooks._pendingEffects = [];
            miniapp_1.options._catchError(e, component._vnode);
        }
    }
}
var HAS_RAF = typeof requestAnimationFrame == 'function';
function afterNextFrame(callback) {
    var done = function () {
        clearTimeout(timeout);
        if (HAS_RAF)
            cancelAnimationFrame(raf);
        setTimeout(callback);
    };
    var timeout = setTimeout(done, RAF_TIMEOUT);
    var raf;
    if (HAS_RAF) {
        raf = requestAnimationFrame(done);
    }
}
function afterPaint(newQueueLength) {
    if (newQueueLength === 1 || prevRaf !== miniapp_1.options.requestAnimationFrame) {
        prevRaf = miniapp_1.options.requestAnimationFrame;
        (prevRaf || afterNextFrame)(flushAfterPaintEffects);
    }
}
function invokeCleanup(hook) {
    var comp = currentComponent;
    var cleanup = hook._cleanup;
    if (typeof cleanup == 'function') {
        hook._cleanup = undefined;
        cleanup();
    }
    currentComponent = comp;
}
function invokeEffect(hook) {
    var comp = currentComponent;
    hook._cleanup = hook._value();
    currentComponent = comp;
}
function argsChanged(oldArgs, newArgs) {
    return (!oldArgs ||
        oldArgs.length !== newArgs.length ||
        newArgs.some(function (arg, index) { return arg !== oldArgs[index]; }));
}
function invokeOrReturn(arg, f) {
    return typeof f == 'function' ? f(arg) : f;
}
