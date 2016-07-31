
/* [==========================================================]
 *   CITYFAB API
 *
 *   Licensed by Attribution. Do not remove.
 *   "Powerered by Bedbug" should be visible whenever
 *   this API or part of this code is being used.
 *   Copyright(c) 2015 Bedbug Studio All rights reserved.
 * [==========================================================]*/


/* ================================
 *  MONGODB SCHEMAS
 ** ==============================*/

// Chat Comment
var comment = new mongoose.Schema({
    name: {type: String, required:true},
    comment: {type: String, required:false},
    createdAt: {type: String}
});
var CommentModel = mongoose.model('comments',comment);

var invoice = new mongoose.Schema({
    sid: {type: String, required:false},
    invoiceid: {type: String, required:false},
    invoicedate: {type: Date, required:false},
    itemname: {type: String},
    sum: {type: Number, required: false}
});
var InvoiceModel = mongoose.model('invoices',invoice);

// WorkDate Schema
var workDate = new mongoose.Schema({
    workday: {type: Date, required: false},
    wdid: {type: String, required:true},
    timeslots: {type: [String], required:false},
    owner : { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});
var workDateModel = mongoose.model('workdates',workDate);

var AppointmentsSchema = mongoose.Schema;
var Appointment = new AppointmentsSchema({
    upic:{type: String, required: false},
    uname: {type: String, required: false},
    uid:  { type: String },
    utoken: {type: String, required: false},
    spic: {type: String, required: false},
    sname: {type: String, required: false},
    sid:  { type: String},
    stoken: {type: String, required: false},
    calltype: {type: String},
    address: {type: String, required: false},
    subservicetype: {type: String, required: false},
    timetable: {type: [workDate], required: true},
    comments: {type: [comment], required: false},
    status: {type: String, required: true},
    startdate: { type: Date },
    rated: {type: Boolean},
    notified: {type: Boolean},
    requestedon: { type: Date},
    cost: {type: Number},
    distance: {type: Number}
});
var AppointmentsModel = mongoose.model('Appointments', Appointment);

var RateSchema = mongoose.Schema;
var RateObject = new RateSchema({
    sname: { type: String, required: false },
    pic: { type: String, required: false },
    sid: { type: String, required: false },
    stoken: { type: String, required: false },
    uname: { type: String, required: false },
    rating: { type: Number, required: false  },
    review: { type: String }
    //createdAt: { type: Date, expireAt: '6m' }
});
var RateModel = mongoose.model('Ratings', RateObject);

// Address Schema
var AddressSchema = mongoose.Schema;
var AddressObject = new AddressSchema({
    alias: {type: String, required: false},
    location: {type: String, required:false},
    geolocation: { type: [Number], required:false }
});
var AddressModel = mongoose.model('Addresses', AddressObject);

// Schedule Schema
var ScheduleSchema = mongoose.Schema;
var schedule = new ScheduleSchema({
    days: {type: [String], required:false},
    timeblocks: {type: [String], required:false}
});
var Schedule = mongoose.model('Schedules', schedule);

var WorkScheduleSchema = mongoose.Schema;
var workSchedule = new WorkScheduleSchema({
    day: String,
    timeblocks: [String]
})

// Full User Schema
var userFullSchema = mongoose.Schema;
var userFull = new userFullSchema({
    password: {type: String, required:true},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    usertype: {type: String, required: true},
    subscriptionstatus: {type: String},
    subscriptionends: {type: Date},
    calltype: {type: String},
    addresses: {type: [AddressObject], required: false},
    address: {type: String, required: false},
    mood: {type: String, required: false},
    aboutme: {type: String, required: false},
    services: {type: [String], required: false},
    schedule: {type: [schedule], required: false},
    workschedule: mongoose.Schema.Types.Mixed,
    languages: {type: [String], required: false},
    products: {type: [String], required: false},
    subservices: {type: [subservice], required: false},
    email: {type: String, required:true, unique: true},
    phone: {type: String, required:false},
    taxid: {type:String},
    pushtoken: {type: String, required: false},
    googleid: {type: String, required: false},
    fbid: {type: String, required: false},
    servicesnum: {type: Number},
    rating: {type: Number},
    reviews: {type: [RateObject], required: false},
    loc: { type: [Number], index: "2dsphere" },
    currentloc: { type: [Number], index: "2dsphere" },
    verified: {type: Boolean, required: true},
    profilepic: {type: String, required: false},
    profilethumb: {type: String, required: false},
    background: {type: String, required: false},
    gallery: {type:[String], required: false},
    torate: {type: [RateObject], required: false},
    availablenow: {type: Boolean},
    created: {type: Date, default: Date.now },
    favorites: [mongoose.Schema.Types.Mixed]

});
var User = mongoose.model('Users', userFull);


// Notification Schema
var NotificationSchema = mongoose.Schema;
var notification = new NotificationSchema({
    index: {type: Number, required:false},
    sender: {type: String, required:false},
    uid: {type: String, required:false},
    message: {type: String, required:false},
    localisedMessage: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, expireAt: '72h' }
});
var Notification = mongoose.model('Notifications', notification);


/* =========================
 * -------------------------
 *   AUTHENTICATE ENDPOINT
 * -------------------------
 =========================*/

/**
 * @api {post} api/authenticate/ Authenticate User by username & password
 * @apiName AuthenticateByUsername
 * @apiGroup authenticate
 * @apiVersion 0.0.1
 *
 * @apiParam {String} email The user's email
 * @apiParam {String} password The user's password
 * @apiSuccessExample Success-Response:
 *    returns User Object
 *
 *    @apiUse SpecialistObject
 *
 */
app.post('/api/authenticate', function (req, res) {

    console.log("email:"+req.body.email);
    User.findOne({email: req.body.email, password: req.body.password}, function (err, _specialist) {
        if (!err) {

            if (_specialist != null) {
                console.log("[info] User found");
                return res.status(200).send(_specialist);
            } else {
                console.log("[info] Authentication failed");
                return res.status(401).send('Authentication failed');
            }
        } else {
            return res.send(err);
        }
    });

});

/**
 * @api {get} /authenticate/id/:id Authenticate User by their ID
 * @apiName AuthenticateByID
 * @apiGroup authenticate
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The user's id
 * @apiSuccessExample Success-Response:
 *    returns Specialist Object
 *
 *  @apiUse SpecialistObject
 */

app.get('/api/authenticate/id/:id', function (req, res){

    return User.findById(req.params.id, function (err, user) {

        if (!err) {
            if(user!=null)
                return res.send(user);
            else
                return res.status(501).send("No user with this ID");
        } else {
            console.log(err);
            return res.status(501).send(err);
        }
    })
});



/**
 * @api {get} /authenticate/email/:email Authenticate User by their email
 * @apiName ValidateEmail
 * @apiGroup authenticate
 * @apiVersion 0.0.1
 *
 * @apiParam {String} email The user's email
 * @apiSuccessExample Success-Response:
 *    returns 200 Success
 *
 * @apiErrorExample Error-Response:
 *    returns 401 Already Exists
 *
 */
