// ver 0.0.1

var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var needle = require('needle');
var moment = require('moment');
var app = express();
var striptags = require('striptags');


app.use(express.static(__dirname + "/"))
app.use(express.static(__dirname + '/apidoc'));
app.use(express.static(__dirname + '/../../src'));

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


app.use(function (req, res, next) {
    console.log('[' + new Date() + '] ' + req.method + ' : ' + req.path);
    next();
});

app.use(bodyParser.json());


function log(info) {
    console.log("[" + Date.now() + "] API CALL: " + info);
}
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});


app.get('/api', function (req, res) {
    res.send('Sportimo Info Server is live and running.');
});

/* ================================
 *  MONGODB CONNECTION
 ** ==============================*/
mongoose.connect('mongodb://bedbug:a21th21@ds043523-a0.mongolab.com:43523,ds043523-a1.mongolab.com:43523/sportimo?replicaSet=rs-ds043523');


/* ================================
 *       Publication
 * ==============================*/
var publication = new mongoose.Schema({
    id: { type: String, index: { unique: true } },
    type: String,
    matchId: String,
    seasonId: String,
    teamId: String,
    views: String,
    publishDate: String,
    publicationLanguagesHTML: mongoose.Schema.Types.Mixed,
    publicationLanguages: mongoose.Schema.Types.Mixed,
    photo: String
});

var Publication = mongoose.model("Publications", publication);

/* ================================
 *       MatchData
 * ==============================*/
var matchdata = new mongoose.Schema({
    matchid: String,
    publications: [publication],
    publications_count: Number
});

var MatchData = mongoose.model("MatchesData", matchdata);

var MatchDataCheck = setInterval(function () { CheckMatchData() }, 30*60*1000); // every 1 hour (60' x 60" x 1000mls)

// CheckMatchData();

function CheckMatchData() {

    console.log("[AGGREGATION CHECK]");


    // First we get all the matches

    needle.get('http://api.fclm.ru/xmlexport/publications?Publication[type]=3&Publication_page=0', function (error, response) {

        if (!error && response.statusCode == 200) {

            console.log("[INDEXING] Received Publications");

            //console.log(response.body.publications.publication.length);

            //parseString(JSON.stringify(response.body), function (err, result) {
            //        console.dir(result);
            //    });
            //var allmatches = [];

            response.body.publications.publication.forEach(function (pub) {



                needle.get('http://api.fclm.ru/xmlexport/publication?Publication[id]=' + pub.id, function (err, fullpubs) {
                    if (!err && fullpubs.statusCode == 200) {
                        
                        var newstext = fullpubs.body.publications.publication.publicationLanguages.publicationLanguage;
                        
                        var pubtext = [{}];
                        pubtext[0].name = newstext[0].name;
                        pubtext[0].languageId = newstext[0].languageId;
                        pubtext[0].description = decodeHTMLEntities(newstext[0].description);
                        pubtext[0].teaser = decodeHTMLEntities(newstext[0].teaser);
                        

                        var publication = new Publication({
                            id: fullpubs.body.publications.publication.id,
                            type: fullpubs.body.publications.publication.type,
                            matchId: fullpubs.body.publications.publication.matchId,
                            seasonId: fullpubs.body.publications.publication.seasonId,
                            teamId: fullpubs.body.publications.publication.teamId,
                            views: fullpubs.body.publications.publication.views,
                            publishDate: fullpubs.body.publications.publication.publishDate,
                            publicationLanguagesHTML: newstext,
                            publicationLanguages: pubtext,
                            photo: fullpubs.body.publications.publication.photo.img.urlToOrig
                        });

                        publication.save(function (err) {
                            if (!err) {
                                console.log("[Saved new Publication]: " + publication.id);
                            } else {
                                if (!err.code == "11000")
                                    console.log(err);
                            }
                        });

                    } else
                        console.log(err);
                });


            });

            console.log("[FINISHED INDEXING]");


        } else
            console.log(error);
    });



}

/* ================================
 *       PLAYERS
 * ==============================*/
var countrydata = new mongoose.Schema({
    countryId: String,
    countryName: String,
    urlToOrig: String
});
var personName = new mongoose.Schema({
    languageId: String,
    firstName: String,
    middleName: String,
    lastName: String
});

var player = new mongoose.Schema({
    id: { type: String, unique: true },
    number: Number,
    height: String,
    weight: String,
    country: [countrydata],
    personLanguages: [personName],
    birth: Date,
    photo: String,
    position: String,
    video: String,
    biography: String,
    honors: [mongoose.Schema.Types.Mixed],
    career: [mongoose.Schema.Types.Mixed],
    details: [mongoose.Schema.Types.Mixed]


});

var Players = mongoose.model("Players", player);

var CheckPlayers = setInterval(function () { AggregatePlayers() }, 86400000); //  every 24 hour (24 x 60' x 60" x 1000mls)


