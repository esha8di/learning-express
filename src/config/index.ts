import dotenv from "dotenv"
import { connect } from "http2";
import path from "path"

 dotenv.config(
    {
        path:path.resolve(process.cwd(),".env")
    }
 )

const config={
    port:process.env.PORT,
    connectionString:process.env.CONNECTION_STRING,
    secret:process.env.SECRECT_KEY
}

export default config;