app.get('/api/authenticate/email/:email', function (req, res){

    console.log("email:"+req.params.email);
    return User.findOne({email: req.params.email}, function (err, user) {
        if (!err) {
            if (user) {
                return res.status(401).send(user); // Allready exists
            }else {
                return res.status(200).send(user); // OK
            }

        } else {
            console.log(err);
            return res.status(401).send(err);
        }
    })
});


/* =========================
 * -------------------------
 *   NOTIFICATIONS ENDPOINT
 * -------------------------
 =========================*/
/**
 * @api {get} /api/notifications/:id Get Messages by user ID
 * @apiName GetMessages
 * @apiGroup notifications
 * @apiVersion 0.0.1
 *
 * @apiParam {String} uid The user's id
 * @apiSuccessExample Success-Response:
 *    returns List of Notification objects
 *
 */
app.get('/api/notifications/:id', function (req, res){

    return Notification.find({uid: req.params.id},{},{sort:{createdAt: -1}}, function (err, notifications) {

        if (!err) {
            return res.send(notifications);
        } else {
            console.log(err);
            return res.status(501).send(err);
        }
    })
});



/* =========================
 * -------------------------
 *   SPECIALISTS ENDPOINT
 * -------------------------
   =========================*/

// Endpoints
/**
 * @api {get} /specialists Get all the Specialists
 * @apiName GetSpecialists
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/specialists', function (req, res){

    return User.find({usertype:"specialist"},{},{sort:{created:-1}}, function (err, specialists) {

        if (!err) {
            return res.send(specialists);
        } else {
            return console.log(err);
        }
    })
});

//app.delete('/api/specialists/:id', function (req, res) {
//
//    User.findById(req.params.id, function (err, user) {
//
//        return user.remove(function (err) {
//            if (!err) {
//                console.log("Done.");
//                return res.status(200).send("Done");
//            } else {
//                console.log(err);
//                return res.status(501).send(err);
//            }
//        });
//
//    });
//
//});

// Endpoints
/**
 * @api {get} /specialists/active Get all the Specialists
 * @apiName GetActive
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/specialists/active', function (req, res){

    return User.find({usertype:"specialist", subscriptionstatus: "active"}, function (err, specialists) {

        if (!err) {
            return res.send(specialists);
        } else {
            return console.log(err);
        }
    })
});

// Endpoints
/**
 * @api {get} /specialists/:id Get Specialist by ID
 * @apiName GetSpecialistsById
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The specialist's id
 * @apiSuccessExample Success-Response:
 *    returns Specialist Object
 *
 */
app.get('/api/specialists/:id', function (req, res){

    return User.findById(req.params.id, function (err, specialist) {

        if (!err) {
            return res.send(specialist);
        } else {
            return console.log(err);
        }
    })
});

app.get('/api/workdates/:id', function (req, res){

    return workDateModel.find({wdid: req.params.id}).
        populate("owner")
        .exec(function(err, workdates){
            if(err)
            res.send(err);
            else
            res.send(workdates);
        })
});

/**
 * @api {post} api/specialists Post a new specialist user
 * @apiName PostSpecialist
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiParam {String} username The username.
 * @apiParam {String} password The password.
 * @apiParam {String} fistname The user's first name.
 * @apiParam {String} lastname The user's last name.
 * @apiParam {String} email The user's registartion email.
 * @apiParam {String} phone The user's registration phone.
 * @apiParam {Boolean} [verified = false] The status of the verification process.
 *
 * @apiSuccessExample Success-Response:
 *    returns Active Specialist object
 *
 */
app.post('/api/specialists', function (req, res){
    var newSpecialist;

    newSpecialist = new User({
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        usertype: "specialist",
        servicesnum: 0,
        rating: 0,
        address: req.body.address,
        addresses: req.body.addresses,
        mood: req.body.mood,
        aboutme: req.body.aboutme,
        fbid: req.body.fbid,
        taxid: req.body.taxid,
        calltype: req.body.calltype,
        services: req.body.services,
        subservices: req.body.subservices,
        schedule: req.body.schedule,
        workschedule: req.body.workschedule,
        profilepic: req.body.profilepic,
        profilethumb: req.body.profilethumb,
        background: req.body.background,
        gallery: req.body.gallery,
        products: req.body.products,
        languages: req.body.languages,
        email: req.body.email,
        phone: req.body.phone,
        loc : req.body.loc,
        currentloc : req.body.currentloc,
        verified: req.body.verified | false,
        pushtoken: req.body.pushtoken,
        googleid: req.body.googleid,
        fbid: req.body.fbid,
        availablenow:req.body.availablenow | false,
        torate: req.body.torate,
        subscriptionstatus: req.body.subscriptionstatus,
        subscriptionends: req.body.subscriptionends
    });

    // Safeguarding specialist object
    if((newSpecialist.addresses == null || newSpecialist.addresses.length == 0) && newSpecialist.address != null ) {

        newSpecialist.addresses = [];

        var address = new AddressModel();
        address.location = newSpecialist.address;
        address.alias = "Default";
        address.geolocation = newSpecialist.loc;
        newSpecialist.addresses.push(address);

    }

    newSpecialist.save(function (err) {
        if (!err) {
            return res.send(newSpecialist);
        } else {
            if (11000 === err.code || 11001 === err.code) {
                return res.status(401).send("[401]: Duplicate key found - username or email");
            }
            else
                return res.send(err.message);
        }
    });

});

/**
 * @api {post} api/specialists/availability Set the Availability Status of the Specialist
 * @apiName availableSpecialist
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiParam {String} _id Specialist's ID
 * @apiParam [double] loc Specialist's current geolocation. Should be set to base Geolocation if status is off.
 * @apiParam {boolean} status Availability status
 *
 * @apiSuccessExample Success-Response:
 *    returns 200 Success
 *
 *  @apiErrorExample Error-Response:
 *    returns 401 Error
 *
 */
app.post('/api/specialists/availability', function (req, res){

    //var currloc;
    //if(req,body.status)
    //    currloc = req.body.loc;
    //else
    //    currloc = null;

    User.update({_id:req.body._id},{currentloc: req.body.loc, availablenow: req.body.status},function(err,stat){
        if(!err)
            res.status(200);
        else
        res.status(401).send(err);
    })


});

/**
 * @api {post} api/subscription/ Set the status of the subscription
 * @apiName setSubscription
 * @apiGroup subscription
 * @apiVersion 0.0.1
 *
 * @apiParam {String} _id Specialist's ID
 * @apiParam [String] status The status of the subscription (active/inactive)
 * @apiParam {Date} [optional] if active, set the end date of teh subscription
 *
 * @apiSuccessExample Success-Response:
 *    returns 200 Success
 *
 *  @apiErrorExample Error-Response:
 *    returns 401 Error
 *
 */
