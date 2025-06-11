# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep JSI native methods
-keepclasseswithmembers class * {
    @com.facebook.jni.annotations.DoNotStrip *;
}

# Keep all native methods, their classes and any class in the same package
-keepclasseswithmembers class com.viromedia.bridge.fabric.** {
    native <methods>;
}

# Keep all classes that might be used by the JSI bridge
-keep class com.viromedia.bridge.fabric.** { *; }
