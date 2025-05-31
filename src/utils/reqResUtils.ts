import { Request, Response } from "express";
import { IResJson } from "./types";
import { AuthRequest } from "../middlewares/types";

export const errServer = (): IResJson => {
    return { message: `Server error, please try again`, code: 99 };
};

export const errMissingFields = (missingFields: string[]): IResJson => {
    return {
        message: `Missing required fields: ${missingFields.join(", ")}`,
        code: 3,
    };
};

export const errMissingParams = (missingParams: string[]): IResJson => {
    return {
        message: `Missing required query parameters: ${missingParams.join(
            ", "
        )}`,
        code: 4,
    };
};

export const errMissingFiles = (missingFiles: string[]): IResJson => {
    return {
        message: `Missing required files: ${missingFiles.join(", ")}`,
        code: 4,
    };
};

// interface RequestFieldsResult {
//     data: Record<string, any>;
//     params: Record<string, any>;
// }

interface RequestPayload<
    TFields extends string[] = [],
    TParams extends string[] = [],
    TFiles extends string[] = []
> {
    data: TFields extends []
        ? Record<string, any>
        : { [K in TFields[number]]: any };
    params: TParams extends []
        ? Record<string, any>
        : { [K in TParams[number]]: any };
    files: TFiles extends []
        ? Record<string, any>
        : { [K in TFiles[number]]: any };
}

export const getReqFields = <
    TFields extends string[] = [],
    TParams extends string[] = [],
    TFiles extends string[] = []
>(
    request: Request | AuthRequest,
    response: Response,
    options: {
        requiredFields?: string[];
        requiredParams?: string[];
        requiredFiles?: string[];
    }
): RequestPayload<TFields, TParams, TFiles> | Response => {
    const {
        requiredFields = [],
        requiredParams = [],
        requiredFiles = [],
    } = options;
    const data = request.fields || {};
    const params = request.query || {};
    const files = request.files || {};

    // if (!data) return response.status(500).json(errServer());

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0)
        return response.status(400).send(errMissingFields(missingFields));

    const missingParams = requiredParams.filter((param) => !params[param]);
    if (missingParams.length > 0) {
        return response.status(400).send(errMissingParams(missingParams));
    }

    const missingFiles = requiredFiles.filter((file) => !files[file]);
    if (missingFiles.length > 0) {
        return response.status(400).send(errMissingFiles(missingFiles));
    }

    return {
        data: requiredFields.reduce((acc, field) => {
            acc[field] = data[field];
            return acc;
        }, {} as any),
        params: requiredParams.reduce((acc, param) => {
            acc[param] = params[param];
            return acc;
        }, {} as any),
        files: requiredFiles.reduce((acc, file) => {
            acc[file] = files[file];
            return acc;
        }, {} as any),
    };
};

export const isExpressResponse = (
    value: any
): value is Response<any, Record<string, any>> => {
    return value?.status && value?.send;
};
