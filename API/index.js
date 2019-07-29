const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const users = require('./db/userDb');
const db_trips = require('./db/db_trips');
const db_bookings =require('./db/db_bookings');
const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        
        res.sendStatus(403)
    }
}
      
app.post('/api/v1/signup', (req,res)=>{
    const userSchema = {
        email: req.body.email,
        password:req.body.password,
        first_name:req.body.first_name,
        last_name:req.body.last_name,      
    }
    jwt.sign({userSchema},'secretkey',(error,token)=>{
        
            res.json({
            status: "success",
            data:{
            token:token,
            email: userSchema.email,
            first_name: userSchema.first_name,
            last_name: userSchema.last_name
            }  
       })
       
    })
})

app.post('/api/v1/signup', (req,res)=>{
    const userSchema = {
        email: req.body.email,
        password:req.body.password,
        first_name:req.body.first_name,
        last_name:req.body.last_name,      
    }
    jwt.sign({userSchema},'secretkey',(error,token)=>{
        
            res.json({
            status: "success",
            data:{
            token:token,
            email: userSchema.email,
            first_name: userSchema.first_name,
            last_name: userSchema.last_name
            }  
       })
       
    })
})

app.post('/api/v1/signin', (req,res)=>{
    
    const user = {
        id:1,
        email:'kitakagrace@gmail.com',
        password:"12345",
        first_name: "Kitaka",
        last_name: "Grace"
    }
    jwt.sign({user}, 'secretkey',{ expiresIn: '60s' },(error,token)=>{
        res.json({
            status: "success",
            data:{
                token,
                first_name: user.first_name,
                last_name:user.last_name,
                email:user.email
            }
        })
    })
})

app.post('/api/v1/trips',checkToken, (req, res) => {
  
    if(!req.body.seating_capacity) {
      return res.status(400).send({
        success: 'false',
        message: 'Seating capacity is required'
      });
    } else if(!req.body.bus_licence_number) {
      return res.status(400).send({
        success: 'false',
        message: 'Bus licence Number is required'
      });
    }else if(!req.body.origin){
      return res.status(400).send({
        success: 'false',
        message: 'Origin is required'
      });
    }else if(!req.body.destination){
      return res.status(400).send({
        success: 'false',
        message: 'Destination is required'
      });
    }else if(!req.body.trip_date){
      return res.status(400).send({
        success: 'false',
        message: 'Trip date is required'
      });
    }else if(!req.body.fare){
      return res.status(400).send({
        success: 'false',
        message: 'fare is required'
      });
    }else if(!req.body.status){
      return res.status(400).send({
        success: 'false',
        message: 'status is required'
      });
    }
   const trip = {
      id: db_trips.length + 1,
      seating_capacity:req.body.seating_capacity,
      bus_licence_number: req.body.bus_licence_number,
      origin: req.body.origin,
      destination: req.body.destination,
      trip_date: req.body.trip_date,
      fare: req.body.fare,
      status: req.body.status
   }
   db_trips.push(trip);
   return res.status(201).send({
     success: 'true',
     message: 'trip added successfully',
     trip
   })
  });

  app.delete('/api/v1/trips/:id',checkToken, (req, res) => {
    const id = parseInt(req.params.id, 10);
  
    db_trips.map((trip, index) => {
      if (trip.id === id) {
         db_trips.splice(index, 1);
         return res.status(200).send({
           status: 'success',
           message: 'Trip deleted successfuly',
           
         });
      }
    });
  
      return res.status(404).send({
        status: 'error',
        error: 'Item for deletion not found',
      });
  
   
  });

  app.get('/api/v1/trips',checkToken, (req, res) => {
    res.status(200).send({
      status: 'success',
      data: db_trips
    })
    return res.status(404).send({
      status: 'error',
      error: 'trips dont exist',
     });
  });

  app.get('/api/v1/trips/:id',checkToken, (req, res) => {
    const id = parseInt(req.params.id, 10);
    db_trips.map((trip) => {
      if (trip.id === id) {
        return res.status(200).send({
          status: 'success',
          data: trip
        });
      } 
  });
   return res.status(404).send({
     status: 'error',
     error: 'Trip doesnot exist',
    });
  });

  app.post('/api/v1/bookings', (req, res) => {
  
  if(!req.body.trip_id) {
    return res.status(400).send({
      success: 'false',
      message: 'Trip id is required'
    });
  } else if(!req.body.user_id){
    return res.status(400).send({
      success: 'false',
      message: 'User is required'
    });
  }else if(!req.body.created_on){
    return res.status(400).send({
      success: 'false',
      message: 'Date is required'
    });
  }
  
 const booking = {
    id: db_bookings.length + 1,
    trip_id:req.body.trip_id,
    user_id: req.body.user_id,
    created_on:req.body.created_on
    
 }
 db_bookings.push(booking);
 return res.status(201).send({
   success: 'true',
   message: 'Booking is successfull',
   booking
 })

});

app.get('/api/v1/bookings', (req, res) => {
  res.status(200).send({
    status: 'success',
    data: db_bookings
  })

  return res.status(404).send({
    status: 'error',
    error: 'Bookings not found',
  });
});

app.delete('/api/v1/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db_bookings.map((booking, index) => {
    if (booking.id === id) {
       db_bookings.splice(index, 1);
       return res.status(200).send({
         status: 'success',
         message: 'Booking deleted successfuly',
       });
    }
  })
})

  
app.listen(PORT,(req,res) =>{
  console.log(`App running on port ${PORT}`)
})
 