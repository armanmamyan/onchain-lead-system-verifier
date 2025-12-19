import LoadingFallback from "@/components/common/LoadingFallback";
import VerifierContent from "@/components/pages/verify/VerifierContent";
import { Suspense } from "react";

const VerifierPage = async (
  { searchParams }: 
  { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifierContent searchParams={searchParams} />
    </Suspense>
  );
};

export default VerifierPage;
