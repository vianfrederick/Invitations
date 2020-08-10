//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const assert = require("assert");
var hint = "";
var help;
mongoose.connect("mongodb://localhost:27017/Invite", {useNewUrlParser: true, useUnifiedTopology: true});

const inviteSchema = {
  FName :{
    type : String,
    required : true
  } ,
  SName : {
    type : String,
    required : true
  } ,
  Eml : {
    type : String,
    required : true
  } ,
  No : {
    type : Number,
    required : true
  } ,
  pwd :{
    type : String,
    required : true
  },
  Choice1 :String,
  Choice2 :String,
  Choice3 :String,
  Hint1 : String,
  Hint2 : String,
  Hint3 : String
};




const Person = mongoose.model("Person", inviteSchema);



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/register",function(req,res){
  if((req.body.dummy === "ENTRY FAILED" )|| (!req.body.dummy)){
    res.sendFile(__dirname + "/invite.html");
  }
  else{
    res.sendFile(__dirname + "/login.html");
  }
});

app.post("/login",function(req,res){
  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  var choice1 = "0";
  var choice2 = "0";
  var choice3 = "0";
  var hint1 = "";
  var hint2 = "";
  var hint3 = "";


Person.findOne({Eml : email}, function(err,foundPerson){
  if(!err){
    if(foundPerson){
    res.render("fail",{heading : "ENTRY FAILED" , message : "OOOPS!!! User already exists"});
    }
    else{
      Person.findOne({No : phone}, function(err,foundNum){
        if(!err){
          if(foundNum){
            res.render("fail",{heading : "ENTRY FAILED" , message : "OOOPS!!! User already exists"});
          }
          else{
            const person = new Person({
              FName : firstName,
              SName : secondName,
              Eml : email,
              No : phone,
              pwd : password,
              Choice1 : choice1,
              Choice2 : choice2,
              Choice3 : choice3,
              Hint1 : hint1,
              Hint2 : hint2,
              Hint3 : hint3
            });

          person.save();
          res.redirect("/login2");
          }
        }
      });
    }
  }
});





});


app.get("/login2",function(req,res){
  res.sendFile(__dirname + "/login.html");
});


app.post("/dashboard",function(req,res){
  var email = req.body.email;
  var password = req.body.password;
   help = email;
Person.findOne({ Eml : email, pwd : password}, function(err,foundPerson){
  if(!err){
    if(foundPerson){

      res.render("dashboard",{Fname : foundPerson.FName, Sname : foundPerson.SName});
    }
    else{
      res.render("fail", {heading : "LOGIN FAILED", message : "Invalid Creditials"});
    }
  }
});

});


app.post("/dashboard2",function(req,res){


  Person.findOne({Eml : help},function(err,foundList){
    if(!err){
      if(foundList){
        if(req.body.checkfor == "1"){

          res.render("dashboard", {Fname : foundList.FName, Sname : foundList.SName});

        }
        else if(req.body.checkfor == "2"){
          res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 : foundList.Hint2, hint3 : foundList.Hint3 });

        }

        else if(req.body.checkfor == "3"){
          res.render("final", {Fname : foundList.FName, Sname : foundList.SName, C1 :foundList.Choice1, C2 : foundList.Choice2, C3 : foundList.Choice3, ID : foundList._id  });
        }

        else{
          res.redirect("/login2");
        }

      }
    }
  });





});


app.post("/eventsave",function(req,res){
   var c1 = req.body.inp1;
   var c2 = req.body.inp2;
   var c3 = req.body.inp3;

if((c1 == 1) && (!c2) && (!c3)){
   Person.updateOne({Eml : help}, {
    Choice1 : "CAKE",
    Choice2 : "",
    Choice3 : "",
    Hint1 : "Accepted",
    Hint2 : "",
    Hint3 : ""
  }, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
    }
  });
  Person.findOne({Eml : help}, function(err,foundList){
    if(!err){
      if(foundList){
        res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

      }
    }
  });
}