app.post('/api/subscription', function (req, res){

   return User.findByIdAndUpdate (req.body._id,{subscriptionstatus: req.body.subscriptionstatus, subscriptionends: moment(req.body.subscriptionends)},function(err,stat){
        if(!err)
           return res.status(200);
        else
            return res.status(401).send(err);
   });

    return res.status(200);

});


/**
 * @api {put} /specialists Update the Specialist object
 * @apiName UpdateSpecialist
 * @apiGroup Specialists
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The Specialist's ID.
 * @apiParam {String} username The username.
 * @apiParam {String} password The password.
 * @apiParam {String} fistname The user's first name.
 * @apiParam {String} lastname The user's last name.
 * @apiParam {String} email The user's registartion email.
 * @apiParam {String} phone The user's registration phone.
 * @apiParam {[Number]} loc Geolocation of Specialist
 * @apiParam {Boolean} [verified = false] The status of the verification process.
 *
 * @apiSuccessExample Success-Response:
 *    returns Modified Specialist object
 *
 */
app.put('/api/specialists/:id', function (req, res){
    return User.findById(req.params.id, function (err, _specialist) {
        _specialist.fbid = req.body.fbid;
        _specialist.subservices = req.body.subservices;
        _specialist.background = req.body.background;
        _specialist.gallery = req.body.gallery;
        _specialist.products = req.body.products;
        _specialist.languages = req.body.languages;
        _specialist.currentloc = req.body.currentloc;
        _specialist.verified = req.body.verified;
        _specialist.mood = req.body.mood;
        _specialist.taxid = req.body.taxid;
        _specialist.password = req.body.password;
        _specialist.firstname = req.body.firstname;
        _specialist.lastname = req.body.lastname;
        _specialist.schedule = req.body.schedule;
        _specialist.workschedule = req.body.workschedule;
        _specialist.usertype = req.body.usertype;
        _specialist.calltype = req.body.calltype;
        _specialist.services = req.body.services;
        _specialist.profilepic = req.body.profilepic;
        _specialist.profilethumb = req.body.profilethumb;
        _specialist.email = req.body.email;
        _specialist.phone = req.body.phone;
        _specialist.loc = req.body.loc;
        _specialist.address = req.body.address;
        _specialist.addresses =  req.body.addresses;
        _specialist.pushtoken =  req.body.pushtoken;
        _specialist.googleid =  req.body.googleid;
        _specialist.availablenow = req.body.availablenow | false;
        _specialist.torate = req.body.torate;


        if(req.body.secret = "a21th21_A21") {
            _specialist.subscriptionstatus = req.body.subscriptionstatus;
            _specialist.subscriptionends = req.body.subscriptionends;
        }

        // Safeguarding specialist object
        if((_specialist.addresses == null || _specialist.addresses.length == 0) && _specialist.address != null ) {
            var address = new AddressModel();
            address.location = _specialist.address;
            address.alias = "Default";
            address.geolocation = _specialist.loc;
            _specialist.addresses.push(address);
        }

        if(_specialist.address !=null && _specialist.address != _specialist.addresses[0].location)
            _specialist.addresses[0].location = _specialist.address;

        //delete(_specialist.address);

        return _specialist.save(function (err) {
            if (!err) {
                return res.send("Done");
            } else {
                return res.status(401).send(err.message);
            }

        });
    });
});



/* =========================
 * -------------------------
 *   USERS ENDPOINT
 * -------------------------
 =========================*/

// Endpoints
/**
 * @api {get} /users Get all the Users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of User Objects
 *
 */
app.get('/api/users', function (req, res){
    console.log("now");
    return User.find({usertype:"user"},{},{sort:{created:-1}}, function (err, users) {

        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    })
});


// Endpoints
/**
 * @api {get} /users/:id Get User by ID [deprecated]
 * @apiName GetUSerById
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The user's id
 * @apiSuccessExample Success-Response:
 *    returns User Object
 *
 */
app.get('/api/users/:id', function (req, res){

    return User.findById(req.params.id, function (err, user) {

        if (!err) {
            return res.send(user);
        } else {
            return console.log(err);
        }
    })
});

/**
 * @api {post} /users Post a new User
 * @apiName PostUser
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiParam {String} username The username.
 * @apiParam {String} password The password.
 * @apiParam {String} fistname The user's first name.
 * @apiParam {String} lastname The user's last name.
 * @apiParam {String} email The user's registartion email.
 * @apiParam {String} phone The user's registration phone.
 * @apiParam {Boolean} [verified = false] The status of the verification process.
 *
 * @apiSuccessExample Success-Response:
 *    returns Active User object
 *
 * @apiErrorExample Error-Response:
 *    returns Active User object
 */
app.post('/api/users', function (req, res){
    var newUser;


    newUser = new User({
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        usertype: "user",
        addresses: req.body.addresses,
        email: req.body.email,
        phone: req.body.phone,
        loc : req.body.loc,
        verified: req.body.verified | false,
        fbid: req.body.fbid,
        pushtoken:  req.body.pushtoken
    });

    newUser.save(function (err) {
        if (!err) {
            return res.send(newUser);
        } else {
            if (11000 === err.code || 11001 === err.code) {
                console.log("[401]: Duplicate key found - username or email");
                return res.status(401).send("[401]: Duplicate key found - username or email");
            }
            else
                return res.send(err);
        }
    });

});

/**
 * @api {put} /users Update the User object
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The User's ID.
 * @apiParam {String} username The username.
 * @apiParam {String} password The password.
 * @apiParam {String} fistname The user's first name.
 * @apiParam {String} lastname The user's last name.
 * @apiParam {String} email The user's registartion email.
 * @apiParam {String} phone The user's registration phone.
 * @apiParam {[Number]} loc Geolocation of User
 * @apiParam {Boolean} [verified = false] The status of the verification process.
 *
 * @apiSuccessExample Success-Response:
 *    returns Modified Specialist object
 *
 */
app.put('/api/users/:id', function (req, res){
    return User.findById(req.params.id, function (err, user) {
        _specialist.username = req.body.username;
        _specialist.password = req.body.password;
        _specialist.firstname = req.body.firstname;
        _specialist.lastname = req.body.lastname;
        _specialist.usertype = req.body.usertype;
        _specialist.addresses = req.body.addresses;
        _specialist.email = req.body.email;
        _specialist.phone = req.body.phone;
        _specialist.loc = req.body.loc;
        _specialist.pushtoken = req.body.pushtoken;
        _specialist.fbid = req.body.fbid;

      //  delete(_specialist.address);

        return _specialist.save(function (err) {
            if (!err) {
                console.log("Done.");
            } else {
                console.log(err);
            }
            return res.send(user);
        });
    });
});


/* =========================
 * -----------------------------------
 *   SPECIALISTS CALENDAR ENDPOINTS
 * -----------------------------------
 =========================*/

/**
 * @api {get} api/calendar/schedule/owner/:id Get specialist's schedule
 * @apiName GetSchedule
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} id The specialist's id.
 *
 * @apiSuccessExample Success-Response:
 *    returns A specialist working schedule
 *
 */
