const express = require("express");
const { JWT_SECRET } = require("../utils/config");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * @api {get} /api/auth/ Get JWT token for the user
 * @apiName GetToken
 * @apiGroup Auth
 *
 * @apiSuccess {String} token JWT token for the user
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *    {
 *      "token": "generated_jwt_token"
 *    }
 */
router.get("/", (req, res) => {
  const uuid = crypto.randomUUID(); // Generate a random UUID for the user
  const token = jwt.sign({ uuid }, JWT_SECRET); // Sign the token with the secret key
  console.log("Generated token:", token); // Log the generated token
  // Send the token back to the client
  res.json({ token });
});

/**
 * @api {post} /api/auth/verify Verify JWT token for the user
 * @apiName VerifyToken
 * @apiGroup Auth
 *
 * @apiBody {String} token JWT token to verify
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "token": "generated_jwt_token"
 *     }
 *
 * @apiSuccess {String} message JWT token for the user
 * @apiSuccess {Boolean} authenticated Whether the user is authenticated or not
 *
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "message": "Token is valid",
 *      "authenticated": true
 *    }
 */
router.post("/verify", (req, res) => {
  // Verify the token sent by the client
  const { token } = req.body;
  const secretKey = JWT_SECRET;

  // Use the secret key to verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token", authenticated: false });
    }
    res.json({ message: "Token is valid", authenticated: true });
  });
});

module.exports = router;
