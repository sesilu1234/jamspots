'use client';
import { divIcon } from 'leaflet';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const searchParams = useSearchParams();

  // Get the 'callbackUrl' from the URL, or default to home if it's missing
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  return (
    <div className="min-h-screen bg-white/85 text-black">
      <div className="w-[1300px] max-w-[90%] mx-auto ">
        <div className="inline-block ml-6 sm:ml-12 md:ml-24 mt-12">
          <div className="ml-3 flex flex-col  md:flex-row  md:items-end gap-2">
            <h3 className="font-bold text-4xl">jamspots</h3>
            <p className=" text-xs pb-1 text-gray-800 font-semibold">
              Find the next spot where music happens.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-center mt-24">
            <h3 className="font-bold text-5xl">WELCOME TO JAMSPOTS</h3>
          </div>

          <div className="h-[1.5px] bg-gray-700/50 container md:w-168 mt-4 mx-auto"></div>
          <div className="flex container md:w-168 justify-between md:mx-auto mt-4 text-black/95">
            <Link href="/">
              <div className="flex gap-4 items-center font-bold">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.40527 12.65H23V10.35H4.40527L13.1395 1.61575L11.5 0L0 11.5L11.5 23L13.1395 21.3842L4.40527 12.65Z"
                    fill="#1F1F1F"
                  />
                </svg>
                Back to Home Page
              </div>
            </Link>
            <div className="font-bold text-black/95">SIGN IN</div>
          </div>

          <div
            className="flex items-center font-bold px-8 py-4 mt-24 bg-white w-84 gap-8 mx-auto justify-center rounded-xl cursor-pointer border border-black hover:bg-black/10"
            onClick={() => signIn('google', { callbackUrl })}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7574 24.9988C10.7574 23.411 11.0211 21.8888 11.4917 20.461L3.25339 14.1699C1.64778 17.4299 0.743164 21.1033 0.743164 24.9988C0.743164 28.891 1.64667 32.5621 3.25005 35.8199L11.484 29.5166C11.0177 28.0955 10.7574 26.5788 10.7574 24.9988Z"
                fill="#FBBC05"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.2219 10.5547C28.6712 10.5547 31.7867 11.7769 34.2347 13.7769L41.3559 6.6658C37.0164 2.88802 31.4529 0.554688 25.2219 0.554688C15.5481 0.554688 7.23413 6.08691 3.25293 14.1702L11.4913 20.4614C13.3895 14.6991 18.8005 10.5547 25.2219 10.5547Z"
                fill="#EB4335"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.2219 39.4438C18.8005 39.4438 13.3895 35.2993 11.4913 29.5371L3.25293 35.8271C7.23413 43.9116 15.5481 49.4438 25.2219 49.4438C31.1926 49.4438 36.8929 47.3238 41.1712 43.3516L33.3512 37.306C31.1447 38.696 28.3663 39.4438 25.2219 39.4438Z"
                fill="#34A853"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.5891 24.9991C48.5891 23.5547 48.3666 21.9991 48.0328 20.5547H25.2227V29.9991H38.3524C37.6959 33.2191 35.9089 35.6947 33.352 37.3058L41.1719 43.3514C45.6661 39.1802 48.5891 32.9669 48.5891 24.9991Z"
                fill="#4285F4"
              />
            </svg>
            Continue with Google
          </div>
        </div>
      </div>
    </div>
  );
}
