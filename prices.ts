export const getPrices = (language: 'ru' | 'en') => {
    if (language === 'en') {
        return [
          {
            category: "Face",
            items: [
              { name: "SMAS Facelift", price: "800k ₽", note: "(face, chin, neck)" },
              { name: "Platysmaplasty", price: "200k ₽" },
              { name: "Brow Lift", price: "350k ₽", note: "temporal lift" },
              { name: "Endoscopic Forehead Lift", price: "450k ₽" },
              { name: "Check-lift", price: "350k ₽", note: "(mid-face lift)" },
              { name: "Lower Blepharoplasty", price: "250k ₽" },
              { name: "Lower Blepharoplasty", price: "200k ₽", note: "transconjunctival" },
              { name: "Upper Blepharoplasty", price: "200k ₽" },
              { name: "Bichat Fat Pad Removal", price: "150k ₽" },
              { name: "Bullhorn Lip Lift", price: "150k ₽" },
              { name: "Chin Liposuction", price: "150k ₽" },
              { name: "Periorbitoplasty", price: "550k ₽", note: "category 1" },
              { name: "Periorbitoplasty", price: "650k ₽", note: "category 2" },
            ]
          },
          {
            category: "Body",
            items: [
              { name: "Mini Abdominoplasty", price: "500k ₽" },
              { name: "Full Abdominoplasty", price: "650k ₽", note: "with diastasis repair and navel plasty" },
              { name: "Abdominal Liposuction", price: "450k ₽" },
              { name: "Flank Liposuction", price: "300k ₽" },
              { name: "Back Liposuction", price: "300k ₽" },
              { name: "Chin Liposuction", price: "150k ₽" },
              { name: "Inner Thigh Liposuction", price: "150k ₽" },
              { name: "Saddlebag Liposuction", price: "150k ₽" },
              { name: "Wither Liposuction", price: "150k ₽" },
              { name: "Arm Liposuction", price: "150k ₽" },
              { name: "Buttock Lipofilling", price: "350k ₽" },
              { name: "Brachioplasty", price: "650k ₽" },
            ]
          },
          {
            category: "Breast",
            items: [
              { name: "Primary Breast Augmentation", price: "550k ₽" },
              { name: "Implant", price: "108k ₽" },
              { name: "Implant", price: "140k ₽", note: "Mentor round Anatomy" },
              { name: "Implant", price: "130k ₽" },
              { name: "Implant", price: "158k ₽", note: "Silimed round Anatomy" },
              { name: "Breast Lift and Correction", price: "550k ₽", note: "without implants size 3-5" },
              { name: "Breast Lift and Correction", price: "650k ₽", note: "without implants size 6-9" },
              { name: "Breast Lift and Correction", price: "750k ₽", note: "without implants size 10-15" },
              { name: "Breast Lift and Correction", price: "from 750k ₽", note: "with implant augmentation" },
              { name: "Breast Re-endoprosthetics", price: "from 950k ₽", note: "(implant replacement) + lift" },
              { name: "Implant Removal", price: "500k ₽" },
              { name: "Implant Removal", price: "600-800k ₽" },
            ]
          },
          {
            category: "Additional Services",
            items: [
              { name: "Preoperative Tests Complex", price: "from 25k ₽" },
              { name: "Compression Garments", price: "5-15k ₽" },
              { name: "Single Room", price: "40k ₽", note: "(must be booked 2 months in advance)" },
              { name: "Anesthesia", price: "150k ₽", note: "+ Ward (24h) + Duty Doctor + ICU + Prescriptions + Dressings + Meals" },
            ]
          }
        ];
    }
    // Russian default
    return [
      {
        category: "Лицо",
        items: [
          { name: "SMAS подтяжка", price: "800 т.р.", note: "(лицо, подбородок, шея)" },
          { name: "Платизмапластика", price: "200 т.р." },
          { name: "Подтяжка бровей", price: "350 т.р.", note: "через висок (височный лифтинг)" },
          { name: "Эндоскопия лба", price: "450 т.р." },
          { name: "Чек-лифтинг", price: "350 т.р.", note: "(подтяжка средней трети лица)" },
          { name: "Нижняя блефаропластика", price: "250 т.р." },
          { name: "Нижняя блефаропластика", price: "200 т.р.", note: "трансконъюктивальная" },
          { name: "Верхняя блефаропластика", price: "200 т.р." },
          { name: "Удаления комков Биша", price: "150 т.р." },
          { name: "Буллхорн", price: "150 т.р." },
          { name: "Липосакция подбородка", price: "150 т.р." },
          { name: "Переорбитапластика", price: "550 т.р.", note: "1 категория" },
          { name: "Переорбитапластика", price: "650 т.р.", note: "2 категория" },
        ]
      },
      {
        category: "Тело",
        items: [
          { name: "Миниабдоминопластика", price: "500 т.р." },
          { name: "Полная Абдоминопластика", price: "650 т.р.", note: "с ушиванием диастаза и пластикой пупка" },
          { name: "Липосакции живота", price: "450 т.р." },
          { name: "Липосакции фланков", price: "300 т.р." },
          { name: "Липосакция Спины", price: "300 т.р." },
          { name: "Липосакция Подбородка", price: "150 т.р." },
          { name: "Липосакция внутренней части бедер", price: "150 т.р." },
          { name: "Липосакция Галифе", price: "150 т.р." },
          { name: "Липосакция Холки", price: "150 т.р." },
          { name: "Липосакция рук", price: "150 т.р." },
          { name: "Липофилинг ягодиц", price: "350 т.р." },
          { name: "Брахиопластика", price: "650 т.р." },
        ]
      },
      {
        category: "Грудь",
        items: [
          { name: "Первичное увеличения груди", price: "550 т.р." },
          { name: "Имплантат", price: "108 т.р." },
          { name: "Имплантат", price: "140 т.р.", note: "Mentor круглые Анатомия" },
          { name: "Имплантат", price: "130 т.р." },
          { name: "Имплантат", price: "158 т.р.", note: "silimed круглые Анатомия" },
          { name: "Подтяжка и коррекция груди", price: "550 т.р.", note: "без имплантов 3-5 размер" },
          { name: "Подтяжка и коррекция груди", price: "650 т.р.", note: "без имплантов 6-9 размер" },
          { name: "Подтяжка и коррекция груди", price: "750 т.р.", note: "без имплантов 10-15" },
          { name: "Подтяжка и коррекция груди", price: "от 750 т.р.", note: "с увеличением имплантами" },
          { name: "Реэндопротезирование груди", price: "от 950 т.р.", note: "(замена имплантов) + подтяжка" },
          { name: "Удаление имплантов", price: "500 т.р." },
          { name: "Удаление имплантов", price: "от 600 до 800 т.р." },
        ]
      },
      {
        category: "Дополнительные услуги",
        items: [
          { name: "Предоперационный комплекс анализов", price: "от 25 т.р." },
          { name: "Компрессионное белье", price: "от 5 до 15 т.р." },
          { name: "Однаместная палата", price: "40 т.р.", note: "(бронировать надо за 2 месяца до операции)" },
          { name: "Наркоз", price: "150 т.р.", note: "+ Палата сутки + Дежурный врач (анестезиолог-реаниматолог) + ПИТ + Назначения + Перевязки + Питание" },
        ]
      }
    ];
};