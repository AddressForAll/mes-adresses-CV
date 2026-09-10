/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TerritoryDTO } from '../models/TerritoryDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TerritoriesService {
    /**
     * List the territories of a country, one level at a time
     * @param country
     * @param parent Territory code whose children to list; omit for the top level
     * @returns TerritoryDTO
     * @throws ApiError
     */
    public static listTerritories(
        country: string,
        parent?: string,
    ): CancelablePromise<Array<TerritoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/territories/{country}',
            path: {
                'country': country,
            },
            query: {
                'parent': parent,
            },
        });
    }
    /**
     * Find one territory by code
     * @param country
     * @param code
     * @returns TerritoryDTO
     * @throws ApiError
     */
    public static findTerritory(
        country: string,
        code: string,
    ): CancelablePromise<TerritoryDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/territories/{country}/{code}',
            path: {
                'country': country,
                'code': code,
            },
        });
    }
}
