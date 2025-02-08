import express from 'express';
import dotenv from 'dotenv';
import router from './router';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
app.use(express.json());
app.use('/api', router);

const PORT = parseInt(process.env.PORT || '3000') || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});