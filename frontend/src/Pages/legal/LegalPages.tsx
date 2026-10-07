import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const effectiveDate = "7 October 2026";
const supportEmail = "[add your support email]";
const businessAddress = "[add your registered business address]";

type PolicyShellProps = {
  label: string;
  title: string;
  intro: string;
  children: ReactNode;
};

const PolicyShell = ({ label, title, intro, children }: PolicyShellProps) => (
  <section className="bg-slate-50 px-6 py-12 sm:px-8 lg:py-16">
    <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_right,_rgba(219,234,254,.9),_transparent_24rem)] px-6 py-10 sm:px-10">
        <p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">CloudPrint legal · {label}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">{intro}</p>
        <p className="mt-5 text-sm font-medium text-slate-500">Effective date: {effectiveDate}</p>
      </header>
      <div className="space-y-9 px-6 py-10 text-sm leading-7 text-slate-600 sm:px-10 sm:text-[0.95rem]">{children}</div>
      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-10"><p className="text-sm text-slate-600">Questions about this policy? Contact us at <a className="font-semibold text-blue-600 hover:text-blue-700" href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p></footer>
    </article>
  </section>
);

const PolicySection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="text-lg font-bold text-slate-950">{title}</h2>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const PolicyList = ({ children }: { children: ReactNode }) => <ul className="list-disc space-y-1.5 pl-5 marker:text-blue-500">{children}</ul>;

const PlaceholderNotice = () => (
  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
    <strong>Before publishing:</strong> replace the bracketed contact details with your legal business name, registered address, support email, and support phone number. Have these policies reviewed for your business and jurisdiction.
  </div>
);

export const PrivacyPolicyPage = () => (
  <PolicyShell label="Privacy policy" title="Privacy Policy" intro="This policy explains how CloudPrint handles information when you create an account, upload a document, place a print order, or make a payment.">
    <PlaceholderNotice />
    <PolicySection title="1. Information we collect"><PolicyList><li>Account information, such as your name, email address, phone number, university details, and login information.</li><li>Order information, including print preferences, pickup location, order status, and support messages.</li><li>Documents and files you upload for printing. We use them only to process and fulfil your print order.</li><li>Transaction information, including payment status, amount, and payment reference.</li><li>Technical information such as device, browser, IP address, and cookie preferences where applicable.</li></PolicyList></PolicySection>
    <PolicySection title="2. How we use information"><PolicyList><li>To create and manage your account, process orders, print files, and notify you about order status.</li><li>To provide customer support, prevent fraud or misuse, and improve the service.</li><li>To meet legal, accounting, tax, or regulatory requirements.</li><li>To send service-related messages. We will only send marketing messages where permitted or with the required consent.</li></PolicyList></PolicySection>
    <PolicySection title="3. Payments"><p>Payments are processed through Razorpay or another authorised payment provider. CloudPrint does not store full card numbers, UPI credentials, or other payment-instrument credentials. We receive only the information needed to confirm and reconcile your payment.</p></PolicySection>
    <PolicySection title="4. When we share information"><p>We share only what is necessary with the print shop fulfilling your order, payment providers, technology vendors supporting our service, and authorities where required by law. We do not sell personal information.</p></PolicySection>
    <PolicySection title="5. Retention and security"><p>We retain information for as long as needed to fulfil orders, provide support, comply with legal obligations, and resolve disputes. Print files are accessible only to authorised people and systems involved in fulfilment. No online service can guarantee absolute security, but we use reasonable safeguards appropriate to the data we process.</p></PolicySection>
    <PolicySection title="6. Your choices"><p>You may request access, correction, or deletion of your personal information, subject to applicable law and legitimate retention needs. To make a request, contact <a className="font-semibold text-blue-600" href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p></PolicySection>
    <PolicySection title="7. Changes to this policy"><p>We may update this policy to reflect changes in our practices, services, or legal requirements. The latest version and effective date will be posted on this page.</p></PolicySection>
    <PolicySection title="8. Contact"><p>CloudPrint: {businessAddress}<br />Support: <a className="font-semibold text-blue-600" href={`mailto:${supportEmail}`}>{supportEmail}</a></p></PolicySection>
  </PolicyShell>
);