// AggregatePlayers();
AggregateCoaches();

function AggregatePlayers() {

    console.log("[PLAYERS AGGREGATION CHECK]");


    // First we get all the matches

    needle.get('http://api.fclm.ru/xmlexport/players?Player[teamId]=1&Player[actualOn]=1', function (error, response) {

        if (!error && response.statusCode == 200) {

            console.log("[INDEXING] Received Players");

            var receivedItems = response.body.players.player;

            //console.log((receivedItems[0].person.person.biography))
            //console.log(decodeHTMLEntities(receivedItems[0].person.person.biography))



            // prints <foo /> "bar"

            receivedItems.forEach(function (item) {
                
                // console.log(item.person.person.biography.replace(/<\/?[^>]+(>|$)/g, ""));
                // console.log(item.person.person.biography.replace( new RegExp( "/&#?[a-z0-9]+;/g", 'g' ), '' ));
                //var newplayer = new Players({
                //    id: item.id,
                //    number: parseInt(item.number),
                //    height: float2int(item.height),
                //    weight: float2int(item.weight),
                //    personLanguages: item.person.person.personLanguages.personLanguage,
                //    country: [item.citizenship.country],
                //    birth: item.person.person.birth,
                //    photo: item.person.person.photo.img.urlToOrig,
                //    position: item.position.position.id
                //});
                //
                //newplayer.save(function (err) {
                //    if (!err) {
                //        console.log("[Saved new Player]");
                //    } else {
                //        if(!err.code=="11000")
                //            console.log(err);
                //    }
                //});
                //
                
                // Details
                //    console.log(item.playerLanguages.language[0].lastClubTitle);
                var details = [];
                var ru = {
                    "firstMatchTitle": item.playerLanguages.language[0].firstMatchTitle,
                    "lastClubTitle": item.playerLanguages.language[0].lastClubTitle,
                    "text": ["Первый матч: " + item.playerLanguages.language[0].firstMatchTitle,
                        "Предыдущая команда: " + item.playerLanguages.language[0].lastClubTitle]
                };
                var en = {
                    "firstMatchTitle": item.playerLanguages.language[0].firstMatchTitle,
                    "lastClubTitle": item.playerLanguages.language[0].lastClubTitle,
                    "text": ["First match: " + item.playerLanguages.language[0].firstMatchTitle,
                        "Previous club: " + item.playerLanguages.language[0].lastClubTitle]
                }
                details.push(ru);
                details.push(en);
            
                // public string yearStart;
                // public string yearEnd;
                // public string matchCount;
                // public string goalCount;
                // public string[] club;
    
                // Career
                var career = [];

                if (item.career.line != null) {
                    if (item.career.line.length != null) {
                        item.career.line.forEach(function (element) {
                            if (element.club.club != null) {
                                var careerEntry = { yearStart: element.yearStart | '', yearEnd: element.yearEnd | '', matchCount: element.matchCount, goalCount: element.goalCount };
                                careerEntry.club = [element.club.club.clubLang.language[0].name, element.club.club.clubLang.language[1].name];
                                career.push(careerEntry);
                            }
                        }, this);
                    } else {
                        var careerEntry = { yearStart: item.career.line.yearStart | '', yearEnd: item.career.line.yearEnd | '', matchCount: item.career.line.matchCount, goalCount: item.career.line.goalCount };
                        careerEntry.club = [item.career.line.club.club.clubLang.language[0].name, item.career.line.club.club.clubLang.language[1].name];
                        career.push(careerEntry);
                    }
                }
            
                // Honors
                var honors = [];
                // console.log(item.progress.line);
            
                if (item.progress.line != null) {
                    if (item.progress.line.length != null) {

                        item.progress.line.forEach(function (element) {
                            // console.log(element.playerProgressLanguages.language.length);
                            if (element.playerProgressLanguages.language.length > 0) {
                                // console.log("many: "+element.year);
                                honors.push({
                                    year: element.year,
                                    honor: [element.playerProgressLanguages.language[0].content, element.playerProgressLanguages.language[1].content]
                                });
                            }
                        }, this);


                    } else {
                        // console.log(item.progress.line.playerProgressLanguages.language[0].content);
                        honors.push({
                            year: item.progress.line.year,
                            honor: [item.progress.line.playerProgressLanguages.language[0].content, item.progress.line.playerProgressLanguages.language[1].content]
                        });
                    }

                }
            
                // console.log(JSON.stringify(honors));
            
                var newplayerData = {
                    id: item.id,
                    number: parseInt(item.number),
                    height: float2int(item.height),
                    weight: float2int(item.weight),
                    personLanguages: item.person.person.personLanguages.personLanguage,
                    country: [item.citizenship.country],
                    birth: item.person.person.birth,
                    photo: item.person.person.photo.img.urlToOrig,
                    position: item.position.position.id,
                    video: "http://www.fclm.ru" + item.video,
                    biography: decodeHTMLEntities(item.person.person.biography),
                    honors: honors,
                    career: career,
                    details: details,
                };
                
                // newplayerData.markModified('career');
                // newplayerData.markModified('details');
                // newplayerData.markModified('honors');

                Players.update({ id: item.id }, newplayerData, { upsert: true }, function (err) {
                    if (!err) {
                        //    console.log("[Saved/Updated Player]");
                    } else {
                        if (!err.code == "11000")
                            console.log(err);
                    }
                });



            });

            console.log("[FINISHED INDEXING]");


        } else
            console.log(error);
    });

}



