import json_web_token from "jsonwebtoken";
export default function getJsonWebToken(id) {
    return json_web_token.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}