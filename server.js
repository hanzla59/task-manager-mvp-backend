const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const morgan = require('morgan');

const PORT = process.env.PORT 


app.use(bodyParser.json());
// Log every request: method, url, status, response time
app.use(morgan(':method :url :status :response-time ms'));


app.get('/', (req, res)=> {
<<<<<<< HEAD
    res.status(200).send("backend Server is running on AWS EC2 Instance");
=======
    res.status(200).send("backend Server is running locally");
>>>>>>> 060f3f1761320cabe30d778eab5706fcec6f8ef7
})


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, "0.0.0.0", ()=> {
    console.log(`Server is running on port ${PORT}`);
})