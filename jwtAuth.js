const jwt = require('jsonwebtoken');


// require('dotenv').config();
const secretKey = "secretKeyForTrukapp_v1_Authorization";

  function getExpirationTimestampFromToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            return decoded.exp;
        }
    } catch (err) {
        console.error('Error decoding token:', err.message);
    }
    return null;
}

  function generateToken(mobileNo) {
    return jwt.sign({ mobileNo }, secretKey, { expiresIn: '24h' });
  }

  const tokenBlacklist = new Set();

function addToBlacklist(token) {
  const expirationTimestamp = getExpirationTimestampFromToken(token);
  if (expirationTimestamp) {
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = expirationTimestamp - now;
      setTimeout(() => {
          tokenBlacklist.delete(token);
      }, expiresIn * 1000);
  }
  tokenBlacklist.add(token);
}


  function isBlacklisted(token) {
      return tokenBlacklist.has(token);
  }


function verifyToken(req, res, next) {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  const token = tokenHeader.split(' ')[1];

  if (tokenBlacklist.has(token)) {
      const now = Math.floor(Date.now() / 1000);
      const expirationTimestamp = getExpirationTimestampFromToken(token);
      if (expirationTimestamp && now > expirationTimestamp) {
          tokenBlacklist.delete(token);
      } else {
          return res.status(401).json({ message: 'Token is blacklisted' });
      }
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      console.info("Decoded:", decoded);

      if (err) {
        console.error('JWT verification error:', err);
          return res.status(403).json({ message: "Forbidden" });
      }

      const expirationTimestamp = getExpirationTimestampFromToken(token);
      if (expirationTimestamp && Date.now() >= expirationTimestamp * 1000) {
          return res.status(401).json({ message: 'Token has expired' });
      }
      req.mobileNo = decoded.mobileNo;
   
      next();
  });
}


function generateRefreshToken(mobileNo) {
    return jwt.sign({ mobileNo }, secretKey, { expiresIn: '7d' });
  }


function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;
  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    console.info("Decoded:", decoded);
    if (err) {
      logger.error('Refresh token verification error:', err);
      return res.status(403).json({ message: "Forbidden" });
    }

    const { mobileNo } = decoded;
    const newAccessToken = generateToken(mobileNo);
    res.json({ accessToken: newAccessToken });
  });
}


  module.exports = { generateToken, verifyToken, refreshToken, generateRefreshToken, addToBlacklist, isBlacklisted};
   