app.get('/api/calendar/schedule/owner/:id', function (req, res) {
    Schedule.findOne({owner: req.params.id},function(err, schedule){
        if(!err)
        {
            res.send(schedule);
        }
        else
            res.send(err);
    });

});

/**
 * @api {post} api/calendar/schedule Post specialist's schedule
 * @apiName PostSchedule
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} owner String ID of the Specialist
 * @apiParam {String} days String array of days
 * @apiParam {String} timeblocks String array of timeblocks
 *
 * @apiSuccessExample Success-Response:
 *    returns A specialist working schedule
 *
 */
app.post('/api/calendar/schedule', function (req, res) {

    // First create a workdate
    var newschedule = new Schedule({
        owner: req.body.owner,
        days: req.body.days,
        timeblocks: req.body.timeblocks
    });

    var newscheduleobject = newschedule.toObject();

// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete newscheduleobject._id;


    // Then Upsert it
    Schedule.update({owner: req.body.owner}, newscheduleobject,{upsert:true},function(err, schedule){
        if(!err)
        {
            res.status(200);
        }
        else
            res.send(err);
    });

});

/**
 * @api {get} /calendar/:id Get specialist's schedule
 * @apiName GetWorkDates
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} id The specialist's id.
 *
 * @apiSuccessExample Success-Response:
 *    returns List of WorkDate Objects
 *
 */
app.get('/api/calendar/:id', function (req, res) {

    workDateModel.find({owner: req.params.id},function(err, _workdates){
        if(!err)
        {
            res.send(_workdates);
        }
        else
            res.send(err);
    });

});


/**
 * @api {post} /calendar/workdate/:id Post a WorkDate in the specialist's schedule
 * @apiName PostWorkDate
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} id The specialist's id.
 * @apiParam {Date} workday The Date of the workdate
 * @apiParam {String} wdid string representation of the Date
 * @apiParam {[String]} timeslots An Array of time slots in the day
 *
 * @apiSuccessExample Success-Response:
 *    returns Specialist Object
 *
 */
app.post('/api/calendar/workdate/:id', function (req, res) {

    if(!req.body.wdid) return res.status(404).send("No valid workdate ID found!");

    // First create a workdate
    var workdate = new workDateModel({
        workday: req.body.workday,
        wdid: req.body.wdid,
        timeslots: req.body.timeslots,
        owner: req.params.id
    });

    var upsertData = workdate.toObject();

// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete upsertData._id;


    // Then Upsert it
    workDateModel.update({wdid: req.body.wdid}, upsertData,{upsert:true},function(err, _workdate){
        if(!err)
        {
            res.send(workdate);
        }
        else
         res.send(err);
    });

});

/**
 * @api {put} /specialists/workdate/:id Update a WorkDate on the specialist's schedule
 * @apiName UpdateWorkDate
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} id The workdate _id
 *
 * @apiSuccessExample Success-Response:
 *    returns Specialist Object
 *
 */
app.put('/api/calendar/workdate/:id', function (req, res) {

    return workDateModel.findById(req.params.id, function (err, workdate) {


        workdate.workday = req.body.workday;
        workdate.wdid = req.body.wdid;
        workdate.owner= req.body.owner;
        workdate.timeslots = req.body.timeslots;

            return workdate.save(function (err) {
                if (!err) {
                    console.log("Done.");
                } else {
                    console.log(err);
                }

                return res.status(200).send(workdate);
            });


    });

});

/**
 * @api {delete} /specialists/workdate/:id Delete a WorkDate from the specialist's schedule
 * @apiName DeleteWorkDate
 * @apiGroup Calendar
 * @apiVersion 0.0.1
 * @apiParam {String} id The workdate _id
 *
 * @apiSuccessExample Success-Response:
 *    returns Specialist Object
 *
 */
app.delete('/api/calendar/workdate/:id', function (req, res) {

    workDateModel.findById(req.params.id, function (err, workdate) {

        return workdate.remove(function (err) {
            if (!err) {
                console.log("Done.");
                res.status(200);
            } else {
                console.log(err);
                res.status(501).send(err);
            }
        });

    });

});

/* =========================
 * ---------------------------
 *   APPOINTMENTS ENDPOINTS
 * ---------------------------
 =========================*/

/**
 * @api {get} /appointments/:id Get appointment by ID
 * @apiName GetSpecialistAppointments
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} id Appointment ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      returns List of Appointment Object
 */
app.get('/api/appointments/:id', function (req, res){

    return AppointmentsModel.findById(req.params.id, function (err, appointment) {

        if (!err) {
            return res.send(appointment);
        } else {
            return console.log(err);
        }
    })

});


/**
 * @api {get} /appointments/:id/pending/count Get count of pending appointments
 * @apiName GetSpecialistAppointments
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} id Appointment ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      returns number
 */
app.get('/api/appointments/:id/pending/count', function (req, res){

    return AppointmentsModel.find({sid:req.params.id, "status":"pending"}).count( function (err, count) {
        if (!err) {
            return res.send({"count":count});
        } else {
            return res.send(err);
        }
    })

});

/**
 * @api {get} /appointments/user/:id Get all appointments of User
 * @apiName GetUserAppointments
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} id User ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      returns List of Appointment Object
 */
app.get('/api/appointments/user/:id', function (req, res){

    return AppointmentsModel.find({uid: req.params.id}, function (err, appointments) {

        if (!err) {
            return res.send(appointments);
        } else {
            return console.log(err);
        }
    })

});

/**
 * @api {post} api/appointments/tokenUpdate/ Update Token in the user appointments
 * @apiName UpdateToken
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} id User ID
 * @apiParam {String} token User Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      returns List of Appointment Object
 */
app.post('/api/appointments/tokenUpdate/', function (req, res){

    AppointmentsModel.update({uid:req.body.id}, { $set: { utoken: req.body.token }},{multi:true},function(err,ret){
        if(err)
        return res.send(err);
    });
    AppointmentsModel.update({sid:req.body.id}, { $set: { stoken: req.body.token }},{multi:true},function(err,ret){
        if(err)
            return res.send(err);
    });

    res.sendStatus(200);
});

/**
 * @api {get} /appointments/specialist/:id Get all appointments of Specialist
 * @apiName GetSpecialistAppointments
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} id Specialist ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      returns List of Appointment Object
 */
app.get('/api/appointments/specialist/:id', function (req, res){

    return AppointmentsModel.find({sid: req.params.id},{},{sort:{startdate: 1 }}, function (err, appointments) {

        if (!err) {
            return res.send(appointments);
        } else {
            return console.log(err);
        }
    })

});

