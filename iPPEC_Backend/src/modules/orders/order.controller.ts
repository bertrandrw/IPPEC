// src/modules/orders/order.controller.ts

import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as orderService from './order.service.js';
import { ApiError } from '../../utils/ApiError.js'; 


export const createOrderController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const newOrder = await orderService.createOrder(patientUser, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, newOrder, 'Order placed successfully.'));
});


// --- PATIENT CONTROLLERS ---

export const listMyOrdersController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const orders = await orderService.listMyOrders(patientUser);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, orders));
});

export const getMyOrderByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const { id } = req.params;
  
  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required.');
  }
  
  const order = await orderService.getMyOrderById(patientUser, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, order));
});


// --- PHARMACIST CONTROLLERS ---

export const listPharmacyOrdersController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const pharmacistUser = req.user!;
  const orders = await orderService.listPharmacyOrders(pharmacistUser);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, orders));
});

export const getPharmacyOrderByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const pharmacistUser = req.user!;
  const { id } = req.params;

  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required.');
  }

  const order = await orderService.getPharmacyOrderById(pharmacistUser, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, order));
});

export const updateOrderStatusController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const pharmacistUser = req.user!;
  const { id } = req.params;
  const { status } = req.body;

  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required.');
  }

  const updatedOrder = await orderService.updateOrderStatus(pharmacistUser, id, status);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedOrder, 'Order status updated.'));
});
