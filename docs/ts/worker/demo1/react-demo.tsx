import React, { useEffect, useRef, useState, FC } from "react";
import { Form, Input } from "antd";
import demo1Url from "./worker?worker&url";

const App: FC = () => {
  const [first, setFirst] = useState("1");
  const [second, setSecond] = useState("1");
  const [result, setResult] = useState("");

  const worker = useRef<Worker | null>(null);
  useEffect(() => {
    const instance = new Worker(demo1Url, {
      type: "module",
      name: "demo1-react-worker",
    });

    worker.current = instance;
    instance.addEventListener("message", (e) => {
      setResult(e.data);
      console.log("Message received from worker");
    });

    return () => {
      instance.terminate();
    };
  }, []);
  
  useEffect(() => {
    worker.current?.postMessage([first, second]);
  }, [first, second]);

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
      <Form.Item>{result}</Form.Item>
    </Form>
  );
};

export default App;