/**
 * @api {post} /appointments Post a new appointment request
 * @apiName RequestAppointment
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {String} uid User ID
 * @apiParam {String} user MiniUser
 * @apiParam {String} sid Specialist ID
 * @apiParam {String} specialist MiniUser
 * @apiParam {String} subservicetype Sub-Service type (full string not ID)
 * @apiParam {String} wdid Work day ID.
 * @apiParam {[String]} timeslots Contain only the starting slot (the specialist will fill the duration).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
app.post('/api/appointments', function (req, res) {

    var sendPush = 0;
    if (req.body.status == null) {
        sendPush = 1;
    }


    var appointmentRange = new workDateModel({
        wdid: req.body.timetable[0].wdid,
        timeslots: req.body.timetable[0].timeslots
    });

    var appointmentDate = ConvertworkDate(appointmentRange);

    var comment;
    if(req.body.comment!=undefined)
        comment = req.body.comment;
    else
        comment = "Θα ήθελα να κλείσω ένα ραντεβού."

    var userRequestComment = new CommentModel({
        name: req.body.uname,
        comment: comment,
        createdAt: req.body.created
    });

    var appointment = new AppointmentsModel({
        upic: req.body.upic,
        uname: req.body.uname,
        uid: req.body.uid,
        utoken: req.body.utoken,
        spic: req.body.spic,
        sname: req.body.sname,
        calltype: req.body.calltype,
        sid: req.body.sid,
        address: req.body.address,
        stoken: req.body.stoken,
        subservicetype: req.body.subservicetype,
        status: "pending",
        startdate: appointmentDate,
        rated: false,
        notified: false,
        requestedon: moment(),
        distance: req.body.distance,
        cost: req.body.cost
    });


    appointment.timetable.push(appointmentRange);
    appointment.comments.push(userRequestComment);

    // Let's get the address for safekeeping and add
    // specialist to favorites
    User.findById(appointment.uid, function (err, user) {

        if(!err) {

            // First safeguard the address of the appointment
            if (appointment.address == null) {
                if (user.addresses != null && user.addresses.length > 0)
                    appointment.address = user.addresses[0].location;
                else
                    appointment.address = user.address;
            }


            var notExists = true;
            for (var i=0; i < user.favorites.length; i++)
            {
                if (user.favorites[i].id.match(appointment.sid))
                {
                    notExists = false;
                }
            }

            console.log("notExists: "+notExists);
            if(notExists) {

                user.favorites.push({"id": appointment.sid, "pic": appointment.spic});

                console.log(user.favorites.length);
                user.markModified('favorites');
                user.save();
            }
        }
        else{
            console.log(err);
            return res.send(err);
        }


    });

    if (appointment.address != null) {

        appointment.save(function (err) {
            if (!err) {
                if (sendPush == 1) {
                    var data = {"page": "AppointmentView", "id": appointment._id};
                    var messages = {
                        "en":req.body.uname + " has requested an appointment.",
                        "el":"Ο "+req.body.uname + " σας ζήτησε ένα ραντεβού."
                    }

                    pushUser([req.body.stoken], messages, [req.body.sid], data);
                }
                return res.send(appointment);
            } else {
                console.log(err);
                return res.send(err);
            }
        });
    }

});

var ConvertworkDate = function(workObj) {

    var dt = workObj.wdid.split("-");

    var stringdate = dt[2]+"-"+(("0" + dt[0]).slice(-2))+"-"+(("0" + dt[1]).slice(-2))+"T"+convertTimeBlockToHour(parseInt(workObj.timeslots[0]));


    var appdate = new Date(stringdate);
    //console.log(appdate);
    return appdate;

}

var convertTimeBlockToHour = function (TimeBlock)
{
    var blocksperDay = 48;
    var minuteInTimeBlock = (24 * 60) / blocksperDay;
    var fullMinutes = minuteInTimeBlock * TimeBlock;
    var hour = Math.floor(fullMinutes / 60);
    var minutes = fullMinutes % 60;

    return (("0" + hour).slice(-2))+":"+(("0" + minutes).slice(-2));
}

/**
 * @api {put} /appointments Update appointment status
 * @apiName UpdateAppointment
 * @apiGroup Appointments
 * @apiVersion 0.0.1
 * @apiParam {Appointment} ApppointmentObject The Appointment Object to be updated
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
app.put('/api/appointments/:id', function (req, res){

    return AppointmentsModel.findById(req.params.id, function (err, appointment) {

        //console.log(appointment);

        if (!err) {

            if(appointment.status == "pending" && req.body.status == "accepted") {
                var data = {"page":"AppointmentView","id":appointment._id};
                var messages = {
                    "en":"Your appointment with "+req.body.sname +" has been accepted",
                    "el":"Ο "+req.body.sname +" αποδέχθηκε το ραντεβού σας"
                }
                pushUser([appointment.utoken], messages, [appointment.uid],data);
            }
            else  if(appointment.status == "pending" && req.body.status == "rejected") {
                var messages = {
                    "en":"Your appointment with "+req.body.sname +" has been rejected",
                    "el":"Ο "+req.body.sname +" δεν αποδέχθηκε το ραντεβού σας"
                }
                var data = {"page":"AppointmentView","id":appointment._id};
                pushUser([appointment.utoken], messages, [appointment.uid],data);
            }else if(appointment.status =="pending" && req.body.status=="canceled"){
                var messages = {
                    "en":"The appointment requested by "+req.body.uname +" has been canceled.",
                    "el":"Το ραντεβού σας με τον "+req.body.sname +" ακυρώθηκε."
                }
                var data = {"page":"AppointmentView","id":appointment._id};
                pushUser([appointment.stoken], "The appointment requested by "+req.body.uname +" has been canceled.", [appointment.uid],data);
            }else if(appointment.comments.length != req.body.comments.length){
                var data = {"page":"AppointmentView","id":appointment._id};
                var messages = {
                    "en":"One of your appointments has been updated.",
                    "el":"Ένα από τα ραντεβού σας έχει τροποποιηθεί."
                }
                pushUser([appointment.utoken,appointment.stoken], messages, [appointment.uid, appointment.sid],data);
            }



            appointment.status = req.body.status;
            appointment.timetable = req.body.timetable;
            appointment.comments = req.body.comments;



            return appointment.save(function (err) {
                if (!err) {
                    console.log("Done.");
                    return res.status(200).send("Appointment saved");
                } else {
                    console.log(err);
                    return res.send(err);
                }


                return res.send(appointment);
            });
         }
        else
         {
             console.log(err);
         return res.send(err);
         }
    });

});


/* =========================
 * -------------------------
 *   PAYPAL LISTENER ENDPOINT
 * -------------------------
 =========================*/

var querystring =  require('querystring');

