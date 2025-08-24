import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';

/**
 * Generates a JWT token.
 *
 * @param {Object} payload - The payload to include in the token.
 * @param {string} [expiresIn='1h'] - The expiration time of the token.
 * @returns {string} The generated JWT token.
 */
export function generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, secretKey, { expiresIn });
}

/**
 * Verifies a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} The decoded payload if the token is valid, or null if it is invalid or expired.
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error(`Invalid or expired token: ${error.message}`);
    }
}
/**
 *this method encode the password using bcrypt library
 * @param password user password provided as string
 * @returns
 */
export function hashPassword(password) {
    const saltOrRounds = 10;
    const hash = bcrypt.hashSync(password, saltOrRounds);
    return hash;
}

/**
 *this method match the password using bcrypt library
 * @param password user password provided as string
 * @param userPassword encrypted password stored in database
 * @returns
 */
export function verifyPassword(password, userPassword) {
    if (!password || !userPassword) {
        console.error(
            `Invalid arguments for comparePassword: password is "${password}", userPassword is "${userPassword}"`,
        );
        return false;
    }
    const compare = bcrypt.compareSync(password, userPassword);
    return compare;
}

/**
 * this method will paginate the data
 * @param data array of data with array indexes
 * @param page number of page to paginate
 * @param limit number of items to show per page
 * @returns array of paginated data along with metadata
 */
export function paginateResponse({
    data = [[], 10],
    page = 1,
    limit = 10,
}) {
    const [result, total] = data;
    const totalPages = Math.ceil(total / limit);
    // const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        data: [...result],
        metaInfo: {
            totalRecords: total,
            itemsPerPage: result.length,
            currentPage: page,
            nextPage,
            prevPage,
            totalPages,
        },
    };
}

export function convertIntoUTCTime(dataString) {
    const timestamp = dataString * 1000; // Convert to milliseconds
    const date = new Date(timestamp);
    return date;
}

/**
 * Generates a random 6-digit OTP (One-Time Password).
 *
 * @returns The generated OTP as a string.
 */
export function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}
