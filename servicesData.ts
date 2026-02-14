import { TranslationType } from './translations';

export const getServicesData = (t: TranslationType) => [
    {
        id: 'face',
        title: t.booking.ops.face,
        image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_3-e1737163706465.jpg',
        intro: t.about.quote2, 
        services: [
            { title: "SMAS Facelift", desc: "Comprehensive face and neck lift." },
            { title: "Blepharoplasty", desc: "Eyelid correction." }
        ],
        prices: [{ name: "SMAS Facelift", price: "from 800k ₽" }],
        benefits: [t.about.stats.safety, t.about.stats.ops]
    },
    {
        id: 'breast',
        title: t.booking.ops.breast,
        image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_4.jpg',
        intro: t.about.quote2,
        services: [
                { title: "Augmentation", desc: "Implants or fat transfer." },
                { title: "Lift", desc: "Mastopexy." }
        ],
        prices: [{ name: "Augmentation", price: "from 550k ₽" }],
        benefits: [t.about.stats.safety]
    },
    {
        id: 'body',
        title: t.booking.ops.body,
        image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_1-e1737165789945.jpg',
        intro: t.about.quote2,
        services: [
            { title: "Liposuction", desc: "Body contouring." },
            { title: "Abdominoplasty", desc: "Tummy tuck." }
        ],
        prices: [{ name: "Liposuction", price: "from 150k ₽" }],
        benefits: [t.about.stats.safety]
    }
];