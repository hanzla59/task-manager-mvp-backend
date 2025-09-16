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
    res.status(200).send("backend Server is running locally");
})


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})