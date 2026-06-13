// Ambient type declarations for packages/file types with no bundled types

declare module 'react-simple-maps' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographyStyle {
    default?: CSSProperties & { stroke?: string; strokeWidth?: number; fill?: string; outline?: string };
    hover?: CSSProperties & { stroke?: string; strokeWidth?: number; fill?: string; outline?: string };
    pressed?: CSSProperties & { stroke?: string; strokeWidth?: number; fill?: string; outline?: string };
  }

  interface GeographyProps {
    geography: Record<string, unknown>;
    style?: GeographyStyle;
    key?: string;
    className?: string;
  }

  interface GeographiesChildProps {
    geographies: Array<Record<string, unknown> & { rsmKey: string }>;
  }

  interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (props: GeographiesChildProps) => ReactNode;
  }

  interface MarkerProps {
    coordinates: [number, number];
    onClick?: () => void;
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<Record<string, unknown>>;
}

// Allow importing .geojson files as plain objects
declare module '*.geojson' {
  const value: {
    type: string;
    features: Array<{
      type: string;
      geometry: {
        type: string;
        coordinates: number[] | number[][] | number[][][];
      };
      properties: Record<string, unknown>;
    }>;
  };
  export default value;
}
