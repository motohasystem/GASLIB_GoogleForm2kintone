function createImporter(subdomain, appid, token){
  return new Form2kintoneImporter(subdomain, appid, token)
}

class Form2kintoneImporter {

    constructor(subdomain, appid, token){
    this.SUBDOMAIN = subdomain
    this.APPID = appid
    this.TOKEN = token
  }

  submit(formResponse){

    // 回答者メールアドレスと回答内容を取得
    const emailOfRespondent = formResponse.getRespondentEmail();
    const responseItems = formResponse.getItemResponses();
    console.log(emailOfRespondent)
    console.log(responseItems)


    // Google Forms からの応答を取得
    // const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();

    // kintone に送信するデータを作成
    let record = {};
    itemResponses.forEach(itemResponse => {
      const title = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      const fieldcode = this.extractBracketContent(title)
      record[fieldcode] = {
        value: answer
      };
    });

    // 予約フィールドコード
    record['email_of_respondent'] = {
      value: emailOfRespondent
    };
    record['timestamp_with_randomsuffix'] = {
      value: this.generateTimestampWithRandomSuffix()
    }

    // kintone にデータを送信
    this.sendToKintone(record);
  }


  // タイトルからフィールドコードを推測する（[]に指定している前提）
  extractBracketContent(title){
    const regex = /\[(.*?)\]/;
    const match = title.match(regex);

    if (match) {
      return match[1]; // [] で囲まれた部分の中身を返す
    } else {
      return title; // 引数の文字列をそのまま返す
    }
  }

  // kintone にデータを送信する関数
  sendToKintone(record) {
    const url = `https://${this.SUBDOMAIN}.cybozu.com/k/v1/record.json`;

    const headers = {
      'X-Cybozu-API-Token': this.TOKEN,
      'Content-Type': 'application/json'
    };

    const data = {
      app: this.APPID,
      record: record
    };

    const options = {
      method: 'POST',
      headers: headers,
      payload: JSON.stringify(data)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      console.log('Record added to kintone:', response.getContentText());
    } catch (error) {
      console.error('Error sending record to kintone:', error);
    }
  }

  // ミリ秒までの日時文字列にランダム２桁のサフィックスを付与した文字列を取得
  generateTimestampWithRandomSuffix() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');

    return (
      year +
      month +
      day +
      hours +
      minutes +
      seconds +
      milliseconds +
      randomSuffix
    );
  }

}

this.form2kintoneImporter = Form2kintoneImporter
