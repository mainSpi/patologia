'use client';

import OpenSeadragon from 'openseadragon';
import type { Viewer as OpenSeadragonViewer, TileSource } from 'openseadragon';
import { useEffect, useRef, useState } from 'react';

interface SVSViewerProps {
  tileSource: string | TileSource | (string | TileSource)[];
  viewerId: string;
}

const SVSViewer: React.FC<SVSViewerProps> = ({ tileSource, viewerId }) => {
  const viewerRef = useRef<OpenSeadragonViewer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let viewer: OpenSeadragonViewer | null = null;
    
    if (typeof window !== 'undefined' && tileSource) {
      try {
        setIsLoading(true);
        setError(null);

        viewer = OpenSeadragon({
          id: viewerId,
          prefixUrl: 'https://openseadragon.github.io/openseadragon/images/', // Standard prefix for icons
          tileSources: tileSource,
          animationTime: 0.5,
          blendTime: 0.1,
          constrainDuringPan: true,
          maxZoomPixelRatio: 2,
          minZoomImageRatio: 0.8,
          visibilityRatio: 1,
          zoomPerScroll: 1.5,
          showNavigator: true,
          navigatorPosition: 'BOTTOM_RIGHT',
          sequenceMode: Array.isArray(tileSource) && tileSource.length > 1,
        });

        viewerRef.current = viewer;

        viewer.addHandler('open', () => {
          setIsLoading(false);
        });

        viewer.addHandler('open-failed', (event) => {
          console.error('OpenSeadragon open-failed:', event);
          setError(`Failed to load image: ${event.message || 'Unknown error'}`);
          setIsLoading(false);
        });
        
      } catch (err) {
        console.error('Error initializing OpenSeadragon:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during initialization.');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // No tile source or not in browser env
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [tileSource, viewerId]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] bg-muted rounded-lg shadow-inner overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium text-foreground">Loading Viewer...</p>
          </div>
        </div>
      )}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-10 p-4">
          <div className="text-center p-6 bg-card rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Image</h3>
            <p className="text-destructive-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">Please check the console for more details or try refreshing the page.</p>
          </div>
        </div>
      )}
      <div id={viewerId} className={`w-full h-full ${isLoading || error ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`} />
    </div>
  );
};

export default SVSViewer;
