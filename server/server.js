const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // 👈 allow cookies
};
app.use(cors(corsOptions));


app.use(express.json());

app.use('/api', userRoutes, blogRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
