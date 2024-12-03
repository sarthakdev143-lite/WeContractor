import { Suspense } from 'react';
import { MYAXIOS } from '@/components/Helper';
import Loading from '@/components/LoadingSpinner';
import PlotDetails from '@/components/PlotDetails';
import NotFound from '@/app/not-found';

export default async function PlotPage({ params }: { params: { slug: string[] } }) {
    try {
        const { slug } = params;
        const response = await MYAXIOS.get(`/api/plots/${slug[1]}`);
        const plotData = response.data;

        return (
            <Suspense fallback={<Loading />}>
                <PlotDetails plotData={plotData} />
            </Suspense>
        );
    } catch (error) {
        return <NotFound />;
    }
}