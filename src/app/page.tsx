"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";

import instance from "@/utils/instance";
import { Calendar, University } from "@/utils/response";

import Guest from "./guest";

const Home = () => {
  const [current, setCurrent] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const { data: events, isFetching: isEventsLoading } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const res = await instance.get<Calendar[]>("/calendar");
      return res.data;
    },
    initialData: [],
  });
  const { data: universities, isFetching: isUnivLoading } = useQuery({
    queryKey: ["university"],
    queryFn: async () => {
      const res = await instance.get<University[]>("/university");
      return res.data;
    },
    initialData: [],
  });

  const filteredEvents = React.useMemo(() => events
    .filter((event) => {
      if (current.length === 0) return true;
      return current.includes(event.university.id);
    })
    .filter((event) => {
      if (query.length === 0) return true;
      return event.title.includes(query) || event.guests.some((guest) => guest.name.includes(query)) || event.university.name.includes(query);
    })
    .filter((event) => {
      if (startDate.length === 0 && endDate.length === 0) return true;
      const date = dayjs(event.date);
      if (startDate.length > 0 && endDate.length > 0) {
        return (date.isAfter(dayjs(startDate)) || date.isSame(dayjs(startDate))) && (date.isBefore(dayjs(endDate)) || date.isSame(dayjs(endDate)));
      } else if (startDate.length > 0) {
        return (date.isAfter(dayjs(startDate)) || date.isSame(dayjs(startDate)));
      } else if (endDate.length > 0) {
        return (date.isBefore(dayjs(endDate)) || date.isSame(dayjs(endDate)));
      }
    }), [events, current, query, startDate, endDate]);

  return (
    <div className="bg-key/5 min-h-full w-full flex flex-col items-start justify-start gap-4 overflow-x-hidden p-4">
      <div className="flex flex-row items-center justify-start gap-2 w-full">
        <svg className="w-5 h-5" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-key/70" d="M4.63672 19.8801C3.97005 19.8801 3.43672 19.6092 3.03672 19.0676C2.63672 18.5259 2.50339 17.9134 2.63672 17.2301C2.82005 16.3801 2.94505 15.5301 3.01172 14.6801C3.07839 13.8301 3.12005 12.9801 3.13672 12.1301C2.45339 11.8634 1.90755 11.4384 1.49922 10.8551C1.09089 10.2717 0.886719 9.61341 0.886719 8.88008V8.18008C0.886719 7.79675 0.999219 7.44675 1.22422 7.13008C1.44922 6.81341 1.74505 6.58008 2.11172 6.43008C3.69505 5.79675 5.18672 5.01341 6.58672 4.08008C7.98672 3.14674 9.33672 2.13008 10.6367 1.03008C10.8201 0.880078 11.0159 0.767578 11.2242 0.692578C11.4326 0.617578 11.6534 0.580078 11.8867 0.580078C12.1201 0.580078 12.3409 0.617578 12.5492 0.692578C12.7576 0.767578 12.9534 0.880078 13.1367 1.03008C14.4367 2.13008 15.7867 3.14674 17.1867 4.08008C18.5867 5.01341 20.0784 5.79675 21.6617 6.43008C22.0284 6.58008 22.3242 6.81341 22.5492 7.13008C22.7742 7.44675 22.8867 7.79675 22.8867 8.18008V8.88008C22.8867 9.61341 22.6826 10.2717 22.2742 10.8551C21.8659 11.4384 21.3201 11.8634 20.6367 12.1301C20.6534 12.9801 20.6951 13.8301 20.7617 14.6801C20.8284 15.5301 20.9534 16.3801 21.1367 17.2301C21.2701 17.9134 21.1367 18.5259 20.7367 19.0676C20.3367 19.6092 19.8034 19.8801 19.1367 19.8801H4.63672ZM5.78672 6.88008H17.9867C16.8867 6.26341 15.8326 5.59675 14.8242 4.88008C13.8159 4.16341 12.8367 3.39675 11.8867 2.58008C10.9367 3.39675 9.95755 4.16341 8.94922 4.88008C7.94089 5.59675 6.88672 6.26341 5.78672 6.88008ZM14.3867 10.3801C14.8034 10.3801 15.1576 10.2342 15.4492 9.94258C15.7409 9.65091 15.8867 9.29675 15.8867 8.88008H12.8867C12.8867 9.29675 13.0326 9.65091 13.3242 9.94258C13.6159 10.2342 13.9701 10.3801 14.3867 10.3801ZM9.38672 10.3801C9.80339 10.3801 10.1576 10.2342 10.4492 9.94258C10.7409 9.65091 10.8867 9.29675 10.8867 8.88008H7.88672C7.88672 9.29675 8.03255 9.65091 8.32422 9.94258C8.61589 10.2342 8.97005 10.3801 9.38672 10.3801ZM4.38672 10.3801C4.80339 10.3801 5.15755 10.2342 5.44922 9.94258C5.74089 9.65091 5.88672 9.29675 5.88672 8.88008H2.88672C2.88672 9.29675 3.03255 9.65091 3.32422 9.94258C3.61589 10.2342 3.97005 10.3801 4.38672 10.3801ZM4.53672 17.8801H7.21172C7.36172 16.8801 7.47839 15.8884 7.56172 14.9051C7.64505 13.9217 7.71172 12.9301 7.76172 11.9301C7.59505 11.8467 7.44089 11.7592 7.29922 11.6676C7.15755 11.5759 7.02005 11.4634 6.88672 11.3301C6.65339 11.5634 6.38672 11.7634 6.08672 11.9301C5.78672 12.0967 5.47005 12.2217 5.13672 12.3051C5.10339 13.2551 5.04505 14.1926 4.96172 15.1176C4.87839 16.0426 4.73672 16.9634 4.53672 17.8801ZM9.23672 17.8801H14.5367C14.4034 16.9634 14.2992 16.0467 14.2242 15.1301C14.1492 14.2134 14.0867 13.2884 14.0367 12.3551C13.6201 12.3217 13.2284 12.2176 12.8617 12.0426C12.4951 11.8676 12.1701 11.6384 11.8867 11.3551C11.6034 11.6384 11.2784 11.8676 10.9117 12.0426C10.5451 12.2176 10.1534 12.3217 9.73672 12.3551C9.68672 13.2884 9.62422 14.2134 9.54922 15.1301C9.47422 16.0467 9.37005 16.9634 9.23672 17.8801ZM16.5617 17.8801H19.2367C19.0367 16.9634 18.8951 16.0426 18.8117 15.1176C18.7284 14.1926 18.6701 13.2551 18.6367 12.3051C18.3034 12.2217 17.9867 12.1009 17.6867 11.9426C17.3867 11.7842 17.1201 11.5801 16.8867 11.3301C16.7534 11.4634 16.6159 11.5759 16.4742 11.6676C16.3326 11.7592 16.1784 11.8467 16.0117 11.9301C16.0617 12.9301 16.1326 13.9217 16.2242 14.9051C16.3159 15.8884 16.4284 16.8801 16.5617 17.8801ZM19.3867 10.3801C19.8034 10.3801 20.1576 10.2342 20.4492 9.94258C20.7409 9.65091 20.8867 9.29675 20.8867 8.88008H17.8867C17.8867 9.29675 18.0326 9.65091 18.3242 9.94258C18.6159 10.2342 18.9701 10.3801 19.3867 10.3801Z" />
        </svg>
        <p className="font-semibold text-xl !text-key/70">2025 상반기 주요 대학 축제 일정</p>
        <a 
          href="https://www.notion.so/jeamxn/1e9c5871886a80cf97bed9bacd73e460?v=1e9c5871886a80398a29000c4e8851c1&pvs=4"
          target="_blank" rel="noreferrer"
        >
          {/* <p className="font-semibold text-xl !text-key/70 hover:underline">(달력보기)</p> */}
        </a>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-4 border border-key/10 py-4 rounded-2xl">
        <div className="flex flex-col items-start justify-start gap-2 w-full">
          <div className="flex flex-row items-center justify-start gap-1.5 w-full px-6">
            <svg className="w-4 h-4" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-key/50" d="M3.46412 13.7966C3.16929 13.6326 2.93821 13.4113 2.77087 13.1326C2.60354 12.854 2.51988 12.5414 2.51988 12.1949V7.85638L0.523875 6.75262C0.359708 6.65896 0.239208 6.54504 0.162375 6.41087C0.0853749 6.27687 0.046875 6.12787 0.046875 5.96387C0.046875 5.79987 0.0853749 5.65096 0.162375 5.51713C0.239208 5.38313 0.359708 5.26929 0.523875 5.17563L8.15887 1.01562C8.29437 0.940292 8.43396 0.884958 8.57762 0.849625C8.72129 0.814458 8.86871 0.796875 9.01987 0.796875C9.17104 0.796875 9.31846 0.814458 9.46212 0.849625C9.60579 0.884958 9.74554 0.940208 9.88138 1.01537L18.5044 5.70838C18.6582 5.79171 18.7762 5.90437 18.8584 6.04637C18.9404 6.18854 18.9814 6.34188 18.9814 6.50638V12.4064C18.9814 12.6189 18.9095 12.797 18.7656 12.9409C18.6218 13.0845 18.4436 13.1564 18.2311 13.1564C18.0185 13.1564 17.8404 13.0845 17.6969 12.9409C17.5532 12.797 17.4814 12.6189 17.4814 12.4064V6.79487L15.5199 7.85638V12.1949C15.5199 12.5414 15.4362 12.854 15.2689 13.1326C15.1015 13.4113 14.8705 13.6326 14.5756 13.7966L9.88337 16.3334C9.74621 16.4102 9.60579 16.4663 9.46212 16.5016C9.31846 16.5368 9.17104 16.5544 9.01987 16.5544C8.86871 16.5544 8.72129 16.5368 8.57762 16.5016C8.43396 16.4663 8.29354 16.4102 8.15637 16.3334L3.46412 13.7966ZM8.90438 9.60638C8.94938 9.63204 8.98946 9.64488 9.02462 9.64488C9.05996 9.64488 9.10004 9.63204 9.14487 9.60638L15.8604 5.96413L9.14487 2.33138C9.10004 2.30571 9.05996 2.29288 9.02462 2.29288C8.98946 2.29288 8.94938 2.30571 8.90438 2.33138L2.17938 5.96413L8.90438 9.60638ZM8.89487 15.0351C8.93971 15.0608 8.98137 15.0736 9.01987 15.0736C9.05837 15.0736 9.10004 15.0608 9.14487 15.0351L13.8756 12.4794C13.927 12.4474 13.9638 12.4105 13.9861 12.3689C14.0086 12.3272 14.0199 12.2743 14.0199 12.2101V8.65638L9.89863 10.9199C9.76146 10.9967 9.61921 11.0528 9.47188 11.0881C9.32438 11.1235 9.17371 11.1411 9.01987 11.1411C8.86604 11.1411 8.71538 11.1235 8.56788 11.0881C8.42054 11.0528 8.27829 10.9967 8.14113 10.9199L4.01988 8.65638V12.2101C4.01988 12.2615 4.03113 12.3112 4.05363 12.3594C4.07596 12.4074 4.11279 12.4474 4.16412 12.4794L8.89487 15.0351Z"/>
            </svg>
            <p className="!text-key/50 font-medium">대학 필터링 (가나다순)</p>
          </div>
          <div className="w-full py-2 -my-2">
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex flex-row flex-warp items-start justify-start gap-2 overflow-x-auto w-max">
                {
                  isUnivLoading ? 
                    Array(10).fill(0).map((_, index) => (
                      <div key={index} className="loading-background flex flex-row items-center justify-center rounded-2xl py-2 px-4 gap-1 border border-key/10 cursor-pointer h-[42px] w-36" />
                    )):
                    universities.map((univ) => (
                      <button 
                        key={univ.id} 
                        className={[
                          "flex flex-row items-center justify-center rounded-2xl py-2 px-4 gap-1 border border-key/10 cursor-pointer",
                          current.includes(univ.id) ? "bg-key/10" : "",
                        ].join(" ")}
                        onClick={() => {
                          if (current.includes(univ.id)) {
                            setCurrent((prev) => prev.filter((id) => id !== univ.id));
                          } else {
                            setCurrent((prev) => [...prev, univ.id]);
                          }
                        }}
                      >
                        <img src={univ.icon} alt={univ.name} className="w-5 h-5" />
                        <p className="font-medium">{univ.name}</p>
                      </button>
                    ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-start gap-2 px-4">
          <div className="flex flex-row items-center justify-start gap-1.5 w-full px-2">
            <svg className="w-4 h-4" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-key/50" d="M2.79212 19.5801C2.28696 19.5801 1.85938 19.4051 1.50938 19.0551C1.15938 18.7051 0.984375 18.2775 0.984375 17.7723V4.38784C0.984375 3.88268 1.15938 3.45509 1.50938 3.10509C1.85938 2.75509 2.28696 2.58009 2.79212 2.58009H4.17663V1.23384C4.17663 1.01468 4.25004 0.831677 4.39688 0.684843C4.54371 0.538177 4.72671 0.464844 4.94587 0.464844C5.16521 0.464844 5.34821 0.538177 5.49488 0.684843C5.64171 0.831677 5.71513 1.01468 5.71513 1.23384V2.58009H13.2921V1.21484C13.2921 1.00201 13.3639 0.82376 13.5074 0.680093C13.651 0.536593 13.8293 0.464844 14.0421 0.464844C14.255 0.464844 14.4331 0.536593 14.5766 0.680093C14.7203 0.82376 14.7921 1.00201 14.7921 1.21484V2.58009H16.1766C16.6818 2.58009 17.1094 2.75509 17.4594 3.10509C17.8094 3.45509 17.9844 3.88268 17.9844 4.38784V17.7723C17.9844 18.2775 17.8094 18.7051 17.4594 19.0551C17.1094 19.4051 16.6818 19.5801 16.1766 19.5801H2.79212ZM2.79212 18.0801H16.1766C16.2536 18.0801 16.3241 18.048 16.3881 17.9838C16.4523 17.9198 16.4844 17.8493 16.4844 17.7723V8.38784H2.48438V17.7723C2.48438 17.8493 2.51646 17.9198 2.58063 17.9838C2.64463 18.048 2.71512 18.0801 2.79212 18.0801ZM2.48438 6.88784H16.4844V4.38784C16.4844 4.31084 16.4523 4.24034 16.3881 4.17634C16.3241 4.11218 16.2536 4.08009 16.1766 4.08009H2.79212C2.71512 4.08009 2.64463 4.11218 2.58063 4.17634C2.51646 4.24034 2.48438 4.31084 2.48438 4.38784V6.88784Z"/>
            </svg>
            <p className="!text-key/50 font-medium">날짜 선택</p>
          </div>
          <div className="w-full flex flex-row max-sm:flex-col items-center justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2 w-full">
              <input 
                type="date"
                className="w-full border border-key/10 rounded-2xl px-4 py-3 outline-none"
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                value={startDate}
              />
              <p className="font-medium !text-key/30 whitespace-nowrap">부터</p>
            </div>
            <div className="flex flex-row items-center justify-start gap-2 w-full">
              <input 
                type="date"
                className="w-full border border-key/10 rounded-2xl px-4 py-3 outline-none"
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                value={endDate}
              />
              <p className="font-medium !text-key/30 whitespace-nowrap">까지</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-start gap-2 px-4">
          <div className="flex flex-row items-center justify-start gap-1.5 w-full px-2">
            <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-key/50" d="M14.397 18.3965C13.3895 18.3965 12.527 18.0382 11.8095 17.3215C11.0922 16.6048 10.7335 15.7433 10.7335 14.7368C10.7335 13.7304 11.0919 12.8693 11.8085 12.1533C12.5252 11.4373 13.3867 11.0793 14.393 11.0793C15.3995 11.0793 16.2608 11.437 16.9768 12.1525C17.6928 12.868 18.0508 13.7282 18.0508 14.733C18.0508 15.1095 17.9975 15.4655 17.891 15.801C17.7847 16.1365 17.6334 16.4478 17.4373 16.735L19.841 19.133C19.9155 19.1955 19.9714 19.2737 20.0085 19.3675C20.0457 19.4612 20.0643 19.5554 20.0643 19.6503C20.0643 19.7451 20.0457 19.8374 20.0085 19.9273C19.9714 20.0169 19.9155 20.1003 19.841 20.1773C19.7795 20.2403 19.7026 20.2906 19.6103 20.3283C19.5178 20.3661 19.4223 20.385 19.3238 20.385C19.2216 20.385 19.1259 20.3661 19.0365 20.3283C18.947 20.2906 18.8639 20.2403 18.7873 20.1773L16.3835 17.7985C16.0964 17.9945 15.7851 18.1432 15.4498 18.2445C15.1146 18.3458 14.7637 18.3965 14.397 18.3965ZM3.70453 18.406C2.69986 18.406 1.8397 18.048 1.12403 17.332C0.408531 16.616 0.0507812 15.7497 0.0507812 14.733C0.0507812 13.7282 0.408531 12.868 1.12403 12.1525C1.8397 11.437 2.69986 11.0793 3.70453 11.0793C4.7212 11.0793 5.58761 11.437 6.30378 12.1525C7.01978 12.868 7.37778 13.7282 7.37778 14.733C7.37778 15.7497 7.01978 16.616 6.30378 17.332C5.58761 18.048 4.7212 18.406 3.70453 18.406ZM3.70453 16.906C4.31236 16.906 4.82653 16.6958 5.24703 16.2753C5.66753 15.8548 5.87778 15.3407 5.87778 14.733C5.87778 14.1407 5.66753 13.6336 5.24703 13.2118C4.82653 12.7901 4.31236 12.5793 3.70453 12.5793C3.11236 12.5793 2.60536 12.7901 2.18353 13.2118C1.7617 13.6336 1.55078 14.1407 1.55078 14.733C1.55078 15.3407 1.7617 15.8548 2.18353 16.2753C2.60536 16.6958 3.11236 16.906 3.70453 16.906ZM14.397 16.906C14.9892 16.906 15.4962 16.6958 15.918 16.2753C16.3399 15.8548 16.5508 15.3407 16.5508 14.733C16.5508 14.1407 16.3399 13.6336 15.918 13.2118C15.4962 12.7901 14.9892 12.5793 14.397 12.5793C13.7892 12.5793 13.275 12.7901 12.8545 13.2118C12.434 13.6336 12.2238 14.1407 12.2238 14.733C12.2238 15.3407 12.434 15.8548 12.8545 16.2753C13.275 16.6958 13.7892 16.906 14.397 16.906ZM3.70453 7.733C2.69986 7.733 1.8397 7.375 1.12403 6.659C0.408531 5.943 0.0507812 5.07667 0.0507812 4.06C0.0507812 3.05517 0.408531 2.195 1.12403 1.4795C1.8397 0.764 2.69986 0.40625 3.70453 0.40625C4.7212 0.40625 5.58761 0.764 6.30378 1.4795C7.01978 2.195 7.37778 3.05517 7.37778 4.06C7.37778 5.07667 7.01978 5.943 6.30378 6.659C5.58761 7.375 4.7212 7.733 3.70453 7.733ZM14.397 7.733C13.3804 7.733 12.5139 7.375 11.7978 6.659C11.0818 5.943 10.7238 5.07667 10.7238 4.06C10.7238 3.05517 11.0818 2.195 11.7978 1.4795C12.5139 0.764 13.3804 0.40625 14.397 0.40625C15.4017 0.40625 16.2619 0.764 16.9775 1.4795C17.693 2.195 18.0508 3.05517 18.0508 4.06C18.0508 5.07667 17.693 5.943 16.9775 6.659C16.2619 7.375 15.4017 7.733 14.397 7.733ZM3.70453 6.233C4.31236 6.233 4.82653 6.02275 5.24703 5.60225C5.66753 5.18175 5.87778 4.66767 5.87778 4.06C5.87778 3.46767 5.66753 2.96058 5.24703 2.53875C4.82653 2.11692 4.31236 1.906 3.70453 1.906C3.11236 1.906 2.60536 2.11692 2.18353 2.53875C1.7617 2.96058 1.55078 3.46767 1.55078 4.06C1.55078 4.66767 1.7617 5.18175 2.18353 5.60225C2.60536 6.02275 3.11236 6.233 3.70453 6.233ZM14.397 6.233C14.9892 6.233 15.4962 6.02275 15.918 5.60225C16.3399 5.18175 16.5508 4.66767 16.5508 4.06C16.5508 3.46767 16.3399 2.96058 15.918 2.53875C15.4962 2.11692 14.9892 1.906 14.397 1.906C13.7892 1.906 13.275 2.11692 12.8545 2.53875C12.434 2.96058 12.2238 3.46767 12.2238 4.06C12.2238 4.66767 12.434 5.18175 12.8545 5.60225C13.275 6.02275 13.7892 6.233 14.397 6.233Z" />
            </svg>
            <p className="!text-key/50 font-medium">검색하기</p>
          </div>
          <input 
            type="text" 
            placeholder="검색어를 입력하세요"
            className="w-full border border-key/10 rounded-2xl px-4 py-3 outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-stretch justify-start gap-2 overflow-x-auto w-full rounded-2xl">
        {
          isEventsLoading ? 
            Array(20).fill(0).map((_, index) => (
              <div key={index} className="loading-background min-h-60 flex flex-col p-4 border border-key/10 rounded-2xl max-sm:w-full max-md:w-[calc(50%-0.3rem)] max-lg:w-[calc(100%/3-0.4rem)] w-[calc(25%-0.4rem)] gap-2" />
            )) :
            filteredEvents.length ? filteredEvents.map((event) => (
              <div key={event.id} className="flex flex-col p-4 border border-key/10 rounded-2xl max-sm:w-full max-md:w-[calc(50%-0.3rem)] max-lg:w-[calc(100%/3-0.4rem)] w-[calc(25%-0.4rem)] gap-2">
                <div className="w-full flex flex-row items-center justify-between gap-2">
                  <a 
                    href={`https://jeamxn.notion.site/3-${event.id.replaceAll("-", "")}`}
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <div className="flex flex-row items-center justify-start gap-1 hover:underline cursor-pointer">
                      <img src={event.university.icon} alt={event.university.name} className="w-5 h-5" />
                      <p className="font-medium whitespace-nowrap">{event.title}</p>
                    </div>
                  </a>
                  <p className="font-medium !text-key/50 whitespace-nowrap">{dayjs(event.date).format("MM월 DD일")}</p>
                </div>
                {
                  event.guests.length ? (
                    <div>
                      {
                        event.guests.map((guest) => <Guest key={guest.id} guest={guest} />)
                      }
                    </div>
                  ) : (
                    <p className="!text-key/50">공개된 게스트가 아직 없어요!</p>
                  )
                }
              </div>
            )) : (
              <div className="w-full flex flex-col items-start justify-start gap-1 pt-4">
                <p className="!text-key/50 px-4">등록된 축제 일정이 없어요!</p>
              </div>
            )
        }
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-1 px-4 py-4">
        <p className="!text-key/45 text-sm">하나하나 손으로 입력하는거라 오류가 있을 수 있어요!</p>
        <p className="!text-key/45 text-sm">잘못된 정보 또는 문제가 될 수 있는 정보가 있다면 <a href="https://open.kakao.com/me/Jeamxn" className="underline !text-key/45 text-sm" target="_blank" rel="noreferrer">여기</a>로 연락해주세요!</p>
        <p className="!text-key/45 text-sm">이 프로젝트는 오픈소스입니다! 여러분들도 <a href="https://github.com/jeamxn/univ-festa" className="underline !text-key/45 text-sm" target="_blank" rel="noreferrer">여기</a>에서 기여할 수 있어요!</p>
      </div>
    </div>
  );
};

export default Home;