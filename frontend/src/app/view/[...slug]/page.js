import { Suspense } from 'react';
import { MYAXIOS } from '@/components/Helper';
import Loading from '@/components/LoadingSpinner';
import PlotDetails from '@/components/PlotDetails';
import NotFound from '@/app/not-found';

export default async function PlotPage({ params }) {
    try {
        console.log("Param : " + params.slug)
        // Ensure slug exists and has at least 2 elements
        if (!params.slug || params.slug.length < 2) {
            return <NotFound />;
        }

        const response = await MYAXIOS.get(`/api/plots/${params.slug[1]}`);
        const plotData = response.data;

        return (
            <Suspense fallback={<Loading />}>
                <PlotDetails plotData={plotData} />
            </Suspense>
        );
    } catch (error) {
        console.error("Error fetching plot data:", error);
        return <NotFound />;
    }
}