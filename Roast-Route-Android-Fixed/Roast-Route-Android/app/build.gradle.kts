plugins { id("com.android.application") }

android {
  namespace = "com.example"
  compileSdk = 36
  defaultConfig {
    applicationId = "com.example"
    minSdk = 24
    targetSdk = 36
    versionCode = 2
    versionName = "1.0.1"
  }
  // Gradle manages its debug key. Release credentials stay outside the source.
  val releaseStore = System.getenv("KEYSTORE_PATH")
  if (!releaseStore.isNullOrBlank()) {
    signingConfigs {
      create("release") {
        storeFile = file(releaseStore)
        storePassword = System.getenv("STORE_PASSWORD")
        keyAlias = System.getenv("KEY_ALIAS") ?: "upload"
        keyPassword = System.getenv("KEY_PASSWORD")
      }
    }
  }
  buildTypes {
    release {
      isMinifyEnabled = false
      if (!releaseStore.isNullOrBlank()) signingConfig = signingConfigs.getByName("release")
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
  }
  buildFeatures { buildConfig = true }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}

dependencies {
  implementation("androidx.webkit:webkit:1.14.0")
  implementation("androidx.activity:activity:1.10.1")
}
tasks.register("checkWebAssets") {
  doLast {
    check(file("src/main/assets/index.html").exists()) {
      "Web assets are missing. Run npm ci and npm run android:sync from the project root."
    }
  }
}
tasks.named("preBuild").configure { dependsOn("checkWebAssets") }
