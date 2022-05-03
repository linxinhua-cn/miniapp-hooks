import {Options,VNode,ErrorInfo} from "./preact/internal"
const options:Options = {
    _catchError(error: any,
    vnode: VNode,
    oldVNode: VNode | undefined,
    errorInfo: ErrorInfo | undefined){
        console.error(error)
        throw error;
    },
    _render(node:VNode){
        node?._component?.render()
    }
};

export default options;