function fixPlayers() {
    Players.find({}, function (err, items) {
        items.forEach(function (x) {
            x.weight = float2int(x.weight);
            x.height = float2int(x.height);
            x.save();
        });
    });
}

function float2int(value) {
    return value | 0;
}

var _string = require("underscore.string");
var Encoder = require('node-html-encoder').Encoder;

// entity type encoder
var encoder = new Encoder('entity');


function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace("\r\n","                   \r\n");
        str = str.replace(/<br\s*\/?>/mg, "");

        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        str = encoder.htmlDecode(str);
    }

    return str;
}

/* ================================
 *       Coaches
 * ==============================*/



var personName = new mongoose.Schema({
    languageId: String,
    firstName: String,
    middleName: String,
    lastName: String
});

var position = new mongoose.Schema({
    languageId: String,
    name: String
});

var coach = new mongoose.Schema({
    id: { type: String, unique: true },
    possitionid: Number,
    officePositionLanguages: [position],
    personLanguages: [personName],
    birth: Date,
    photo: String,
    biography: String
});


var Coaches = mongoose.model("Coaches", coach);

var CheckCoaches = setInterval(function () { AggregateCoaches() }, 96400000); //  every 24 hour (24 x 60' x 60" x 1000mls)

function AggregateCoaches() {

    console.log("[COACHES AGGREGATION CHECK]");

    var count = 0;
    // First we get all the matches

    needle.get('http://api.fclm.ru/xmlexport/allactualpersons?Person[actualOn]=1&Person[teamId]=1', function (error, response) {

        if (!error && response.statusCode == 200) {

            console.log("[INDEXING] Received Coaches");
            // console.log(response.body.persons);
            var receivedItems = response.body.persons.person;
                
            receivedItems.forEach(function (item) {
                count++;
                    var position = [];
                    
                    //  if(!item.officePositions || !item.officePositions.officePositionLanguages )
                    //   return;
                      
                    if(item.officePositions.officePosition.officePositionLanguages.officePositionLanguage == undefined){
                        position.push(item.officePositions.officePosition.officePositionLanguages.officePositionLanguage);
                        position.push(item.officePositions.officePosition.officePositionLanguages.officePositionLanguage);
                    }
                    else
                        position = item.officePositions.officePosition.officePositionLanguages.officePositionLanguage;
                    
                    if(!item.photo.img)
                       return;
                    
                    var newCoach = new Coaches({
                        id: item.id,
                        possitionid: item.officePositions.officePosition.id,
                        personLanguages: item.personLanguages.personLanguage,
                        officePositionLanguages: position,
                        birth: item.birth,
                        photo: item.photo.img.urlToOrig
                        
                    });

                    if (item.officePositions.officePosition.id != 44 && item.officePositions.officePosition.id != 1  && item.officePositions.officePosition.id != 3) {

                    newCoach.save(function (err) {
                        if (!err) {
                            console.log("[Saved new Coach]");
                        } else {
                            if (!err.code == "11000")
                                console.log(err);
                        }
                    });
                }
                
                
                // if (count == 1) console.log(item.personLanguages);
                // var newCoachData = {
                //     id: item.id,
                //     possitionid: item.officePositions.officePosition.id,
                //     personLanguages: item.personLanguages.personLanguage,
                //     officePositionLanguages: item.officePositions.officePosition.officePositionLanguages.officePositionLanguage,
                //     birth: item.birth,
                //     photo: item.photo.img.urlToOrig
                //     // biography: decodeHTMLEntities(item.person.biography)
                // };

                // Coaches.update({ id: item.id }, newCoachData, { upsert: true }, function (err) {
                //     if (!err) {
                //         // console.log("[Saved/Updated Coach]");
                //     } else {
                //         if (!err.code === "11000")
                //             console.log(err);
                //     }
                // });

            });

            console.log("[FINISHED INDEXING]");


        } else
            console.log(error);
    });

}


/* ================================
 *  Server Launch
 ** ==============================*/
var server = app.listen(4243, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Sportimo Info Server v0.1.0 started listening.');
});


