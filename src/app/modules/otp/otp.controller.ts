import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OtpServices } from './otp.service';

const handleVerifyOtp = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization as string;
  const otp = req.body.otp;

  const result = await OtpServices.verifyOtp(token, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Otp verified successfully',
    data: result,
  });
});

export const OtpControllers = {
  handleVerifyOtp,
};
