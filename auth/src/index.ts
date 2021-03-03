import express from 'express';
import {json} from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser',(req,res) => {
    res.send("Hello there!!! ")
})

app.listen(4000, () => {
    console.log("Auth service listening on Port 4000!");
})