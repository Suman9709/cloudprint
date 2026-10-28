type ContactIconProps = {
  name: "email" | "phone" | "whatsapp";
  className?: string;
};

const ContactIcon = ({ name, className = "" }: ContactIconProps) => {
  if (name === "email") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4.5 7 6.16 5.13a2.1 2.1 0 0 0 2.68 0L19.5 7" /></svg>;
  }

  if (name === "phone") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7.8 3.75 5.96 4.6a2.1 2.1 0 0 0-1.15 2.2c.86 6.12 6.27 11.53 12.4 12.4a2.1 2.1 0 0 0 2.2-1.15l.84-1.84a1.3 1.3 0 0 0-.54-1.66l-2.79-1.61a1.3 1.3 0 0 0-1.55.2l-1.17 1.02a11.8 11.8 0 0 1-4.15-4.15l1.02-1.17a1.3 1.3 0 0 0 .2-1.55L9.46 4.3a1.3 1.3 0 0 0-1.66-.55Z" /></svg>;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L3 20.7l1.55-4.73A8.5 8.5 0 1 1 20.5 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.55 7.45c.2-.43.4-.44.64-.44h.54c.17 0 .37.05.47.3l.75 1.8c.1.24.05.43-.1.62l-.56.68c-.12.15-.2.3-.06.54.46.8 1.05 1.48 1.78 2.02.58.44 1.18.75 1.53.9.24.1.4.09.55-.09l.75-.9c.18-.21.36-.23.6-.13l1.68.8c.26.12.43.18.5.29.06.11.06.63-.15 1.22-.2.57-1.19 1.1-1.65 1.16-.42.05-.95.08-1.54-.1-.35-.1-.8-.26-1.38-.5-2.42-1.06-4-3.56-4.12-3.73-.12-.16-.98-1.3-.98-2.5 0-1.18.62-1.76.84-1.98Z" fill="currentColor" />
    </svg>
  );
};

export default ContactIcon;
