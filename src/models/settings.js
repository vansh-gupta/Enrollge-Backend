const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    TermsAndConditions: { type: String, require: true, default: 'Terms And Conditions Should be Here' },
    AdsSettings: {
        AdmobSettings: {
            AdmobEnable: { type: Boolean, default: true },
            AdmobAppId: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            AdmobPublisherId: { type: String, default: "pub-5956148237187501~2069186334" },
            HomeInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            HomeBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            ProfileBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            ProfileInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            ContactUsBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            ContactUsInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            TermsAndConditionsBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            TermsAndConditionsInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            ChaptersBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            SubjectVideoPlayerBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            SubjectVideoPlayerInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            CourseVideoPlayerBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            CourseVideoPlayerInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            CoursesBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            CoursesInterstitialAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" },
            CoursesVideosBannerAdUnit: { type: String, default: "ca-app-pub-5956148237187501~2069186334" }
        }
    }
})

// Here, We Are Creating And Collection in MOongoDB of Settings
const Settings = new mongoose.model("Settings", SettingsSchema)

module.exports = Settings;