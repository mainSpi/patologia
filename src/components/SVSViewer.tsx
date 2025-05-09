// @ts-nocheck
// TODO: Fix typescript errors from openseadragon-react-viewer
'use client';

import OpenSeadragonViewer, { OpenSeadragonViewerProps } from 'openseadragon-react-viewer';
import type { TileSource } from 'openseadragon';
import { useState, useEffect } from 'react';


interface SVSViewerProps {
  tileSource: string | TileSource | (string | TileSource)[];
}

const SVSViewer: React.FC<SVSViewerProps> = ({ tileSource }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Used to force re-render if tileSource changes path

  useEffect(() => {
    // Reset states when tileSource changes
    setIsLoading(true);
    setError(null);
    setKey(prevKey => prevKey + 1); // Change key to re-mount OpenSeadragonViewer
  }, [tileSource]);


  const viewerOptions: OpenSeadragonViewerProps['options'] = {
    prefixUrl: 'https://openseadragon.github.io/openseadragon/images/', // Standard prefix for icons
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
    // OSD React Viewer specific event handlers can be added here if needed
    // For example, onOpen, onOpenFailed etc. can be passed as options
    // However, openseadragon-react-viewer handles some of this internally.
    // We'll use a simplified approach for now.
  };
  
  // The OpenSeadragonViewer component itself handles the div creation.
  // We need to handle loading and error states based on its behavior.
  // This might require some observation or deeper dive into its specific event handling if available.
  // For now, we assume it handles internal loading/error UI to some extent.

  // A simple way to detect if the image loaded, might not be perfect for all cases
  const handleViewerEvent = (event: any) => {
    if (event.eventSource && event.eventSource.id === 'osd-viewer') { // Default ID
      if (event.name === 'open') {
        setIsLoading(false);
        setError(null);
      } else if (event.name === 'open-failed') {
        console.error('OpenSeadragon open-failed:', event.originalEvent);
        setError(`Failed to load image: ${event.originalEvent?.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    }
  };


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
            <p className="text-xs text-muted-foreground mt-2">Please check the console for more details or try refreshing the page. The SVS/Image path might be incorrect.</p>
          </div>
        </div>
      )}
      <div className={`w-full h-full ${isLoading || error ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
         <OpenSeadragonViewer
            key={key} // Force re-mount when tileSource changes effectively
            tileSources={tileSource}
            options={viewerOptions}
            onOpen={() => { setIsLoading(false); setError(null); }}
            onOpenFailed={(e: any) => {
              console.error('OpenSeadragon open-failed from component prop:', e);
              // Access message from original event if possible
              const message = e?.event?.message || e?.message || 'Unknown error loading image.';
              setError(`Failed to load image: ${message}`);
              setIsLoading(false);
            }}
          />
      </div>
    </div>
  );
};

export default SVSViewer;
