angular.module('joelPortfolio').factory('mainServices', [
  '$http', '$q', function($http, $q) {
    var events, photos;
    events = [
      {
        gigName: 'Cosmo Ladies Nite',
        gigPosterURL: '../assets/images/gig1.jpg'
      }, {
        gigName: 'Big Bang Friday',
        gigPosterURL: '../assets/images/gig2.jpg'
      }, {
        gigName: 'Retro Saturdays',
        gigPosterURL: '../assets/images/gig3.jpg'
      }, {
        gigName: 'Final Wave Indivibe',
        gigPosterURL: '../assets/images/gig4.jpg'
      }, {
        gigName: 'Homegrown 2.0',
        gigPosterURL: '../assets/images/gig5.jpg'
      }
    ];
    photos = [
      {
        photoURL: '../assets/images/photos/pic1.jpg'
      }, {
        photoURL: '../assets/images/photos/pic2.jpg'
      }, {
        photoURL: '../assets/images/photos/pic3.jpg'
      }, {
        photoURL: '../assets/images/photos/pic4.jpg'
      }, {
        photoURL: '../assets/images/photos/pic5.jpg'
      }, {
        photoURL: '../assets/images/photos/pic6.jpg'
      }, {
        photoURL: '../assets/images/photos/pic7.jpg'
      }, {
        photoURL: '../assets/images/photos/pic8.jpg'
      }, {
        photoURL: '../assets/images/photos/pic9.jpg'
      }
    ];
    return {
      getGigs: function() {
        return events;
      },
      getPics: function() {
        return photos;
      },
      sendEmail: function() {
        return Materialize.toast('Email Sent', '4000');
      }
    };
  }
]);
