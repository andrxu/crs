# crs
Cordova based Mobile App for Chinese Radio Seattle

### How to build 
```
>cordova build android 
>cordova build wp8
>cordova build ios
```

### Ripple emulate 
```
cd www
ripple emulate -port 1234
```

### Android Submission

```
>cd platforms\android
>keytool -genkey -v -keystore c:\users\andrew\.keystore -alias andrxu -keyalg RSA -keysize 2048 -validity 10000
>jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore c:\users\andrew\.keystore in.apk andrxu
>zipalign -v 4 in.apk out.apk
```

Note: ```keytool -genkey``` is only required once. You can find zipalign from ADT, for example, ```c:\ADT\adt-bundle-windows-x86_64-20131030\sdk\build-tools\android-4.4W\zipalign```


