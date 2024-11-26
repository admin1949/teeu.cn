self.addEventListener("message", (e) => {
  console.log('Worker: Message received from main script');
  const result = e.data[0] * e.data[1];
  if (isNaN(result)) {
    postMessage('Worker Result: Please write two numbers');
  } else {
    const workerResult = 'Worker Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
})
