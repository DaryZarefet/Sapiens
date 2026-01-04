import { Buttonav } from "./ui/Buttonnav";

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen gap-2">
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800">404</h1>
        <p className="text-center text-gray-600">The page you are looking for does not exist.</p>
      </div>

      <Buttonav path="/" className="p-2 bg-blue-500 rounded-sm text-white hover:bg-blue-600 transition-all duration-300 ease-in-out">
        Go back home
      </Buttonav>
    </section>
  );
};

export default NotFound;
