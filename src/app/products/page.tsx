import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="px-10 py-2 flex flex-col space-y-3">
      <Skeleton className="w-[185px] h-[186px] md:w-[229px] md:h-[201px] lg:w-[179px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
        <Skeleton className="w-[185px] h-[24px] md:w-[229px] lg:w-[179px]" />
        <Skeleton className="w-[185px] h-[54px] md:w-[229px] lg:w-[179px]" />
      </div>
    </div>
  );
}
