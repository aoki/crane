// 空白のテンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232509
( function () {
  "use strict";

  var DEBUG = true;

  WinJS.Binding.optimizeBindingReferences = true;

  var app = WinJS.Application;
  var activation = Windows.ApplicationModel.Activation;

  WinJS.Application.onloaded = function () {
    WinJS.Resources.processAll();
  }

  app.onactivated = function ( args ) {
    if ( args.detail.kind === activation.ActivationKind.launch ) {
      if ( args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated ) {
        // TODO: このアプリケーションは新しく起動しました。ここでアプリケーションを
        // 初期化します。
      } else {
        // TODO: このアプリケーションは中断状態から再度アクティブ化されました。
        // ここでアプリケーションの状態を復元します。
      }

      args.setPromise( WinJS.UI.processAll().then( function completed() {

        // Retrieve the div that hosts the Rating control.
        var ratingControlDiv = document.getElementById( "ratingControlDiv" );

        // Retrieve the actual Rating control.
        var ratingControl = ratingControlDiv.winControl;

        // Register the event handler. 
        ratingControl.addEventListener( "change", ratingChanged, false );


        var refleshButton = document.getElementById( 'refleshButton' );
        refleshButton.addEventListener( 'click', refleshButtonClickHandler, false );
        var connectButton = document.getElementById( 'connectButton' );
        connectButton.addEventListener( 'click', connectButtonClickHandler, false );
        var disconnectButton = document.getElementById( 'disconnectButton' );
        disconnectButton.addEventListener( 'click', disconnectButtonClickHandler, false );

      } ) );

    }
  };

  // TODO Confファイルに移そう
  var res = WinJS.Resources;
  var consumer_key = res.getString( 'consumer_key' ).value;
  var consumer_secret = res.getString( 'consumer_secret' ).value;
  var callback_url = res.getString( 'callback_url' ).value;

  if ( DEBUG ) {
    console.log( 'Consumer Key: ' + consumer_key );
    console.log( 'Consumer Secret: ' + consumer_secret );
    console.log( 'Callback URL: ' + callback_url );
  }

  var appData = Windows.Storage.ApplicationData.current;

  var twitter = new Twitter.Client( consumer_key, consumer_secret, callback_url );
  
  var localSettings = appData.localSettings;
  var value = localSettings.values['TwitterAccessTokenData'];

  if ( !value ) {
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

        localSettings.values['TwitterAccessTokenData'] = twitterAccessTokenData;

        twitter.setAuthInfo( info );
      }
    );
  } else {

    twitter.accessToken_ = value['AccessToken'];
    twitter.accessTokenSecret_ = value['AccessTokenSecret'];
    twitter.userId_ = value['UserID'];
    twitter.screenName_ = value['ScreenName'];

  }

  app.oncheckpoint = function ( args ) {
    // TODO: このアプリケーションは中断しようとしています。ここで中断中に
    // 維持する必要のある状態を保存します。中断中に自動的に保存され、
    // 復元される WinJS.Application.sessionState オブジェクトを使用
    // できます。アプリケーションを中断する前に非同期操作を完了する
    // 必要がある場合は、args.setPromise() を呼び出して
    // ください。
  };

  function connectButtonClickHandler( eventInfo ) {
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

        localSettings.values['TwitterAccessTokenData'] = twitterAccessTokenData;

        twitter.setAuthInfo( info );
      }
  );
  }
  function disconnectButtonClickHandler( eventInfo ) {
    localSettings.values['TwitterAccessTokenData'] = null;
    document.getElementById( 'view' ).removeChild( document.getElementById( 'tl' ) );
  }

  function refleshButtonClickHandler( eventInfo ) {
    twitter.getTimelines( "home_timeline", { count: 100 } ).then(
            function complete( tweets ) {

              var ul1 = document.createElement( 'ul' );
              ul1.setAttribute( 'id', 'tl' );
              tweets.reverse().forEach( function ( tweet, index, array ) {
                console.log( "[" + tweet.created_at + "] @" + tweet.user.screen_name + " | " + tweet.text );
                var li1 = document.createElement( 'li' );
                ul1.appendChild( li1 );
                var txt2 = document.createTextNode( "[" + tweet.created_at + "] @" + tweet.user.screen_name + " | " + tweet.text );
                li1.appendChild( txt2 );
                document.getElementById( "view" ).appendChild( ul1 );
              } );
            },
            function error( err ) {
              console.log( err.message );
              if ( err.message === "Unauthorized" || err.message === "Bad Request" ) {

              }
            }
          );
  }

  function ratingChanged( eventInfo ) {
    var ratingOutput = document.getElementById( "ratingOutput" );
    ratingOutput.innerText = eventInfo.detail.tentativeRating;
  }

  app.start();

} )();
