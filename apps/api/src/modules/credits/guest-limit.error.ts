import { HttpException, HttpStatus } from '@nestjs/common';

export class GuestLimitReachedException extends HttpException {
    constructor() {
        super(
            {
                code: 'guest_limit_reached',
                message: 'Free daily check used. Sign in to keep checking.'
            },
            HttpStatus.UNAUTHORIZED
        );
    }
}