app.use('/api/paypal_listener',bodyParser.urlencoded());
app.post('/api/paypal_listener', function(req, res) {
    console.log('Received POST /');
    // STEP 1: read POST data
    req.body = req.body || {};
    res.send(200, 'OK');
    res.end();

    // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
    var postreq = 'cmd=_notify-validate';
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            var value = querystring.escape(req.body[key]);
            postreq = postreq + "&" + key + "=" + value;
        }
    }

    // Step 2: POST IPN data back to PayPal to validate
    console.log('Posting back to paypal');
    var options = {
        method: 'POST',
        headers: {
            'Connection': 'close'
        },
        body: postreq,
        strictSSL: true,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };

    needle.post('https://www.sandbox.paypal.com/cgi-bin/webscr',postreq,options, function callback(err, res, body) {
        if (!err && res.statusCode === 200) {

            // inspect IPN validation result and act accordingly

            if (body.substring(0, 8) === 'VERIFIED'){
                // The IPN is verified, process it
                console.log('Verified IPN!');
                // assign posted variables to local variables
                var item_name = req.body['item_name'];
                var item_number = req.body['item_number'];
                var payment_status = req.body['payment_status'];
                var payment_amount = req.body['mc_gross'];
                var payment_currency = req.body['mc_currency'];
                var txn_id = req.body['txn_id'];
                var receiver_email = req.body['receiver_email'];
                var payer_email = req.body['payer_email'];
                var User_id=req.body['custom'];

                if(payment_status=='Completed' ) {
                    // Store new Invoice
                    var newInvoice;
                    newInvoice = new InvoiceModel({
                        sid: User_id,
                        invoiceid: txn_id,
                        invoicedate: moment(),
                        itemname: item_name,
                        sum: payment_amount
                    });
                    newInvoice.save(function (err) {
                        if (!err) {
                            console.log("[Invoice saved]");
                        } else {
                            console.log(err);
                        }
                    });
                }

                if(item_number=='cityfab2month'&& payment_amount=='20.00'&& payment_status=='Completed' ){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+3; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10) {
                        dd='0'+dd
                    }
                    if(mm<10) {
                        mm='0'+mm
                    }
                    var expiry = yyyy+'-'+mm+'-'+dd;
                    User.findByIdAndUpdate({_id:User_id},{"subscriptionstatus":"active","subscriptionends":expiry},function(err,stat){
                        if (!err)
                            return '200';
                        else
                            console.log(err);
                        return '401';
                    });

                }
                else if(item_number=='cityfab6month'&& payment_amount=='100.00'&& payment_status=='Completed'){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+7; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10) {
                        dd='0'+dd
                    }
                    if(mm<10) {
                        mm='0'+mm
                    }
                    var expiry = yyyy+'-'+mm+'-'+dd;
                    User.findByIdAndUpdate({_id:User_id},{"subscriptionstatus":"active","subscriptionends":expiry},function(err,stat) {
                        if (!err)
                            return '200';
                        else
                            console.log(err);
                        return '401';
                    });

                }
                else if(item_number=='cityfab1year'&& payment_amount=='200.00'&& payment_status=='Completed'){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+13; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }
                    if(mm<10) {
                        mm='0'+mm
                    }
                    var expiry = yyyy+'-'+mm+'-'+dd;
                    User.findByIdAndUpdate({_id:User_id},{"subscriptionstatus":"active","subscriptionends":expiry},function(err,stat) {
                        if (!err)
                            return '200';
                        else
                            console.log(err);
                        return '401';
                    });
                }
                //More of the same

            } else if (body.substring(0, 7) === 'INVALID') {
                // IPN invalid, log for manual investigation
                console.log('Invalid IPN!'.error);
            }
        }
        else{
            console.log(res.statusCode);
        }
    });

});




/* =========================
 * -----------------------------------
 *   REVIEW ENDPOINTS
 * -----------------------------------
 =========================*/
/**
 * @api {post} /review Post a new review
 * @apiName PostReview
 * @apiGroup Reviews
 * @apiVersion 0.0.1
 *
 * @apiParam {String} sname The specialist's name
 * @apiParam {String} pic The specialist's profile pic
 * @apiParam {String} sid The specialist's ID
 * @apiParam {String} stoken The specialist's push token
 * @apiParam {String} uname The name of the user submitting the review
 * @apiParam {Number} rating The rating given by the user
 * @apiParam {String} review The review is available given by the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
app.post('/api/review', function (req, res){

    var review = new RateModel({
        sname: req.body.sname,
        pic: req.body.pic,
        sid: req.body.sid,
        stoken: req.body.stoken,
        uname: req.body.uname,
        rating: req.body.rating,
        review: req.body.review,
        createdAt: moment()
        // We remove reviews after a period of 6 months
        //expireAt: moment().add({months: 6})
    });

    var messages = {
        "en":req.body.uname+ " has posted a review about your recent service",
        "el":"Ο "+req.body.uname+ " σας έκανε review για το πρόσφατο ραντεβού σας"
    }

    pushUser([req.body.stoken], req.body.uname+ " has posted a review about your recent service", [req.body.sid],null);

    var trimedReview  = review.toObject();

    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete trimedReview._id;


  return  User.findById(req.body.sid ,function(err, specialist){
        if (err) {
           return res.send(err);
        } else {
            // We have a user, we have the review; Let's do the grill work now

            // First, we push the review to the specialist for safekeeping
            specialist.reviews.push(trimedReview);

            // Then, we calculate the actual rating from the new review
            specialist.rating = SimpleRatingAlgorith(specialist);

            // Finally we update the specialist object
            specialist.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                } else {
                    console.log("Review Submitted");
                    return res.status(200).send();
                }
            });

            return res.status(200).send();
        }
    });

});

/**
 * This is the simple rating algorithm
 * In later versions we should implement a method that takes
 * in account  the number of services performed and
 * also the amount of bookings by the same users
 */
var SimpleRatingAlgorith = function (specialist) {
    var rating = 0;
    var numberOfRatings = specialist.reviews.length;
    var thumbsUp = 0;

    for(var i = 0; i< numberOfRatings; i++)
        if(specialist.reviews[i].rating == 1) thumbsUp ++;

    // Return the rating
    return Math.round( (thumbsUp / numberOfRatings * 10) * 10 ) / 10; ;
};

/* =========================
 * -----------------------------------
 *   SEARCH ENDPOINTS
 * -----------------------------------
 =========================*/
