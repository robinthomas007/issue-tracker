import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 justify-center mx-auto my-2">
      <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
        <div className="flex justify-center -translate-y-[1px]">
          <div className="w-3/4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full">
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <p className="font-bold mb-2 text-violet-500 dark:text-violet-60 text-2xl md:text-3xl lg:text-4xl">10M+</p>
          <p className="mb-0 leading-5 text-sm lg:text-base">Students taught</p>
        </div>
      </div>
      <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
        <div className="flex justify-center -translate-y-[1px]">
          <div className="w-3/4"><div className="h-[1px] bg-gradient-to-r from-transparent via-green-600 to-transparent  w-full">
          </div></div></div><div className="flex flex-col justify-center items-center text-center p-8">
          <p className="font-bold mb-2 text-green-600 text-2xl md:text-3xl lg:text-4xl">3M+</p>
          <p className="mb-0 leading-5 text-sm lg:text-base">YouTube fans</p>
        </div>
      </div>
      <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
        <div className="flex justify-center -translate-y-[1px]">
          <div className="w-3/4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-550 to-transparent  w-full">
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-8">
          <p className="font-bold mb-2 text-pink-500 dark:text-pink-540 text-2xl md:text-3xl lg:text-4xl">20+</p>
          <p className="mb-0 leading-5 text-sm lg:text-base">Years of experience</p>
        </div>
      </div><div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
        <div className="flex justify-center -translate-y-[1px]">
          <div className="w-3/4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent  w-full">
            </div></div></div><div className="flex flex-col justify-center items-center text-center p-8">
          <p className="font-bold mb-2 text-orange-400 text-2xl md:text-3xl lg:text-4xl">51</p>
          <p className="mb-0 leading-5 text-sm lg:text-base">Coding courses</p>
        </div>
      </div>
    </div>
  );
}
