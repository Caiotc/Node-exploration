import "dotenv/config"
import {z} from 'zod';

//
const envSchema = z.object({
    NODE_ENV: z.enum(['development','test','production']).default('production'),
    DATABASE_URL:z.string(),
});

 const env_ = envSchema.safeParse(process.env);

 if(env_.success=== false){
    console.error('invalid enviroment variables',env_.error.format())

    throw new Error('Invalid enviroment variable')

 }

 export const env = env_.data;