export const TermsOfUsePage = () => (
  <PolicyShell label="Terms & conditions" title="Terms of Use" intro="These terms govern your use of CloudPrint, including account access, document upload, print orders, pickup, and payment.">
    <PlaceholderNotice />
    <PolicySection title="1. Acceptance of these terms"><p>By creating an account, submitting a document, placing an order, or using CloudPrint, you agree to these Terms of Use, our <Link className="font-semibold text-blue-600" to="/privacy-policy">Privacy Policy</Link>, <Link className="font-semibold text-blue-600" to="/refund-policy">Refund Policy</Link>, and <Link className="font-semibold text-blue-600" to="/cookie-policy">Cookie Policy</Link>.</p></PolicySection>
    <PolicySection title="2. Accounts and eligibility"><p>You are responsible for providing accurate account information and keeping your login credentials confidential. You must not allow another person to use your account or use CloudPrint for unlawful, fraudulent, or unauthorised activity.</p></PolicySection>
    <PolicySection title="3. Your uploaded content"><p>You confirm that you have the right to upload, copy, and print each file you submit. Do not upload material that infringes intellectual-property rights, contains unlawful content, violates another person’s privacy, or is unsafe to process. We may refuse an order that does not meet these requirements.</p></PolicySection>
    <PolicySection title="4. Orders, estimates, and pickup"><p>You must review document details, print preferences, pickup location, and displayed pricing before paying. Page counts and estimates may be adjusted if the uploaded file differs from the information available at checkout. We will notify you when an order is ready. Please collect it promptly from the selected pickup location.</p></PolicySection>
    <PolicySection title="5. Payment"><p>Payment is collected through an authorised payment provider. An order is confirmed only after successful payment confirmation. You agree to pay the total amount shown at checkout, including any disclosed print, finishing, convenience, and applicable tax charges.</p></PolicySection>
    <PolicySection title="6. Cancellations and refunds"><p>Refund eligibility and the timing of refunds are set out in our <Link className="font-semibold text-blue-600" to="/refund-policy">Refund Policy</Link>. In particular, eligible refunds are processed within 15 days after approval.</p></PolicySection>
    <PolicySection title="7. Service availability"><p>We aim to keep CloudPrint available and accurate, but we cannot guarantee uninterrupted access or that every print shop will always accept every order. Where we cannot fulfil a paid order, the Refund Policy applies.</p></PolicySection>
    <PolicySection title="8. Changes and contact"><p>We may update these terms when our service or legal requirements change. Continued use after the updated effective date means you accept the revised terms. Contact us at <a className="font-semibold text-blue-600" href={`mailto:${supportEmail}`}>{supportEmail}</a> with questions.</p></PolicySection>
  </PolicyShell>
);

export const CookiePolicyPage = () => (
  <PolicyShell label="Cookie policy" title="Cookie Policy" intro="This policy explains how CloudPrint may use cookies and similar technologies to keep the service working, remember preferences, and understand usage.">
    <PlaceholderNotice />
    <PolicySection title="1. What cookies are"><p>Cookies are small text files placed on your browser or device. Similar technologies can store or read information to support website functionality and remember settings.</p></PolicySection>
    <PolicySection title="2. Cookies we may use"><PolicyList><li><strong>Strictly necessary cookies:</strong> help keep the site secure, maintain a session, and remember essential actions such as login or checkout progress.</li><li><strong>Preference cookies:</strong> remember choices such as language, cookie preferences, or interface settings.</li><li><strong>Analytics cookies:</strong> if enabled, help us understand how visitors use CloudPrint so we can improve it. We will seek consent where required.</li></PolicyList></PolicySection>
    <PolicySection title="3. Managing cookies"><p>You can control cookies through your browser settings and, where provided, our cookie settings banner. Blocking essential cookies may prevent some parts of the service from working correctly.</p></PolicySection>
    <PolicySection title="4. Third parties"><p>Payment providers and other service providers may set or use their own cookies when you use their services. Their handling of those cookies is governed by their own policies.</p></PolicySection>
    <PolicySection title="5. Updates"><p>We may update this Cookie Policy when our cookie practices or legal requirements change. The updated policy will be published here with a revised effective date.</p></PolicySection>
  </PolicyShell>
);

export const RefundPolicyPage = () => (
  <PolicyShell label="Refund & cancellation policy" title="Refund Policy" intro="This policy explains when a CloudPrint payment may be refunded and our commitment to process approved refunds within 15 days.">
    <PlaceholderNotice />
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-950"><p className="font-bold">15-day refund commitment</p><p className="mt-1 leading-6">When a refund is approved, CloudPrint will initiate it to the original payment method within 15 days of approval. Your bank, card issuer, UPI app, or payment provider may take additional time to reflect the amount in your account.</p></div>
    <PolicySection title="1. Payment not completed or payment failure"><p>An order is not confirmed unless payment succeeds. If a payment fails or is not completed, no CloudPrint refund is needed because no successful payment has been received. If money is debited but your order is not confirmed, contact us with your payment reference so we can investigate with the payment provider.</p></PolicySection>
    <PolicySection title="2. When a refund may be approved"><PolicyList><li>CloudPrint accepts payment but cannot process or fulfil the order.</li><li>You cancel an order before it has entered printing or fulfilment, where cancellation is operationally possible.</li><li>There is a verified printing, fulfilment, duplicate-charge, or payment-processing error attributable to CloudPrint.</li></PolicyList></PolicySection>
    <PolicySection title="3. When a refund may not be available"><PolicyList><li>The document has already been printed, prepared, or handed to the pickup location, unless there is a verified CloudPrint error.</li><li>The issue results from an incorrect file, print setting, pickup choice, or instruction supplied by you.</li><li>The request is fraudulent, abusive, or breaches our <Link className="font-semibold text-blue-600" to="/terms-of-use">Terms of Use</Link>.</li></PolicyList></PolicySection>
    <PolicySection title="4. How to request a refund"><p>Email <a className="font-semibold text-blue-600" href={`mailto:${supportEmail}`}>{supportEmail}</a> with your order ID, payment reference, reason for the request, and any helpful screenshots. We may ask for additional information to verify the order and payment.</p></PolicySection>
    <PolicySection title="5. Refund method and timing"><p>Approved refunds are returned to the original payment method wherever possible. CloudPrint will initiate an approved refund within 15 days. We will notify you when the refund has been initiated. Payment-provider or bank processing time is outside CloudPrint’s control.</p></PolicySection>
    <PolicySection title="6. Changes to this policy"><p>We may update this policy to reflect changes to our service, payment operations, or legal requirements. The version displayed at the time of your order applies to that order, unless law requires otherwise.</p></PolicySection>
  </PolicyShell>
);
