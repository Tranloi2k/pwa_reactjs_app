// src/worker.ts
self.onmessage = function (e) {
  const number = e.data;
  let result = 0;

  // Giả lập một tác vụ tính toán nặng
  for (let i = 0; i < 1e9; i++) {
    result += number;
  }

  // Gửi kết quả về luồng chính
  self.postMessage(result);
};
