import React from 'react';
import { TranslationType } from './translations';

export const getDoctorAccordionItems = (t: TranslationType) => [
    {
      id: "practice",
      title: t.doctor.sections.practice,
      content: (
        <div className="space-y-4">
          <p className="font-light text-[#5A6A7A] dark:text-[#94A3B8]">{t.doctor.content.practiceInit}</p>
          <ul className="space-y-2 list-disc pl-5 text-[#1A202C] dark:text-white">
            {t.doctor.content.practiceList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "education",
      title: t.doctor.sections.education,
      content: (
        <ul className="space-y-3 text-[#1A202C] dark:text-white">
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             ФГАОУ ВО РНИМУ им. Н. И. Пирогова Минздрава России (Москва)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             ФГБОУ ДПО РМАНПО Минздрава России (Москва)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             Villa Bella Clinic (Salò, Италия)
           </li>
        </ul>
      )
    },
    {
      id: "publications",
      title: t.doctor.sections.publications,
      content: (
        <ul className="space-y-3 text-[#1A202C] dark:text-white">
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             14-ый международный конкурс учёных WIMC (Варшава 2018 г.)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             24-ый международный конгресс EACMF (Мюнхен, 2018 г.)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             25-ый международный конгресс EACMF (Париж, 2020 г.)
           </li>
        </ul>
      )
    }
];