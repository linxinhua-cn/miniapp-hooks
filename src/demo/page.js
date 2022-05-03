import {useEffect, useState } from "miniapp-hooks"
import {createPage ,createComponent } from "miniapp-hooks/miniapp"
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
