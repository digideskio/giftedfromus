Meteor.startup(function() {


  var getId = function() {
    var templateData;
    templateData = Session.get('templateData');
    if (templateData) {
      return templateData.id;
    } else {
      return '';
    }
  };

  var getCampaignId = function() {
  var templateData = Session.get('templateData');
  if(templateData)
    return templateData.id
  else
    return -1;
  };

  
  

  Template.campaignContent.helpers({
    publicURL: document.URL,
    mailContent: function(){
      return ""
    },
    data: function() {
      return Surprises.findOne({
        _id: getId()
      });
    },

    suggestions: function() {
      return GiftSuggestions.find({forCampaign:Session.get('templateData').id}, {sort :{upvotes:-1}});
    },

    campaignDate: function() {
      var campaignData = Surprises.findOne({_id:Session.get('templateData').id});
      return campaignData.date.toDateString();
    },

    campaignEndDate: function() {
      var campaignData = Surprises.findOne({_id:Session.get('templateData').id});
      return campaignData.endDate.toDateString();
    },

    daysLeft: function() {
      var campaignData = Surprises.findOne({_id:Session.get('templateData').id});
      var currentDate = new Date();
      var endDate = campaignData.endDate;
      var diffDays = Math.round(Math.abs((currentDate.getTime() - endDate.getTime())/(24*60*60*1000)));
      return diffDays;
    },

    pledgedAmount: function(){
      pledgedTotal = 0;
      Pledge.find({campaignId:Session.get('templateData').id}).map(function(doc){
        pledgedTotal += doc.pledgeAmount;
      });

      return pledgedTotal;
    },

    pastPledges: function() {
      return Pledge.find({campaignId:Session.get('templateData').id});
    }



  });

Pledge.helpers({
  pledger: function(){
//    name = Meteor.users.findOne({_id:this.pledgedBy}).profile.name;
 //   Meteor.users.find().map(function(doc){
 //     console.log(doc);
 //   });

//    Meteor.users.find({_id:this.pledgedBy}).map(function(doc){
//      console.log(doc);
//    });
 //   return "abc";
 //   return name;

    if (Meteor.isClient){
      return Meteor.subscribe("findPledger");
    }

    if (Meteor.isServer){
      Meteor.publish("findPledger", function(){
        return Meteor.users.find().count();

        //return Meteor.users.findOne({_id:this.pledgedBy});
      });
    }
//    return Meteor.users.findOne(this.pledgedBy);
  }
});

  Template.campaignContent.events({
  'click .endorseGift' : function(event) {
    var suggestionId = event.target.id;
    var up= GiftSuggestions.findOne({_id:suggestionId}).upvotes;
    GiftSuggestions.update({_id:suggestionId}, {$set: {upvotes:up+1}});
  },
   'keyup #inviteeEmail' : function(event) {
    userName = Meteor.user().profile.name;
      var campaignData = Surprises.findOne({_id:Session.get('templateData').id});
      gifteeName = campaignData.name;
      mailText =  "mailto:"+ $( "#inviteeEmail" ).val() +"?subject=Time to gift " +  gifteeName +"?&body=Hi I am using GifteByUS to collectively gift " + gifteeName + ". It would be great if you can join us. You can visit the giftpage at \n" + document.URL + "\n" + "Here you can suggest gift, upvote the gifts you like and also pledge an amount for the gift. Lets all gift " + gifteeName + " an awesome gift! \n" + "Love, \n " + userName;
      $("#mailBtn").attr('href', mailText)
    console.log("change")
   }
  });
});



