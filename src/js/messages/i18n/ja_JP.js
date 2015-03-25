(function($) {

    // japanese - japan

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "ja_JP": {
                required: "この項目は必須です",
                invalid: "この項目は正しい値ではありません",
                months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                timeUnits: {
                    SECOND: "秒",
                    MINUTE: "分",
                    HOUR: "時",
                    DAY: "日",
                    MONTH: "月",
                    YEAR: "年"
                },
                "notOptional": "この項目は任意の回答項目ではありません",
                "disallowValue": "{0} は禁止されている値です",
                "invalidValueOfEnum": "この項目は {0} の中から選ばなければなりません。現在の値は {1} です",
                "notEnoughItems": "項目数は {0} 以上必要です",
                "tooManyItems": "項目数は {0} 以下でなければなりません",
                "valueNotUnique": "値が一意ではありません",
                "notAnArray": "この項目の値が配列でありません",
                "stringValueTooSmall": "この項目の最小値は {0} です",
                "stringValueTooLarge": "この項目の最大値は {0} です",
                "stringValueTooSmallExclusive": "この項目の値は {0} より小さくなければなりません",
                "stringValueTooLargeExclusive": "この項目の値は {0} より大きくなければなりません",
                "stringDivisibleBy": "値は {0} によって割り切れなければなりません",
                "stringNotANumber": "この項目の値が数値ではありません",
                "stringValueNotMultipleOf": "値が {0} の倍数ではありません",
                "stringNotAnInteger": "この項目の値が整数ではありません",
                "stringNotAJSON": "値が正しい JSON 形式の文字列ではありません",
                "stringTooShort": "この項目は {0} 文字以上必要です",
                "stringTooLong": "この項目は {0} 文字以下でなければなりません",
                "invalidTime": "時間が正しくありません",
                "invalidDate": "日付が {0} ではありません",
                "invalidEmail": "メールアドレスが正しくありません。例えば info@cloudcms.com のような形式です",
                "invalidIPv4": "IPv4 アドレスが正しくありません。例えば 192.168.0.1 のような形式です",
                "invalidPassword": "パスワードが正しくありません",
                "invalidPhone": "電話番号が正しくありません。例えば (123) 456-9999 のような形式です",
                "invalidPattern": "この項目は {0} のパターンでなければなりません",
                "invalidURLFormat": "URL が正しい形式ではありません",
                "keyMissing": "地図が空のキーを含んでいます",
                "keyNotUnique": "地図のキーが一意ではありません",
                "ObjecttooFewProperties": "プロパティが足りません ({0} が必要です)",
                "tooManyProperties": "プロパティ ({0}) の最大数を超えています",
                "wordLimitExceeded": "{0} の単語数の制限を超えています",
                "editorAnnotationsExist": "エディタが修正すべきエラーを報告しています",
                "invalidZipcodeFormatFive": "5桁の Zipcode (#####) ではありません",
                "invalidZipcodeFormatNine": "9桁の Zipcode (#####-####) ではありません"
            }
        }
    });

})(jQuery);