/**
 * @api {get} /search/all Search All
 * @apiName SearchAll
 * @apiGroup Search
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/search/all', function (req, res){

    return User.find({}, function (err, users) {

        if (!err) {
            return res.send(users);
        } else {
            console.log(users);
            return res.send(err);
        }
    })
});

app.delete('/api/search/all/:id', function (req, res) {

    User.findById(req.params.id, function (err, user) {

        return user.remove(function (err) {
            if (!err) {
                console.log("Done.");
                res.status(200);
            } else {
                console.log(err);
                res.status(501).send(err);
            }
        });

    });

});

//Helper for dashboard
app.post('/api/search/all/', function (req, res){
    var newSpecialist;

    newSpecialist = new User({
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        usertype: "specialist",
        addresses: req.body.addresses,
        mood: req.body.mood,
        aboutme: req.body.aboutme,
        fbid: req.body.fbid,
        services: req.body.services,
        subservices: req.body.subservices,
        schedule: req.body.schedule,
        profilepic: req.body.profilepic,
        profilethumb: req.body.profilethumb,
        background: req.body.background,
        gallery: req.body.gallery,
        products: req.body.products,
        languages: req.body.languages,
        email: req.body.email,
        phone: req.body.phone,
        loc : req.body.loc,
        currentloc : req.body.currentloc,
        verified: req.body.verified | false,
        pushtoken: req.body.pushtoken,
        googleid: req.body.googleid,
        fbid: req.body.fbid
    });

    newSpecialist.save(function (err) {
        if (!err) {
            return res.send(newSpecialist);
        } else {
            console.log(err);
            if (11000 === err.code || 11001 === err.code) {
                return res.status(401).send("[401]: Duplicate key found - username or email");
            }
            else
                return res.send(err);
        }
    });

});

//Helper for dashboard
app.put('/api/search/all/:id', function (req, res){
    return User.findById(req.params.id, function (err, _specialist) {
        console.log(req.body.schedule);
        _specialist.fbid = req.body.fbid;
        _specialist.subservices = req.body.subservices;
        _specialist.background = req.body.background;
        _specialist.gallery = req.body.gallery;
        _specialist.products = req.body.products;
        _specialist.languages = req.body.languages;
        _specialist.currentloc = req.body.currentloc;
        _specialist.verified = req.body.verified;
        _specialist.password = req.body.password;
        _specialist.firstname = req.body.firstname;
        _specialist.lastname = req.body.lastname;
        _specialist.schedule = req.body.schedule;
        _specialist.usertype = req.body.usertype;
        _specialist.services = req.body.services;
        _specialist.profilepic = req.body.profilepic;
        _specialist.profilethumb = req.body.profilethumb;
        _specialist.email = req.body.email;
        _specialist.phone = req.body.phone;
        _specialist.loc = req.body.loc;
        _specialist.addresses =  req.body.addresses;
        _specialist.pushtoken =  req.body.pushtoken;
        _specialist.googleid =  req.body.googleid;




        return _specialist.save(function (err) {
            if (!err) {
                console.log("Done");
                return res.send("Done");
            } else {
                console.log(err);
                return res.send(err);
            }

        });
    });
});

/**
 * @api {get} /search Search Specialists
 * @apiName SearchSpecialists
 * @apiGroup Search
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/search', function (req, res){

    return User.find({usertype:"specialist"}, function (err, specialists) {

        if (!err) {
            return res.send(specialists);
        } else {
            return console.log(err);
        }
    })
});

var global = true;
app.get('/api/search/global/:state', function (req, res) {

    global = req.params.state;

    res.send('Cityfab API Global Search set to: '+global);
});

/**
 * @api {get} /api/search/location/current/:long/:lat/:max Search Specialists by current Geolocation. Used for "Book now" function
 * @apiName SearchLocationCurrent
 * @apiGroup Search
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/search/location/current/:long/:lat/:max', function (req, res){


   var max = req.params.max;
   // max = 9000;
    // Do not take in account distance
    //max = null;

    if(global==false) {
        return User.find({
            usertype: "specialist",
            subscriptionstatus: "active",
            currentloc: {
                $near: {
                    $geometry: {type: "Point", coordinates: [req.params.long, req.params.lat]},
                    $minDistance: 1,
                    $maxDistance: max
                }
            }
        }, function (err, specialists) {

            if (!err) {
                return res.send(specialists);
            } else {
                return console.log(err);
            }
        });
    }else{
        return User.find({
            usertype: "specialist",
            subscriptionstatus: "active"
        },{},{}, function (err, specialists) {

            if (!err) {
                return res.send(specialists);
            } else {
                return console.log(err);
            }
        });
    }
});

/**
 * @api {get} /api/search/location/current/:long/:lat/:max Search Specialists by current Geolocation. Used for "Book now" function
 * @apiName SearchLocationCurrent
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/v1/search/bylocation/:long/:lat/:max', function (req, res){


    var max = req.params.max;
    max = 30000;

        return User.find({
           usertype: "specialist"
            ,subscriptionstatus: "active"
            ,currentloc: {
                $near: {
                    $geometry: {type: "Point", coordinates: [req.params.long, req.params.lat]},
                    $minDistance: 1,
                    $maxDistance: max
                }
            }
        })
            .select('firstname lastname profilepic profilethumb rating services currentloc calltype availablenow')
            .exec( function (err, specialists) {

            if (!err) {
                return res.send(specialists);
            } else {
                return console.log(err);
            }
        });
});

/**
 * @api {get} /api/search/location/current/:long/:lat/:max Search Specialists by current Geolocation. Used for "Book now" function
 * @apiName SearchLocationCurrent
 * @apiGroup Search
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/v1/search/:byname/:long/:lat/:max', function (req, res){

    var max = req.params.max;
    max = 30000;

    var name = req.params.byname;
    //console.log( searchString);

    return User.find({
        usertype: "specialist"
        ,subscriptionstatus: "active"
        ,
        //currentloc: {
        //    $near: {
        //        $geometry: {type: "Point", coordinates: [req.params.long, req.params.lat]},
        //        $minDistance: 1,
        //        $maxDistance: max
        //    }
        //},
        $or: [ { "lastname": new RegExp(name, "i")}, { "firstname": new RegExp(name, "i")} ]
    })
        .select('firstname lastname profilepic profilethumb rating services currentloc calltype availablenow')
        .exec( function (err, specialists) {

            if (!err) {
                return res.send(specialists);
            } else {
                return console.log(err);
            }
        });
});

/**
 * @api {get} /search/location Search Specialists by Geolocation
 * @apiName SearchLocation
 * @apiGroup Search
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample Success-Response:
 *    returns List of Specialist Objects
 *
 */
app.get('/api/search/location/:long/:lat/:max', function (req, res){

    return User.find({
        usertype:"specialist",
        loc:
        { $near :
        {
            $geometry: { type: "Point",  coordinates: [ req.params.long, req.params.lat ] },
            $minDistance: 0,
            $maxDistance: req.params.max
        }
        }
    }, function (err, specialists) {

        if (!err) {
            return res.send(specialists);
        } else {
            return console.log(err);
        }
    })
});

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'http://bedbugstudiocom.ipage.com',
    secure: false,
    port: 587,
    auth: {
        user: 'sender@bedbugstudio.com',
        pass: 'a21th21_A21'
    },
    tls: {
        rejectUnauthorized:false
    }
}));

app.post('/api/email', function(req,res){
    User.findOne({email: req.body.email}, function (err, _specialist) {
        if(!err){
            if (_specialist != null) {
                console.log("[info] User found");
                var mailoptions={
                    from: 'sender@bedbugstudio.com',
                    to: _specialist.email,
                    subject: 'Cityfab - Password Recovery Information ',
                    text: 'Your password for cityfab is '+_specialist.password+'.'
                };
                transporter.sendMail(mailoptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    }
                });
                return res.status(200).send('You should receive an email containing your information shortly');
                //return res.status(200).send(_specialist);
            } else {
                console.log("[info] User not found");
                return res.status(401).send('Email/User not found');
            }
        }
        else{
            console.log(error.message);
            return res.send(err);
        }
    })
});



/* =========================
 * -------------------------
 *   SETTINGS ENDPOINT
 * -------------------------
 =========================*/
