# Counter — Android APK

Барномаи офлайнии Android-и **Counter** ба воситаи Capacitor барои сохтани **APK** тавассути **GitHub Actions** танзим шудааст.

## Чӣ тавр APK-ро аз GitHub гирифтан мумкин аст?

1. Лоиҳаро ба репозиторияи **GitHub**-и худ боргузорӣ (`push` ё `upload`) кунед (дар шохаи `main` ё `master`).
2. Дар GitHub ба бахши **Actions** дароед — раванди **Build Android APK** худкор оғоз мешавад.
3. Пас аз анҷоми сохт, дар қисми **Artifacts** файли **`Counter-Android-APK`**-ро зеркашӣ кунед — дар дохили он **`app-debug.apk`** барои насб дар телефони Android омода аст.

## Фармонҳои локалӣ

```bash
npm install
npm run apk:prepare
```
