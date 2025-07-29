import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { ZodObject, ZodRawShape } from 'zod';

type AnyZodObject = ZodObject<ZodRawShape>;

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      files: req.files,
      file: req.file,
      cookies: req.cookies,
    });

    return next();
  });
};

export default validateRequest;
