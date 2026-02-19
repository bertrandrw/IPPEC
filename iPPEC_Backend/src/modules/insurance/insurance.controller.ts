import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as insuranceService from './insurance.service.js';

export const generateClaimReportController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const pharmacistUser = req.user!;
  const report = await insuranceService.generateClaimReport(pharmacistUser, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, report, 'Claim report generated successfully.'));
});

export const createInsuranceCompanyController = catchAsync(async (req: Request, res: Response) => {
  const company = await insuranceService.createInsuranceCompany(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, company, 'Insurance company created successfully.'));
});

export const listInsuranceCompaniesController = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as { page: number, limit: number };
  const result = await insuranceService.listInsuranceCompanies(page || 1, limit || 10);
  
  const { data, totalCount } = result;
  const totalPages = Math.ceil(totalCount / (limit || 10));
  const meta = { totalRecords: totalCount, currentPage: page || 1, totalPages, limit: limit || 10 };

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
});

export const getInsuranceCompanyByIdController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Company ID is required.');
  const company = await insuranceService.getInsuranceCompanyById(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, company));
});

export const updateInsuranceCompanyController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Company ID is required.');
  const updatedCompany = await insuranceService.updateInsuranceCompany(id, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedCompany, 'Company details updated successfully.'));
});

export const deleteInsuranceCompanyController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Company ID is required.');
  const result = await insuranceService.deleteInsuranceCompany(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});
