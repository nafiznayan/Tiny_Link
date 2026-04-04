import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const publicKey = fs.readFileSync(
  path.resolve("secretKeys/tokenECPublic.pem"),
  "utf8",
);
const privateKey = fs.readFileSync(
  path.resolve("secretKeys/tokenECPrivate.pem"),
  "utf8",
);
const pharmacyPublicKey = fs.readFileSync(
  path.resolve("secretKeys/pharmacyPublicKey.pem"),
  "utf8",
);

const prescriptionPublicKey = fs.readFileSync(
  path.resolve("secretKeys/prescriptionPublicKey.pem"),
  "utf8",
);

// Make a token
export const signToken = (payload, options = {}) => {
  // Return Promise
  return new Promise((resolve, reject) => {
    // Sign the payload with json web token
    jwt.sign(
      payload,
      privateKey,
      { algorithm: "RS256", ...options },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      },
    );
  });
};

// Verify Token
export const verifyToken = (token) => {
  // Return Promise
  return new Promise((resolve, reject) => {
    // Verify json web token
    jwt.verify(token, publicKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export const verifyPharmacyToken = (token) => {
  // Return Promise
  return new Promise((resolve, reject) => {
    // Verify json web token with pharmacy public key
    jwt.verify(token, pharmacyPublicKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export const verifyPrescriptionToken = (token) => {
  // Return Promise
  return new Promise((resolve, reject) => {
    // Verify json web token with pharmacy public key
    jwt.verify(token, prescriptionPublicKey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export async function generateTokenPair(userData) {
  const tokenId = generateTokenId();
  //   console.log(tokenId);
  const accessToken = await signToken(
    { ...userData, type: "access", jti: `access_${tokenId}` },
    { expiresIn: "15s" },
  );
  const refreshToken = await signToken(
    { ...userData, type: "refresh", jti: `refresh_${tokenId}` },
    { expiresIn: "7d" },
  );

  return {
    accessToken,
    refreshToken,
    tokenId,
  };
}
async function refreshAccessToken(refreshToken) {
  try {
    const payload = await verifyToken(refreshToken);
    const { jti, iat, exp, type, ...userData } = payload;
    // Generate new token pair
    return generateTokenPair(userData);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}
function generateTokenId() {
  return crypto.randomBytes(32).toString("hex");
}
