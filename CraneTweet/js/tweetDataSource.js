; ( function () {
  "use strict";

  var tweetDataAdapter = WinJS.Class.define(
    // Constructor
    function ( method, count ) {
      this._method = method;
      this._count = count;
    },

    // Instance member
    {
      tweetFromIndex: function ( method, count ) {
        var twitter = WinJS.Application.sessionState.twitter;
        twitter.getTimeline( "home_timeline", { "count": "100" } ).then(
          function complete( tweets ) {
            var results = [];
            var count;

            // TODO: if tweets dose not exist
            tweets.forEach( function ( tweet, index, array ) {
              console.log( "[" + tweet.created_at + "] @" + tweet.user.screen_name + " | " + tweet.text );
              results.push( {
                key: index.toString(),
                data: {
                  created_at: tweet.created_at,
                  text: tweet.text,
                  name: tweet.user.name,
                  screen_name: tweet.user.screen_name,
                  image: tweet.user.profile_image_url
                }
              } );

              count = tweets.length;

              return {
                items: results,
                count: count
              };

            } );

          },

          function error( err ) {
            console.log( err.message );
            if ( err.message === "Unauthorized" || err.message === "Bad Request" ) {
              // TODO: implement 
            }
            return WinJS.UI.FetchError.noResponse;
          }
        );
      }
    }
    );
  WinJS.Namespace.define( "TweetData", { tweetData: WinJS.Class.derive(
                          WinJS.UI.VirtualizedDataSource,
                          function ( method, count ) {
                            this._baseDataSourceConstructor( new tweetDataAdapter( method, count ) );
                          }
                        ) } );
} )();