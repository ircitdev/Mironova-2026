import React from 'react';
import { CONFIG } from './config';

const OfferTemplate = ({ serviceName, price, terms, isEn }: { serviceName: string, price: string, terms: React.ReactNode, isEn: boolean }) => (
    <div className="space-y-6 text-sm text-[#1A202C] dark:text-white leading-relaxed font-sans">
        <h1 className="text-2xl font-serif text-center mb-6">{isEn ? 'Contract-Offer' : 'Счет-оферта'}</h1>

        {/* Bank Details Table */}
        <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-[10px] md:text-xs bg-white dark:bg-[#151E32]">
                <tbody>
                    <tr>
                        <td colSpan={2} rowSpan={2} className="border border-gray-300 p-2 align-top">{isEn ? "Recipient's Bank:" : "Банк получателя:"} ___________________________</td>
                        <td className="border border-gray-300 p-2">{isEn ? "BIC" : "БИК"}</td>
                        <td className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">{isEn ? "Corr. Acc." : "К/с банка"}</td>
                        <td className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">{isEn ? "INN" : "ИНН"} {CONFIG.LEGAL.INN}</td>
                        <td className="border border-gray-300 p-2">{isEn ? "Recipient's Acc." : "Счет получателя"}</td>
                        <td colSpan={2} className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="border border-gray-300 p-2">{isEn ? "Recipient:" : "Получатель:"} {CONFIG.LEGAL.NAME}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="mb-4 text-xs">
            <p className="mb-2"><strong>{isEn ? "Contractor:" : "Исполнитель:"}</strong> {isEn ? "Sole Proprietor" : "Индивидуальный предприниматель"} {CONFIG.LEGAL.NAME} ({isEn ? "OGRNIP" : "ОГРНИП"} {CONFIG.LEGAL.OGRNIP})</p>
            <p><strong>{isEn ? "Customer/Consumer:" : "Заказчик/Потребитель:"}</strong> {isEn ? "This invoice-offer is an offer in accordance with Art. 435 of the Civil Code of the Russian Federation." : "Настоящий счет-оферта в соответствии с положениями ст. 435 ГК РФ является офертой и адресован любому лицу, являющемуся резидентом РФ, которое акцептует ее условия."}</p>
        </div>

        <p className="text-xs">{isEn ? "The Contractor undertakes to provide services, and the Customer undertakes to accept and pay for them:" : "В соответствии с настоящим Счетом-офертой Исполнитель обязуется предоставить Заказчику услуги, а Заказчик/Потребитель принять и оплатить их:"}</p>

        {/* Service Table */}
        <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-[10px] md:text-xs bg-white dark:bg-[#151E32]">
                <thead>
                    <tr className="bg-gray-50 dark:bg-white/5">
                        <th className="border border-gray-300 p-2 text-left font-bold">N</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">{isEn ? "Service Name" : "Наименование услуги"}</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">{isEn ? "Qty" : "Кол-во"}</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">{isEn ? "Unit" : "Ед."}</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">{isEn ? "Price, rub." : "Цена, руб."}</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">{isEn ? "Total, rub." : "Стоимость, руб."}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">{serviceName}</td>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">{isEn ? "pc" : "шт."}</td>
                        <td className="border border-gray-300 p-2">{price}</td>
                        <td className="border border-gray-300 p-2">{price}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="border border-gray-300 p-2 text-right font-bold">{isEn ? "Total:" : "Итого:"}</td>
                        <td className="border border-gray-300 p-2 font-bold">{price}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p className="font-bold text-sm mb-6">{isEn ? "Total due:" : "Итого к оплате:"} {price} {isEn ? "rubles 00 kopeks." : "рублей 00 копеек."}</p>

        <div className="text-xs space-y-3 opacity-90 leading-relaxed">
            {terms}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-wrap justify-between gap-8 text-xs">
            <div className="w-full md:w-[45%]">
                <p><strong>{isEn ? "Contractor Details:" : "Сведения об Исполнителе:"}</strong><br/>
                {isEn ? "Sole Proprietor" : "Индивидуальный предприниматель"}<br/>
                {CONFIG.LEGAL.NAME}<br/>
                {isEn ? "OGRNIP" : "ОГРНИП"} {CONFIG.LEGAL.OGRNIP}<br/>
                {isEn ? "INN" : "ИНН"} {CONFIG.LEGAL.INN}<br/>
                e-mail: {CONFIG.CONTACTS.EMAIL}<br/>
                Tel: {CONFIG.CONTACTS.PHONE}</p>
            </div>
            <div className="w-full md:w-[45%]">
                <p><strong>{isEn ? "Bank Details:" : "Банковские реквизиты:"}</strong><br/>
                {isEn ? "Recipient:" : "Получатель:"} {CONFIG.LEGAL.NAME}<br/>
                Acc: ___________________________<br/>
                Corr: ___________________________<br/>
                INN: __________________________<br/>
                BIC: __________________________</p>
            </div>
        </div>
        
        <div className="mt-8 font-bold border-t border-dashed border-gray-300 pt-4 inline-block pr-20">
            {CONFIG.LEGAL.NAME}
        </div>
    </div>
);

export const LegalContent = ({ activeTab, language }: { activeTab: number, language: string }) => {
    const isEn = language === 'en';
    switch (activeTab) {
      case 0: return (
        <OfferTemplate 
            isEn={isEn}
            serviceName={isEn ? "Service and information support for organizing surgical treatment" : "Сервисно-информационное обслуживание Заказчика по организации хирургического лечения Заказчика в медицинской организации"}
            price="50 000,00"
            terms={
                isEn ? (
                    <>
                        <p>The Contractor provides information about the possibility and procedure for scheduling surgery, the scope of pre-hospital examinations, and the characteristics of the preparation and post-operative period. The service includes booking the date and time of the operating room.</p>
                        <p>By paying this invoice, the Customer confirms awareness that the Contractor uses the funds to purchase consumables required for the operation.</p>
                        <p>Funds are generally non-refundable except in documented medical inability to perform surgery or Contractor's withdrawal from the case.</p>
                    </>
                ) : (
                    <>
                        <p>В рамках оказания Услуг Исполнитель обязуется предоставить Заказчику/Потребителю информацию о возможности и порядке записи на операцию, объеме догоспитальных исследований и особенностях подготовки и послеоперационного периода, ответить на вопросы о существующих в научной и клинической литературе методах обследования и лечения, забронировать дату и время операционной для оказания медицинской помощи Заказчику/ Потребителю, при необходимости разрешить вопрос о привлечении дополнительного медицинского персонала.</p>
                        <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает, что Исполнитель уведомил его о том, что на внесенную им сумму денежных средств Исполнитель, в том числе, закупает расходный материал, необходимый для выполнения показанной и согласованной операции, и выполняет иные действия для последующего оказания Заказчику/ Потребителю медицинских услуг.</p>
                    </>
                )
            }
        />
      );
      case 1: 
      case 2: return (
        <OfferTemplate 
            isEn={isEn}
            serviceName={isEn ? "Service and information consultation before medical care" : "Сервисно-информационная консультация перед началом получения медицинской помощи в медицинской организации («Услуга»)"}
            price="5 000,00"
            terms={
                isEn ? (
                    <>
                        <p>The Contractor provides consultation services via telecommunication or in person. This consultation is not a medical service.</p>
                        <p>Payment constitutes a 100% deposit for the service. The service is completed within 30 days of payment.</p>
                    </>
                ) : (
                    <>
                        <p>Исполнитель оказывает Заказчику Услуги, а Заказчик обязуется оплатить эти Услуги в порядке, сроки и на условиях, предусмотренных настоящим Счетом-офертой.</p>
                        <p>В рамках консультации Исполнитель обязуется предоставить Заказчику информацию о возможности записи на консультацию врача в клинику.</p>
                    </>
                )
            }
        />
      );
      case 3: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">{isEn ? "Payment Methods" : "Оплата услуг"}</h2>
            <p>{isEn ? "We support modern online payment methods including:" : "Для вашего удобства мы поддерживаем современные способы онлайн-оплаты. Принимаются карты систем:"}</p>
            <div className="flex gap-6 items-center my-6">
                <span className="text-2xl font-bold text-[#1a1f71]">VISA</span>
                <span className="text-2xl font-bold text-[#eb001b]">MasterCard</span>
                <span className="text-2xl font-bold text-[#00b140]">MIR</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-4 text-xs">
                <strong>{isEn ? "Security:" : "Безопасность:"}</strong> {isEn ? "All payments are processed via a secure PCI DSS gateway with SSL encryption." : "Все платежи обрабатываются через защищенный шлюз по международному стандарту PCI DSS. Данные передаются в зашифрованном виде (SSL)."}
            </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">{isEn ? "Service Terms" : "Формат и сроки оказания услуг"}</h2>
            <p>{isEn ? "Sole Proprietor Mironova E.A. provides information services. Physical shipping is not applicable." : "ИП Миронова Е.А. предоставляет сервисно-информационное обслуживание. Физическая доставка товаров не предусмотрена."}</p>
            <ul className="list-disc pl-5 space-y-3">
                <li><strong>{isEn ? "Remote:" : "Дистанционно:"}</strong> {isEn ? "Consultations via Zoom, WhatsApp, Telegram, or Phone." : "Консультации проводятся онлайн (Zoom, WhatsApp, Telegram, Телефон)."}</li>
                <li><strong>{isEn ? "In-person:" : "Очно:"}</strong> {isEn ? "By appointment in Moscow clinics." : "По предварительной записи в партнерских клиниках г. Москвы."}</li>
            </ul>
        </div>
      );
      case 5: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">{isEn ? "Privacy Policy" : "Персональные данные"}</h2>
            <p>{isEn ? "We comply with Federal Law No. 152 'On Personal Data'. Your data is used only for quality service provision." : "Мы соблюдаем ФЗ-152 «О персональных данных». Ваши данные используются только для качественного оказания услуг."}</p>
        </div>
      );
      case 6: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">{isEn ? "Cancellations & Refunds" : "Отмена и возврат"}</h2>
            <p>{isEn ? "Refunds are processed back to the original payment method within 1-30 business days depending on your bank." : "Денежные средства возвращаются на ту же банковскую карту, с которой производилась оплата. Срок зачисления — от 1 до 30 рабочих дней."}</p>
        </div>
      );
      default: return null;
    }
};