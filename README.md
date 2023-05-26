# GoogleForm2kintoneBracketLib

Googleフォームとkintoneを連携させる際に、フォーム設問中の[ブラケット]をフィールドコードとして扱うライブラリです。

## ちょっとした追加機能

収集メールアドレスとタイムスタンプをkintone側に渡すようにしています。

kintoneアプリ側では、以下２つのフィールドコードを一行文字列フィールドまたはリンクフィールドに設定してください。

- email_of_respondent
- timestamp_with_randomsuffix

# 6ステップで設定完了

## 1. kintoneアプリを作成する
- フォームの項目を割り当てたいフィールドを作成します
- フィールドコードを、作成したフォーム見出しの[]内と対応させてください。
    - [カテゴリ]
    - [自由記述]
- ２つの予約されたフィールドコードのフィールドを作成してください
    - email_of_respondent
        - リンクフィールドを作成してください。
        - 記入者のメールアドレスが入ります
    - timestamp_with_randomsuffix
        - 申請IDが入る文字列（1行）フィールドです。
        - 値の重複を禁止してください
- APIトークンを作成してください
    - レコード追加権限が必要です。
    - トークンをメモしておいてください
        - tkFt5afEEoKR1qR1jG9fuF0johwEdzDzF3rxfNAJ

- 追加機能
    - ライブラリ側でフィールドコードの予約をしています。
    - email_of_respondent
        - 送信者メールアドレス（メールアドレスを収集する、にしている場合）
    - timestamp_with_randomsuffix
        - 19桁の数字
        - 送信日時のタイムスタンプ（ミリ秒3桁）＋2桁の乱数
        - 例: 2023052517282457748


## 2. 新しいGoogleフォームを作成する

- 適当に設問を作成する
- 設問タイトルの頭に[]囲いで単語を配置します。
    - [カテゴリ] ブラケットの外は自由に記述することができます
    - [自由記述] ブラケットの外は自由に記述することができます

## 3. フォームにスクリプトを登録する
- フォーム画面の右上の︙から「スクリプトエディタ」を選択
- 適当なタイトルを入力
    - 備品セキュリティチェック問い合わせフォーム用
- コード.gsに下記コードをコピペ
- 3つの項目を設定する
    - KINTONE_SUBDOMAI
        - 流し込みたいkintoneアプリのドメイン(xxxxx.cybozu.comのxxxxx部分)
    - KINTONE_APP_ID
        - kintoneアプリのID
    - KINTONE_API_TOKEN
        - 先程メモったkintoneアプリのAPIトークンを記入

```javascript: コード.gs
// kintone の設定
const KINTONE_SUBDOMAIN = '<SUBDOMAIN>'; // kintone サブドメイン
const KINTONE_APP_ID = '<APP_ID>'; // kintone アプリID
const KINTONE_API_TOKEN = '<API_TOKEN>'; // kintone APIトークン

const importer = new Form2kintoneImporterLib.form2kintoneImporter(KINTONE_SUBDOMAIN, KINTONE_APP_ID, KINTONE_API_TOKEN)

// Google Forms の送信トリガーで実行される関数
function onSubmitForm(e) {
    const formResponse = 
      //eが定義できる場合（＝通常の回答送信時）は送信されたその回答を取得
      (e !== undefined) ? e.response 
      //そうでない場合（＝テスト時）は送信済の1件目を取得
      : FormApp.getActiveForm().getResponses()[0]; 

  importer.submit(formResponse)
}
```

## 4. プロジェクトにライブラリを追加
_ 「ライブラリ＋」をクリック
    - ライブラリの追加ダイアログが開くので、下記の通り入力する
        - スクリプトID
            - 16Z6ic1VtUjHZZpNnNDGtqqD9kq1001Pdr-Qwb7oxT5Ai1niHHOGqUoIb
        - 検索ボタンを押す
            - 「ライブラリ Form2kintoneImporterLib を検索しました。」と表示される
        - バージョン
            - 2を選択
        - ID
            - Form2kintoneImporterLib
    - 「追加」ボタンをクリック

## 5. プロジェクトのトリガーを設定する
- トリガー設定の追加を開く
    - 実行する関数を選択
        - onSubmitForm
    - 実行するデプロイを選択
        - Head
    - イベントのソースを選択
        - フォームから
    - イベントの種類を選択
        - フォーム送信時
    - 保存をクリック

## 6. 権限を設定する
- 「▷実行」をクリック
- 承認ダイアログが開く
    - 権限を確認をクリック
        - ![](img/2023-05-25-13-39-32.png)
    - Googleアカウントへのアクセスをリクエストしています
    - 「許可」
- 保存



