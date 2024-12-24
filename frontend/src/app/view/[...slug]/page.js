'use client';

import React from 'react';
import { MYAXIOS } from '@/components/Helper';
import Loading from '@/components/LoadingSpinner';
import PlotDetails from '@/components/PlotDetails';
import NotFound from '@/app/not-found';

export default function PlotPage({ params }) {
    const [plotData, setPlotData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!params.slug || params.slug.length < 2) {
            setIsLoading(false);
            return;
        }

        const plotId = params.slug[1];
        const viewKey = `viewedPlot-${plotId}`;

        // Check if plot has been viewed in this session
        const hasBeenViewed = sessionStorage.getItem(viewKey);

        async function fetchPlotData() {
            try {
                // Only fetch if not previously viewed
                if (!hasBeenViewed) {
                    const response = await MYAXIOS.get(`/api/plots/${plotId}`);

                    // Mark as viewed in session storage
                    sessionStorage.setItem(viewKey, 'true');

                    setPlotData(response.data);
                } else {
                    // If already viewed, fetch without incrementing views
                    const response = await MYAXIOS.get(`/api/plots/${plotId}?noViewIncrement=true`);
                    setPlotData(response.data);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching plot data : ", error);
                setIsLoading(false);
            }
        }

        fetchPlotData();
    }, [params.slug]);

    if (isLoading) return <Loading />;
    if (!plotData) return <NotFound />;

    return <PlotDetails plotData={plotData} />;
}