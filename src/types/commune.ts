import { CommuneDTO } from "@/lib/openapi-api-bal";

export type CommuneType = CommuneDTO & {
  bbox?: number[];
  /**
   * Preferred initial map center [longitude, latitude]. This can differ from
   * the bbox center when addresses are concentrated in one part of a large
   * territory.
   */
  initialCenter?: [number, number];
  /**
   * The bbox is the whole territory's (an empty BAL), not its addresses'.
   * The map then frames all of it instead of clamping the zoom.
   */
  isTerritoryBBox?: boolean;
  contour?: {
    type: "Polygon";
    coordinates: number[][][];
  };
};
