/** Error whosw text is safe to show the user. Any other error gets fixed copy. */
export class UserFacingCheckError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserFacingCheckError';
    }
}