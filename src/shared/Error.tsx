export const Error = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen gap-2">
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800">500</h1>
        <p className="text-center text-gray-600">An error has occurred</p>
      </div>

      <button className="p-2 bg-blue-500 rounded-sm text-white hover:bg-blue-600 transition-all duration-300 ease-in-out">
        <a href="/main">Go back home</a>
      </button>
    </section>
  );
};
