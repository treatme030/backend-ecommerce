require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import product from './routes/productRoute';

const { PORT, MONGO_URI } = process.env;

//서버와 데이터베이스 연결
mongoose
.connect(MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(e => {
    console.error(e)
})

const app = express();
app.use(express.json());

app.use("/api/v1", product);

const port = PORT || 4000;
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})