var appSettingsSchema = mongoose.Schema;
var appSettings = new appSettingsSchema({
    token: {type: String},
    background_prefix: {type: String},
    icon_prefix: {type: String},
    icon_thumb_prefix: {type: String},
    gallery_prefix: {type: String}

});
var appSettingsModel = mongoose.model('app_settings', appSettings);
// Endpoints
app.get('/api/appsettings/:id', function (req, res){

    return appSettingsModel.findOne({} , function (err, settings) {

        if (!err) {
            //console.log(settings);
            //console.log(settings);
            return res.send(settings);
        } else {
            //console.log(err);
            return res.send(err);
        }
    });
});


// Schema
var SettingsSchema = mongoose.Schema;
var Settings = new SettingsSchema({
    server: {type: String, required: true},
    imagepath: {type: String, required: true},
    sockets: {type: String, required: true},
    polling: {type: String, required: true}
});
var SettingsModel = mongoose.model('Settings', Settings);

// Endpoints
app.get('/api/settings', function (req, res){

    return SettingsModel.findOne({} , function (err, settings) {

        if (!err) {
            console.log(settings);
            return res.send(settings);
        } else {
            console.log(err);
            return res.send(err);
        }
    });
});

app.put('/api/settings/:id', function (req, res){
    return SettingsModel.findById(req.params.id, function (err, settings) {

        settings.server = req.body.server;
        settings.imagepath= req.body.imagepath;
        settings.sockets= req.body.sockets;
        settings.polling = req.body.polling;

        return settings.save(function (err) {
            if (!err) {
                console.log("Done.");
            } else {
                console.log(err);
            }
            return res.send(settings);
        });
    });
});

app.post('/api/settings/', function (req, res){

    var settings = new SettingsModel({
        _id: req.body._id,
        server: req.body.server,
        imagepath: req.body.imagepath,
        sockets: req.body.sockets,
        polling: req.body.polling
    });


    settings.update(
        {_id: _id},
        {$setOnInsert: settings},
        {upsert: true},
        function(err, returned) {
            if (!err) {
                return res.send(returned);
            } else {
                return res.send(err);
            }
        });

});


/* ================================
 *  File handling
 ** ==============================*/
app.options('/api/upload', function(req, res){
    console.log('OPTIONS:'+ flow);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(200).send();
});


app.get('/api/download/:identifier', function(req, res) {
    flow.write(req.params.identifier, res);
});

// Handle status checks on chunks through Flow.js
app.get('/api/upload/', function(req, res) {
    console.log("Identifier:"+req.params.identifier);
    flow.get(req, function(status, filename, original_filename, identifier) {

        if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }
        if (status == 'found') {
            status = 200;
        } else {
            status = 404;
        }

        res.status(status).send();
    });
});

// Handle uploads through Flow.js
app.post('/api/upload', multipartMiddleware, function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier, currentTestChunk, numberOfChunks) {
        console.log('POST', status, original_filename, identifier, currentTestChunk, numberOfChunks);

        if (status == "done" && currentTestChunk > numberOfChunks){
            console.log("now saving to ./tmp/"+filename);
            var stream = fs.createWriteStream('./img/' + filename);
            //EDIT: I removed options {end: true} because it isn't needed
            //and added {onDone: flow.clean} to remove the chunks after writing
            //the file.
            stream.on('finish', function() {

                res.status(200).send();

            });

            flow.write(identifier, stream, { onDone: flow.clean(identifier) }); //,
        }


    })
});



/* ================================
 *  Server Launch
 ** ==============================*/
var server = app.listen(4242, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Cityfab API listening at http://%s:%s', host, port)

});

//
//
///* =========================
// * ------------------------------------
// *   Appointments Platform Functions
// * ------------------------------------
//   =========================*/
//
//
//var AppointmentsCheck = setInterval(function () {AppointmentsTimer()}, 180000); //120000
//
//function AppointmentsTimer() {
//
//    var d =  moment();
//    //console.log(d.toString());
//    var MS_PER_MINUTE = 60000;
//
//    // 30 minutes back
//    var CheckDate =  d.subtract({minutes: 30});
//
//    console.log("[Running Timed Checks]");
//
//    //  +++++++++++++++++++++++++++
//    //    Request Review from Users
//    //  +++++++++++++++++++++++++++
//    AppointmentsModel.find({startdate: {$lt: CheckDate.toString()}, rated: false, status: "accepted"}, function (err, appointments) {
//        if (!err) {
//            for(var i in appointments){
//                var appoint = appointments[i];
//                console.log("[Run Appointments Check]: Found appointment needing review");
//
//                var newToRate = RateModel({
//                    sname: appoint.sname,
//                    pic: appoint.pic,
//                    sid: appoint.sid,
//                    stoken: appoint.stoken,
//                    uname: appoint.uname,
//                    rating: 0,
//                    review: ""
//                    }
//                )
//
//                var rateObject = newToRate.toObject();
//
//                // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
//                delete rateObject._id;
//
//                var selection = { _id: appoint.uid};
//                var updateQuery = { $push: {torate: rateObject} };
//                var options = { safe: true, upsert: true };
//
//                // Step 1 - Send a review object to user so we can get feedback about the service
//                User.update(selection, updateQuery, options, function(err, model) {if(err) console.log(err);});
//
//                // Step 2 - Update the number of this Specialist's appointments
//                User.findByIdAndUpdate(appoint.sid,{$inc:{servicesnum:1}});
//
//                // Step 3 - Update the appointment to reflect the sent review object
//                appoint.rated = true;
//                appoint.save(function (err) {
//                    if (!err) {console.log("[Send for Review]");} else {console.log(err);}
//                    });
//
//
//                }
//        } else {
//            console.log(err);
//        }
//    })
//
//    //  +++++++++++++++++++++++++++++++++++++++++++++++
//    //    Remove Requests that haven't been answered
//    //  +++++++++++++++++++++++++++++++++++++++++++++++
//    var RequestCheckDate =  moment().subtract({minutes: 30});
//
//    AppointmentsModel.find({requestedon: {$lt: RequestCheckDate.toString()},  status: "pending"}, function (err, appointments) {
//        if (!err) {
//            for(var i in appointments){
//                var appoint = appointments[i];
//                console.log("[Run Appointment Requests Check]: Found appointment needing deletion");
//
//                // 1. Inform the user
//                pushUser([appoint.utoken], "A requested appointment was removed by Cityfab due to the lack of a response from the specialist", [appoint.uid], null);
//
//                // 2. Inform the specialist
//                pushUser([appoint.stoken], "An appointment request to you was removed by Cityfab because you failed to respond on time", [appoint.sid], null);
//
//                // 3. remove the appointment
//                appoint.remove(function (err) {
//                    if (!err) {
//                        console.log("[Run Appointment Requests Check]: Appointment removed");
//
//                    } else {
//                        console.log(err);
//                        res.status(501).send(err);
//                    }
//                });
//
//            }
//        } else {
//            console.log(err);
//        }
//    })
//
//}
