// ページ コントロール テンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232511
( function () {
  "use strict";

  WinJS.UI.Pages.define( "/pages/home/home.html", {
    // この関数は、ユーザーがこのページに移動するたびに呼び出されます。
    // ページ要素にアプリケーションのデータを設定します。
    ready: function ( element, options ) {
      // TODO: ここでページを初期化します。
      var ratingControlDiv = document.getElementById( "ratingControlDiv" );
      var ratingControl = ratingControlDiv.winControl;
      ratingControl.addEventListener( "change", this.ratingChanged, false );

      var refleshButton = document.getElementById( 'refleshButton' );
      refleshButton.addEventListener( 'click', this.refleshButtonClickHandler, false );

      var searchButton = document.getElementById( 'searchButton' );
      searchButton.addEventListener( 'click', this.searchButtonClickHandler, false );

      var tweetButton = document.getElementById( 'tweetButton' );
      tweetButton.addEventListener( 'click', this.tweetButtonClickHandler, false );

      var connectButton = document.getElementById( 'connectButton' );
      connectButton.addEventListener( 'click', this.connectButtonClickHandler, false );

      var disconnectButton = document.getElementById( 'disconnectButton' );
      disconnectButton.addEventListener( 'click', this.disconnectButtonClickHandler, false );

      WinJS.Utilities.query( 'a' ).listen( 'click', this.linkClickEventHandler, false );
    },

    unload: function () {
      // TODO: このページからの移動に対応します。
    },

    updateLayout: function ( element, viewState, lastViewState ) {
      /// <param name="element" domElement="true" />

      // TODO: viewState の変更に対応します。
    },

    connectButtonClickHandler: function ( eventInfo ) {
      var twitter = WinJS.Application.sessionState.twitter;
      twitter.authenticate().then(
        function complete( info ) {
          console.log(
            "AccessToken=" + info.accessToken +
            " AccessTokenSecret=" + info.accessTokenSecret +
            " UserID=" + info.userId +
            " ScreenName=" + info.screenName );

          var twitterAccessTokenData = new Windows.Storage.ApplicationDataCompositeValue();
          twitterAccessTokenData['AccessToken'] = info.accessToken;
          twitterAccessTokenData['AccessTokenSecret'] = info.accessTokenSecret;
          twitterAccessTokenData['UserID'] = info.userId;
          twitterAccessTokenData['ScreenName'] = info.screenName;

          var appData = Windows.Storage.ApplicationData.current;
          var localSettings = appData.localSettings;
          localSettings.values['TwitterAccessTokenData'] = twitterAccessTokenData;

          twitter.setAuthInfo( info );
        }
      );
    },

    disconnectButtonClickHandler: function ( eventInfo ) {
      var appData = Windows.Storage.ApplicationData.current;
      var localSettings = appData.localSettings;
      localSettings.values['TwitterAccessTokenData'] = null;
      if ( document.getElementById( 'tl' ) ) {
        document.getElementById( 'view' ).removeChild( document.getElementById( 'tl' ) );
      }
    },

    refleshButtonClickHandler: function ( eventInfo ) {
      var twitter = WinJS.Application.sessionState.twitter;
      document.getElementById( "view" ).removeChild( document.getElementById( 'view' ).childNodes.item( 0 ) );

      twitter.getTimelines( "home_timeline", { "count": "100" } ).then(
        function complete( tweets ) {
          var ul1 = document.createElement( 'ul' );
          ul1.setAttribute( 'id', 'tl' );
          tweets.reverse().forEach( function ( tweet, index, array ) {
            console.log( "[" + tweet.created_at + "] @" + tweet.user.screen_name + " | " + tweet.text );
            var li1 = document.createElement( 'li' );
            var img = document.createElement( 'img' );
            img.setAttribute( 'src', tweet.user.profile_image_url_https );
            li1.appendChild( img );
            var txt2 = document.createTextNode( "[" + tweet.created_at + "] @" + tweet.user.name + tweet.user.screen_name + " | " + tweet.text );
            ul1.insertBefore( li1, ul1.firstChild );
            li1.appendChild( txt2 );
          } );
          document.getElementById( "view" ).appendChild( ul1 );
        },
        function error( err ) {
          console.log( err.message );
          if ( err.message === "Unauthorized" || err.message === "Bad Request" ) {

          }
        }
      );
    },

    tweetButtonClickHandler: function ( eventInfo ) {
      var twitter = WinJS.Application.sessionState.twitter;
      var tweet = document.getElementById( 'tweetBox' ).value;
      twitter.postTweet( "POST", tweet );
    },

    searchButtonClickHandler: function ( eventInfo ) {
      var twitter = WinJS.Application.sessionState.twitter;
      var query = document.getElementById( 'tweetBox' ).value;
      document.getElementById( "view" ).removeChild( document.getElementById( 'view' ).childNodes.item( 0 ) );

      twitter.getSearch( "tweets", { 'q': query, 'lang': 'ja', 'locale': 'jp' } ).then(
        function complete( tweets ) {
          var ul1 = document.createElement( 'ul' );
          ul1.setAttribute( 'id', 'tl' );
          tweets.statuses.reverse().forEach( function ( tweet, index, array ) {
            console.log( "[" + tweet.created_at + "] @" + tweet.user.screen_name + " | " + tweet.text );
            var li1 = document.createElement( 'li' );
            var img = document.createElement( 'img' );
            img.setAttribute( 'src', tweet.user.profile_image_url_https );
            li1.appendChild( img );
            var txt2 = document.createTextNode( "[" + tweet.created_at + "] @" + tweet.user.name + tweet.user.screen_name + " | " + tweet.text );
            ul1.insertBefore( li1, ul1.firstChild );
            li1.appendChild( txt2 );
          } );
          document.getElementById( "view" ).appendChild( ul1 );
        },
        function error( err ) {
          console.log( err.message );
          if ( err.message === "Unauthorized" || err.message === "Bad Request" ) {
          }
        }
      );
    },

    ratingChanged: function ( eventInfo ) {
      var ratingOutput = document.getElementById( "ratingOutput" );
      ratingOutput.innerText = eventInfo.detail.tentativeRating;
    },

    linkClickEventHandler: function ( eventInfo ) {
      eventInfo.preventDefault();
      var link = eventInfo.target;
      WinJS.Navigation.navigate( link.href );
    }

  } );
} )();
