process.on('message', (message) => {
  const { type, timeout } = message
  if (type === 'start') {
    const endTime = Date.now() + parseInt(timeout)
    setInterval(() => {
      if (Date.now() > endTime) {
        // 事件到了
        process.send({ready: true})
        process.exit() //子进程推出
      }
    }, 100);
  }
})