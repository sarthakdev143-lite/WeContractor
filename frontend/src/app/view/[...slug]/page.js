'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MYAXIOS } from '@/components/Helper';
import { PlotSkeleton } from '@/components/PlotSkeleton';
import NotFound from '@/app/not-found';

// Dynamically import PlotDetails with loading fallback
const PlotDetails = dynamic(() => import('@/components/PlotDetails'), {
    loading: () => <PlotSkeleton />,
    ssr: false
});

// Create a cache for plot data
const plotCache = new Map();

export default function PlotPage({ params }) {
    const [plotData, setPlotData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!params.slug || params.slug.length < 2) {
            setError('Invalid plot ID');
            return;
        }

        const plotId = params.slug[1];
        const viewKey = `viewedPlot-${plotId}`;

        // Check cache first
        if (plotCache.has(plotId)) {
            setPlotData(plotCache.get(plotId));
            return;
        }

        let isMounted = true;
        const controller = new AbortController();

        async function fetchPlotData() {
            try {
                const hasBeenViewed = sessionStorage.getItem(viewKey);
                const endpoint = `/api/plots/${plotId}${hasBeenViewed ? '?noViewIncrement=true' : ''}`;

                const response = await MYAXIOS.get(endpoint, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (isMounted) {
                    const data = response.data;
                    setPlotData(data);
                    plotCache.set(plotId, data); // Cache the result
                    !hasBeenViewed && sessionStorage.setItem(viewKey, 'true');
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                if (isMounted) {
                    setError(error.message);
                    console.error("Error fetching plot data:", error);
                }
            }
        }

        fetchPlotData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [params.slug]);

    if (error) return <NotFound />;
    if (!plotData) return <PlotSkeleton />;

    return <PlotDetails plotData={plotData} />;
}