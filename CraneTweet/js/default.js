// ナビゲーション テンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232506

( function () {
  "use strict";

  WinJS.Binding.optimizeBindingReferences = true;

  var app = WinJS.Application;
  var activation = Windows.ApplicationModel.Activation;
  var nav = WinJS.Navigation;
  WinJS.Application.sessionState.defaultColor = Themes.DefaultDark;
  document.getElementById( "metroStyle" ).href = WinJS.Application.sessionState.defaultColor;

  app.addEventListener( "activated", function ( args ) {
    if ( args.detail.kind === activation.ActivationKind.launch ) {
      if ( args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated ) {
        // TODO: このアプリケーションは新しく起動しました。ここでアプリケーションを
        // 初期化します。
      } else {
        // TODO: このアプリケーションは中断状態から再度アクティブ化されました。
        // ここでアプリケーションの状態を復元します。
      }

      if ( app.sessionState.history ) {
        nav.history = app.sessionState.history;
      }
      args.setPromise( WinJS.UI.processAll().then( function () {
        var appbar = document.getElementById( 'appbar' ).winControl;

        var homeButton = appbar.getCommandById( 'homeButton' );
        homeButton.addEventListener( 'click', goToHomePage, false );
        var page2Button = appbar.getCommandById( 'page2Button' );
        page2Button.addEventListener( 'click', goToPage2, false );
        var setColorButton = appbar.getCommandById( 'setLightColorButton' );
        setColorButton.addEventListener('click', setTheme, false);

        if ( nav.location ) {
          nav.history.current.initialPlaceholder = true;
          return nav.navigate( nav.location, nav.state );
        } else {
          return nav.navigate( Application.navigator.home );
        }
      } ) );

      // Consumer key is loaded from resource file when initialize.
      var res = WinJS.Resources;
      var consumer_key = res.getString( 'consumer_key' ).value;
      var consumer_secret = res.getString( 'consumer_secret' ).value;
      var callback_url = res.getString( 'callback_url' ).value;

      // TODO: remove these output messages.
      console.log( 'Consumer Key: ' + consumer_key );
      console.log( 'Consumer Secret: ' + consumer_secret );
      console.log( 'Callback URL: ' + callback_url );

      // Access token is loaded from user local settings.
      var appData = Windows.Storage.ApplicationData.current;
      var localSettings = appData.localSettings;
      var value = localSettings.values['TwitterAccessTokenData'];

      // Check to have the access token already.
      var twitter = new Twitter.Client( consumer_key, consumer_secret, callback_url );
      WinJS.Application.sessionState.twitter = twitter;
      if ( !value ) {
        // If not have the access token yet, then authenticate using OAuth.
        // After that save the access token into the user local settings.
        twitter.authenticate().then(
          function complete( info ) {
            // TODO: remove these output messages.
            console.log(
              "AccessToken=" + info.accessToken +
              " AccessTokenSecret=" + info.accessTokenSecret +
              " UserID=" + info.userId +
              " ScreenName=" + info.screenName );

            // Save the access token into the user local settings.
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
    }
  } );

  function goToHomePage( eventInfo ) {
    WinJS.Navigation.navigate('/pages/home/home.html');
  }

  function goToPage2( eventInfo ) {
    WinJS.Navigation.navigate( '/pages/photoPick/photoPick.html' );
  }

  function setTheme(eventInfo){
    document.getElementById('metroStyle').href = Themes.DefaultLight;
  }

  app.oncheckpoint = function ( args ) {
    // TODO: このアプリケーションは中断しようとしています。ここで中断中に
    // 維持する必要のある状態を保存します。アプリケーションが中断される前に 
    // 非同期操作を終了する必要がある場合は 
    // args.setPromise() を呼び出してください。
    app.sessionState.history = nav.history;
  };

  app.start();
} )();




