import { default as Options } from './options';
import { diff, isFunction } from "./utils"
import {VNode} from "./preact/internal"

export const options = Options

function setupRender(vnode:VNode) {  
    let instance = vnode?._component?.instance
    if (!instance || ! instance['setup']) {
        console.log("no setup")
        return
    }
    //console.log("setupRender")
    let { data, methods } = instance.setup()
    let difference = diff(instance.data, data)
    //console.log("setupRender difference",difference)
    instance.setData(difference)
    vnode._component.methods = methods
    return vnode
}
export function createPage(page:any){
    const vnodeAry:VNode[] = []
    const realOnLoad = page.onLoad

    let  setupMethods = page.setupMethods||[]


        for (let e of setupMethods) {
            if(e && (!page[e])) 
             { 
                page[e] =function(){
                    //console.log("methods",e,this)
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    const instance: any = this;        
                    const id= instance.$id
                    let vnode = vnodeAry[id]
                    let context = vnode._component
                     //@ts-ignore
                    // eslint-disable-next-line prefer-rest-params
                    context?.methods[e]?.apply(this, arguments);
                 }
            }
        }
    


    function onLoad(query: any) {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance: any = this;        
        const id= instance.$id
        const vnode: VNode<any> = {           
            props:query,
            _component:{
                setState(){
                    Options._render(vnode)
                 },
            instance,
            render(){
             return  setupRender(vnode)
           
        } }}
        vnodeAry[id]=vnode
        Options._render(vnode)

        
        if (isFunction(realOnLoad)) {
            //@ts-ignore
            realOnLoad.call(this, query);
        }
    }
    const realonUnload = page.onUnload
    function onUnload() {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance: any = this;  
        const id= instance.$id 
        Options.unmount(vnodeAry[id])
        //contextAry[id].didUnInit()
        delete vnodeAry[id]
        if (isFunction(realonUnload)) {
            //@ts-ignore
            realonUnload.call(this);
        }
    }
    page.onLoad = onLoad
    page.onUnload = onUnload
    return page
}


export function createComponent(component:any){
    const vnodeAry:VNode[] = []


    let  setupMethods = component.setupMethods||[]

        
        if(!component.methods) component.methods= {}
       //debugger
        for (let e of setupMethods) {
            if(e && (!component.methods[e])) 
             { 
                component.methods[e] =function(){
                    //console.log("methods",e,this)
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    const instance: any = this;        
                    const id= instance.$id
                    let vnode = vnodeAry[id]
                    let context = vnode._component
                     //@ts-ignore
                    // eslint-disable-next-line prefer-rest-params
                    context?.methods[e]?.apply(this, arguments);
                 }
            }
        }
        
    
    const realOnInit = component.onInit;
    const realDidUnmount = component.didUnmount;

    function onInit() {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance: any = this;        
        const id= instance.$id
        const vnode: VNode<any> = {           
            props:{},
            _component:{
                setState(){
                    Options._render(vnode)
                 },
            instance,
            render(){
             return  setupRender(vnode)
           
        } }}
        vnodeAry[id]=vnode
        Options._render(vnode)

        if (isFunction(realOnInit)) {
            //@ts-ignore
            realOnInit.call(this);
        }
    }

    function didUnmount() {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance: any = this;  
        const id= instance.$id 
        Options.unmount(vnodeAry[id])
        //contextAry[id].didUnInit()
        delete vnodeAry[id]
        if (isFunction(realDidUnmount)) {
            //@ts-ignore
            realDidUnmount.call(this);
        }
    }
    component.onInit = onInit
    component.didUnmount = didUnmount
    return component
}