else if ((!c1) && (c2 == 2) && (!c3)){
  Person.updateOne({Eml : help}, {
   Choice1 : "",
   Choice2 : "DANCE WITH MUSIC",
   Choice3 : "",
   Hint1 : "",
   Hint2 : "Accepted",
   Hint3 : ""
 }, function(err){
   if(err){
     console.log(err);
   }
   else{
     console.log("Successfully Updated");
   }
 });
 Person.findOne({Eml : help}, function(err,foundList){
   if(!err){
     if(foundList){
       res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

     }
   }
 });
}
else if((!c1) && (!c2) && (c3 == 3)){
  Person.updateOne({Eml : help}, {
   Choice1 : "",
   Choice2 : "",
   Choice3 : "DINNER",
   Hint1 : "",
   Hint2 : "",
   Hint3 : "Accepted"
 }, function(err){
   if(err){
     console.log(err);
   }
   else{
     console.log("Successfully Updated");
   }
 });
 Person.findOne({Eml : help}, function(err,foundList){
   if(!err){
     if(foundList){
       res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

     }
   }
 });
}
 else if((c1 == 1) && (c2 == 2) && (!c3)){
   Person.updateOne({Eml : help}, {
    Choice1 : "CAKE",
    Choice2 : "DANCE WITH MUSIC",
    Choice3 : "",
    Hint1 : "Accepted",
    Hint2 : "Accepted",
    Hint3 : ""
  }, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully Updated");
    }
  });
  Person.findOne({Eml : help}, function(err,foundList){
    if(!err){
      if(foundList){
        res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

      }
    }
  });
 }
  else if((!c1) && (c2 == 2) && (c3 == 3)){
    Person.updateOne({Eml : help}, {
     Choice1 : "",
     Choice2 : "DANCE WITH MUSIC",
     Choice3 : "DINNER",
     Hint1 : "",
     Hint2 : "Accepted",
     Hint3 : "Accepted"
   }, function(err){
     if(err){
       console.log(err);
     }
     else{
       console.log("Successfully Updated");
     }
   });
   Person.findOne({Eml : help}, function(err,foundList){
     if(!err){
       if(foundList){
         res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

       }
     }
   });
  }
else if((c1 == 1) && (!c2) && (c3 == 3)){
  Person.updateOne({Eml : help}, {
   Choice1 : "CAKE",
   Choice2 : "",
   Choice3 : "DINNER",
   Hint1 : "Accepted",
   Hint2 : "",
   Hint3 : "Accepted"
 }, function(err){
   if(err){
     console.log(err);
   }
   else{
     console.log("Successfully Updated");
   }
 });
 Person.findOne({Eml : help}, function(err,foundList){
   if(!err){
     if(foundList){
       res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

     }
   }
 });
}
  else if((c1 == 1) && (c2 == 2) && (c3 == 3)){
    Person.updateOne({Eml : help}, {
     Choice1 : "CAKE",
     Choice2 : "DANCE WITH MUSIC",
     Choice3 : "DINNER",
     Hint1 : "Accepted",
     Hint2 : "Accepted",
     Hint3 : "Accepted"
   }, function(err){
     if(err){
       console.log(err);
     }
     else{
       console.log("Successfully Updated");
     }
   });
   Person.findOne({Eml : help}, function(err,foundList){
     if(!err){
       if(foundList){
         res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

       }
     }
   });
  }

  else{
    Person.findOne({Eml : help}, function(err,foundList){
      if(!err){
        if(foundList){
          res.render("accept", {Fname : foundList.FName, Sname : foundList.SName, hint1 :foundList.Hint1, hint2 :foundList.Hint2, hint3 :foundList.Hint3 });

        }
      }
    });
  }



});


app.post("/Profile",function(req,res){
  Person.findOne({Eml : help}, function(err,foundList){
    if(!err){
      if(foundList){
        res.render("profile", {Fname : foundList.FName, Sname : foundList.SName, no : foundList.No, email : foundList.Eml, pwsd : foundList.pwd});
      }
    }
  });
});














app.listen(3000,function(){
  console.log("Server has started");
});
