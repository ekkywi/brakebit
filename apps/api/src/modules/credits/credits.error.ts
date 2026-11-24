import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientCreditsException extends HttpException {
    constructor() {
        super(
            {
                code: 'insufficient_credits',
                message: 'Not enough credits for this action'
            },
            HttpStatus.PAYMENT_REQUIRED,
        );
    }
}