'use client';
import type { Map } from 'maplibre-gl';
import type { TemporalSelection } from '../../../../packages/contracts/temporal';
import { Mountains } from '../mountains/mountains';
import { Glaciers } from '../glaciers/glaciers';
import { GlacialLakes } from '../glacial-lakes/glacial-lakes';
import { Hydrology } from '../hydrology/hydrology';
import { Rainfall } from '../rainfall/rainfall';
import { DisasterEvents } from '../disaster-events/disaster-events';
import { Earthquakes } from '../earthquakes/earthquakes';
import { Floods } from '../floods/floods';
import { Landslides } from '../landslides/landslides';
import { Hydropower } from '../hydropower/hydropower';
import { Infrastructure } from '../infrastructure/infrastructure';
import { Population } from '../population/population';
import { Satellite } from '../satellite/satellite';
import { Climate } from '../climate/climate';
export function AdditionalLayers({ map, attempt, temporal }: { map: Map | null; attempt: number; temporal: TemporalSelection | null }) {
  return <div data-mobile-data="loaded">
        <Mountains key={`mountains-${attempt}`} map={map} />
        <Glaciers key={`glaciers-${attempt}`} map={map} />
        <GlacialLakes key={`glacial-lakes-${attempt}`} map={map} />
        <Hydrology key={`hydrology-${attempt}`} map={map} />
        <Rainfall key={`rainfall-${attempt}`} map={map} />
        <DisasterEvents temporal={temporal} key={`disaster-events-${attempt}`} map={map} />
        <Earthquakes key={`earthquakes-${attempt}`} map={map} />
        <Floods key={`floods-${attempt}`} map={map} />
        <Landslides key={`landslides-${attempt}`} map={map} />
        <Hydropower key={`hydropower-${attempt}`} map={map} />
        <Infrastructure key={`infrastructure-${attempt}`} map={map} />
        <Population key={`population-${attempt}`} map={map} />
        <Satellite temporal={temporal} key={`satellite-${attempt}`} map={map} />
        <Climate temporal={temporal} key={`climate-${attempt}`} />
  </div>;
}
