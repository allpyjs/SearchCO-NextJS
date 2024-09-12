"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

import { normal, otherFeatures, supports } from "@/constants/pricing-details";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Ready to scale your business?"
          paragraph="Lock in your lifetime discount of 10% when buying for a year!"
          center
          width="665px"
        />

        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsMonthly(true)}
              className={`${isMonthly
                ? "pointer-events-none text-primary"
                : "text-dark dark:text-white"
                } mr-4 cursor-pointer text-base font-semibold`}
            >
              Monthly
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${isMonthly ? "" : "translate-x-full"
                    } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${isMonthly
                ? "text-dark dark:text-white"
                : "pointer-events-none text-primary"
                } ml-4 cursor-pointer text-base font-semibold`}
            >
              Yearly
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-2">
            <PricingBox
              packageName="Starter"
              price={isMonthly ? "0" : "0"}
              duration={isMonthly ? "mo" : "yr"}
              subtitle="Enjoy your free trial."
            >
              <OfferList text="ChatGPT" status="active" />
              <OfferList text="Google Gemini" status="inactive" />
              <OfferList text="Perplexity" status="inactive" />
              <OfferList text="Google Search" status="active" />
              <OfferList text="File Search" status="inactive" />
              <OfferList text="Website Search" status="inactive" />
              <OfferList text="AI Assistants" status="inactive" />
              <OfferList text="Website CustomGPT Integration" status="inactive" />
              <OfferList text="100 Free Prompts" status="active" />
              <OfferList text="Custom Prompt" status="active" />
              <OfferList text="Prompt Sharing" status="inactive" />
            </PricingBox>
            <PricingBox
              packageName="Pro"
              price={isMonthly ? "9" : "98"}
              duration={isMonthly ? "mo" : "yr"}
              subtitle="Enjoy your pro subscription."
            >
              <OfferList text="ChatGPT" status="active" />
              <OfferList text="Google Gemini" status="active" />
              <OfferList text="Perplexity" status="active" />
              <OfferList text="Google Search" status="active" />
              <OfferList text="File Search" status="active" />
              <OfferList text="Website Search" status="active" />
              <OfferList text="AI Assistants" status="active" />
              <OfferList text="Website CustomGPT Integration" status="active" />
              <OfferList text="100 Free Prompts" status="active" />
              <OfferList text="Custom Prompt" status="active" />
              <OfferList text="Prompt Sharing" status="active" />
            </PricingBox>
            {/* <PricingBox
            packageName="Enterprise"
            price={isMonthly ? "50" : "540"}
            duration={isMonthly ? "mo" : "yr"}
            subtitle="Enjoy your enterprise subscription."
          >
            <OfferList text="Unlimited Prompts" status="active" />
            <OfferList text="Email & Website Support" status="active" />
            <OfferList text="Custom GPT API" status="active" />
            <OfferList text="Keyword Search" status="active" />
            <OfferList text="GPT-4+" status="active" />
            <OfferList text="Verified Prompts" status="active" />
          </PricingBox> */}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>


      {/* <div className='flex items-center flex-col mt-[100px] container'>
        <div className="text-[38px] mb-[40px] font-bold" >Compare plans</div>
        <table className='bg-[#FFFFFF] text-black border dark:text-white w-full shadow-three hover:shadow-one dark:bg-gray-dark dark:shadow-two dark:hover:shadow-gray-dark"'>
          <thead className='dark:border-gray-700'>
            <tr>
              <th className='text-center py-2 px-4 border-[1px] dark:border-gray-500'>Category</th>
              <th className='text-center py-2 px-4 border-[1px] dark:border-gray-500'>Content</th>
              <th className='text-center py-2 px-4 border-[1px] dark:border-gray-500'>Free</th>
              <th className='text-center py-2 px-4 border-[1px] dark:border-gray-500'>Pro</th>
              <th className='text-center py-2 px-4 border-[1px] dark:border-gray-500'>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {
              normal.map((item, index) => (
                <tr key={index}>
                  {index === 0 && <th className="py-2 px-4 text-center border-[1px] dark:border-gray-500" rowSpan={normal.length}>Normal</th>}
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">
                    {item.content}
                  </td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.free}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.pro}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.enterprise}</td>
                </tr>
              ))
            }
            {
              otherFeatures.map((item, index) => (
                <tr key={index}>
                  {index === 0 && <th className="py-2 px-4 text-center border-[1px] dark:border-gray-500" rowSpan={otherFeatures.length}>Other Features(Timeline)</th>}
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">
                    {item.content}
                  </td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.free}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.pro}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.enterprise}</td>
                </tr>
              ))
            }
            {
              supports.map((item, index) => (
                <tr key={index}>
                  {index === 0 && <th className="py-2 px-4 text-center border-[1px] dark:border-gray-500" rowSpan={supports.length}>Support</th>}
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">
                    {item.content}
                  </td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.free}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.pro}</td>
                  <td className="py-2 px-4 text-center border-[1px] dark:border-gray-500">{item.enterprise}</td>
                </tr>
              ))
            }
          </tbody>

        </table>
      </div> */}
    </section>
  );
};

export default Pricing;
