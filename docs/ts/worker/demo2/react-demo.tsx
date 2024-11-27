import React, { useEffect, useRef, useState, FC } from "react";
import { Form, Input, Switch } from "antd";
import demo2Url from "./worker/index?worker&url";
import { Fns } from "./worker/worker-type";
import { WorkerClient } from "./worker/utils/client";

const App: FC = () => {
  const [first, setFirst] = useState("1");
  const [second, setSecond] = useState("1");
  const [isAdd, setIsAdd] = useState(false);
  const [result, setResult] = useState("0");

  const worker = useRef<WorkerClient<Fns> | null>(null);
  useEffect(() => {
    const instance = new WorkerClient<Fns>(demo2Url, {
      type: "module",
      name: "demo2-react-worker",
    });

    worker.current = instance;
    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    if (isAdd) {
      worker.current?.callRemote("add", [first, second]).then((val) => {
        setResult(val);
      });
    } else {
      worker.current
        ?.callRemote("multiplication", [first, second])
        .then((val) => {
          setResult(val);
        });
    }
  }, [first, second, isAdd]);

  return (
    <Form>
      <Form.Item label="Multiply number 1:">
        <Input value={first} onChange={(e) => setFirst(e.target.value)}></Input>
      </Form.Item>
      <Form.Item label="Multiply number 2:">
        <Input
          value={second}
          onChange={(e) => setSecond(e.target.value)}
        ></Input>
      </Form.Item>
      <Form.Item label="Model:">
        <Switch
          checkedChildren="加法"
          unCheckedChildren="乘法"
          value={isAdd}
          onChange={(e) => setIsAdd(e)}
        ></Switch>
      </Form.Item>
      <Form.Item>{result}</Form.Item>
    </Form>
  );
};

export default App;
