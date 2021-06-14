const express          = require('express');
const cookieParser     = require('cookie-parser');
const logger           = require('morgan');
const path             = require('path');
const cors             = require('cors');
const indexRouter      = require('./routes/index');
const quotesRouter     = require('./routes/quotes');
const tagsRouter       = require('./routes/tags');
const mqtt             = require('./mqtt_data');
const app              = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//set static folder 
app.use(express.static(path.join(__dirname, 'static')));
app.use('/', indexRouter);
app.use('/tags', tagsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  return;
})

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
	console.log(`server running on port ${PORT}`);
});
