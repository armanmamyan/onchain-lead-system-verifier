import PartnerPage from "@/components/pages/partner/PartnerPage";

interface PartnerPageProps {
  params: Promise<{
    partner: string;
  }>;
}

export default async function AdvertiserSuccessPage({
  params,
}: PartnerPageProps) {
  const { partner } = await params;
  const partnerName = partner.charAt(0).toUpperCase() + partner.slice(1);

  return <PartnerPage partnerName={partnerName} />;
}
