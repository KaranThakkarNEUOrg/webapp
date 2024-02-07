test('Test case: "hello world"', () => {
  const mockLog = jest.spyOn(console, "log").mockImplementation();

  console.log("hello world");

  expect(mockLog).toHaveBeenCalledWith("hello world");

  mockLog.mockRestore();
});
