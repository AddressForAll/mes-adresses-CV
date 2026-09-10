/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TerritoryDTO = {
    /**
     * Territory code, as stored in the BAL commune
     */
    code: string;
    nom: string;
    /**
     * Level key, e.g. state, county, place
     */
    level: string;
    /**
     * Overture division_area GERS id
     */
    divisionId: string;
    bbox: Array<number>;
    path: Array<string>;
    hasChildren: boolean;
    selectable: boolean;
};

