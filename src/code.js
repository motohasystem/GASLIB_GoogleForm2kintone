// kintone の設定
const KINTONE_SUBDOMAIN = "<SUBDOMAIN>"; // kintone サブドメイン
const KINTONE_APP_ID = "<APP_ID>"; // kintone アプリID
const KINTONE_API_TOKEN = "<API_TOKEN>"; // kintone APIトークン

const importer = new Form2kintoneImporterLib.form2kintoneImporter(
    KINTONE_SUBDOMAIN,
    KINTONE_APP_ID,
    KINTONE_API_TOKEN
);

// Google Forms の送信トリガーで実行される関数
function onSubmitForm(e) {
    const formResponse =
        //eが定義できる場合（＝通常の回答送信時）は送信されたその回答を取得
        e !== undefined
            ? e.response
            : //そうでない場合（＝テスト時）は送信済の1件目を取得
              FormApp.getActiveForm().getResponses()[0];

    importer.submit(formResponse);
}
