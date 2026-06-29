import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#fafafa] dark:bg-black">
      <main className="flex w-full max-w-200 flex-1 flex-col items-start justify-between bg-white px-6 py-12 sm:px-[60px] sm:py-[120px] dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-start gap-4 text-left sm:gap-6">
          <h1 className="max-w-[320px] text-3xl font-semibold leading-tight tracking-tight text-balance text-black sm:text-[40px] sm:leading-[48px] dark:text-[#ededed]">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-110 text-lg leading-8 text-balance text-[#666] dark:text-[#999]">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              className="font-medium text-black dark:text-[#ededed]"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              className="font-medium text-black dark:text-[#ededed]"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex w-full max-w-110 flex-row gap-4 text-sm">
          <a
            className="flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-black px-4 font-medium text-white transition-colors hover:bg-[#383838] dark:bg-[#ededed] dark:text-black dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-full border border-[#ebebeb] px-4 font-medium transition-colors hover:bg-[#f2f2f2] dark:border-[#1a1a1a] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
