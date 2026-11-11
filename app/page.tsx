import Portfolio from "./Portfolio";

export default function Home() {
  return <Portfolio webhookReady={Boolean(process.env.N8N_CONTACT_WEBHOOK_URL)} />;
}

