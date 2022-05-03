# 概述
在小程序上实现 类似react的  hooks (useEffect, useState)
# Install
$ npm install --save miniapp-hooks
# or
$ yarn add miniapp-hooks

# Usage
~~~
import { useEffect, useState } from "miniapp-hooks";
import { createPage, createComponent } from "miniapp-hooks/es/miniapp";
~~~


## Component
>js
~~~
import { useEffect, useState } from "miniapp-hooks";
import { createPage, createComponent } from "miniapp-hooks/es/miniapp";

Component(
  createComponent({
    data: {},
    setupMethods: ["onTap1"],
    methods: {
      setup() {
        const [count, setCount] = useState(0);
        const [count2, setCount2] = useState(1);
        useEffect(() => {
          console.log("useEffect", count);
          let timerId = setInterval(() => {
            setCount2((c) => +c + 1);
          }, 1000);
          return () => {
            console.log("clear clearTimeout");
            clearTimeout(timerId);
          };
        }, [count]);
        const onTap1 = () => {
          console.log("tap1", count);
          setCount((count) => count + 1);
        };
        return {
          data: { count, count2 },
          methods: {
            onTap1,
          },
        };
      },
    },
  })
);


~~~
>AXML  
~~~
<button size="default" onTap="onTap1" type="primary"> {{count}} - {{count2}}</button>
~~~

## PAGE
>js
~~~
import {useEffect, useState } from "miniapp-hooks"
import {createPage ,createComponent } from "miniapp-hooks/es/miniapp"
Page(
  createPage({
    data: {},
    setupMethods: ["onTap1"],

    setup() {
      const [count, setCount] = useState(0);
      const [count2, setCount2] = useState(1);

      useEffect(() => {
        console.log("useEffect", count);
        let timerId = setInterval(() => {
          setCount2((c) => +c + 1);
        }, 1000);
        return () => {
          console.log("clear clearTimeout");
          clearTimeout(timerId);
        };
      }, [count]);
      const onTap1 = () => {
        console.log("tap1", count);
        setCount((count) => count + 1);
      };
      return {
        data: { count, count2 },
        methods: {
          onTap1,
        },
      };
    },
  })
);

~~~
>AXML  
~~~
<button size="default" onTap="onTap1" type="primary"> {{count}} - {{count2}}</button>
~~~