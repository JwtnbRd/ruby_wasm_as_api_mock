import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm";

let rubyVM: Awaited<ReturnType<typeof DefaultRubyVM>>["vm"] | null = null;
const wasmURL = "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/ruby+stdlib.wasm";

async function initializeRubyVM() {
  if (rubyVM) return rubyVM;

  const response = await fetch(wasmURL);
  const module = await WebAssembly.compileStreaming(response);
  const { vm } = await DefaultRubyVM(module);
  rubyVM = vm;
  return rubyVM;
}

export async function mockAPIRequest(endpoint: string, params?: any): Promise<any> {
  const vm = await initializeRubyVM()

  const endpointJson = JSON.stringify(endpoint);
  const requestDataJson = JSON.stringify(params || {});

  // $logged_in_userは本来は$logged_in_user ||= nilとしたいところであるが、ページリロードに合わせてRubyVMが初期化されてしまい、
  // $logged_in_userが永続化されないので、ここはログイン後のユーザーを想定してハードコードしている。
  const rubyCode = `
    require 'json'
    require 'uri'

    $users = [
      { id: 1, name: "スネイプ", email_address: "snape@sample.com", password: "foobar0101" },
      { id: 2, name: "ハリー", email_address: "harry@sample.com", password: "foobar0101" },
      { id: 3, name: "ロン", email_address: "ron@sample.com", password: "foobar0101" }
    ]

    $logged_in_user ||=  { id: 1, name: "スネイプ" }

    $books = [
      { id: 1, title: "ハリー・ポッターと賢者の石", description: "ハリー・ポッターは孤児。意地悪な従兄にいじめられながら１１歳の誕生日を迎えようとしたとき、ホグワーツ魔法学校からの入学許可証が届き、自分が魔法使いだと知る。キングズ・クロス駅、９と３／４番線から紅色の汽車に乗り、ハリーは未知の世界へ。親友のロン、ハーマイオニーに助けられ、ハリーの両親を殺した邪悪な魔法使いヴォルデモートとの運命の対決までの、息を飲む展開。９歳から１０８歳までのファンタジー。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 2, title: "ハリー・ポッターと秘密の部屋", description: "魔法学校で一年間を過ごし、夏休みでダーズリー家に戻ったハリーは意地悪なおじ、おばに監禁されて餓死寸前。やっと、親友のロンに助け出される。しかし、新学期が始まった途端、また事件に巻き込まれる。ホグワーツ校を襲う姿なき声。次々と犠牲者が出る。そしてハリーに疑いがかかる。果たしてハリーはスリザリン寮に入るべきだったのだろうか。ヴォルデモートとの対決がその答えを出してくれる。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 3, title: "ハリー・ポッターとアズカバンの囚人", description: "夏休みのある日、ハリーは１３歳の誕生日を迎える。あいかわらずハリーを無視するダーズリー一家。さらに悪いことに、おじさんの妹、恐怖のマージおばさんが泊まりに来た。耐えかねて家出するハリーに、恐ろしい事件がふりかかる。脱獄不可能のアズカバンから脱走した囚人がハリーの命を狙っているという。新任のルーピン先生を迎えたホグワーツ校でハリーは魔法使いとしても、人間としてもひとまわりたくましく成長する。さて、今回のヴォオルデモートとの対決は？", author: "J.K.ローリング", publisher: "静山社" },
      { id: 4, title: "ハリー・ポッターと炎のゴブレット 上", description: "魔法界のサッカー、クィディッチのワールドカップが行なわれる。ハリーたちを夢中にさせたブルガリア対アイルランドの決勝戦のあと、恐ろしい事件が起こる。そして、百年ぶりの開かれる三大魔法学校対抗試合に、ヴォルデモートが仕掛けた罠はハリーを絶体絶命の危機に陥れる。しかも、味方になってくれるはずのロンに、思いもかけない異変が…。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 5, title: "ハリー・ポッターと炎のゴブレット 下", description: "魔法界のサッカー、クィディッチのワールドカップが行なわれる。ハリーたちを夢中にさせたブルガリア対アイルランドの決勝戦のあと、恐ろしい事件が起こる。そして、百年ぶりの開かれる三大魔法学校対抗試合に、ヴォルデモートが仕掛けた罠はハリーを絶体絶命の危機に陥れる。しかも、味方になってくれるはずのロンに、思いもかけない異変が…。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 6, title: "ハリー・ポッターと不死鳥の騎士団 上", description: "十五歳になったハリーは、蘇った「例のあの人」との新たな対決を迫られる。動き出した不死鳥の騎士団は果たして戦いに勝てるのか？ 額の傷痕はますます激しく痛み、今までとは違うなにかを告げていた。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 7, title: "ハリー・ポッターと不死鳥の騎士団 下", description: "夜な夜な夢にうなされるハリー。長い廊下、黒い扉。どうしても開かない扉。 真実はその扉のむこうか？十五年前になにが起こったのか？ いよいよ真実が明かされる。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 8, title: "ハリー・ポッターと謎のプリンス 上", description: "ヴォルデモートの復活のせいで、夏だというのに国中に冷たい霧が立ち込めていた。そんな中を、ダーズリーの家にダンブルドアがやって来るという。いったい何のために？そして、ダンブルドアの右手に異変が……。１７年前の予言は、ハリーとヴォルデモートとの対決を避けられないものにした。過酷な運命に立ち向かう１６歳のハリーに、ダンブルドアの個人教授が始まる。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 9, title: "ハリー・ポッターと謎のプリンス 下", description: "ヴォルデモートの復活のせいで、夏だというのに国中に冷たい霧が立ち込めていた。そんな中を、ダーズリーの家にダンブルドアがやって来るという。いったい何のために？そして、ダンブルドアの右手に異変が……。１７年前の予言は、ハリーとヴォルデモートとの対決を避けられないものにした。過酷な運命に立ち向かう１６歳のハリーに、ダンブルドアの個人教授が始まる。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 10, title: "ハリー・ポッターと死の秘宝 上", description: "７月３１日、１７歳の誕生日に、母親の血の護りが消える。「不死鳥の騎士団」に護衛されてプリベット通りを飛び立ったハリーに、どこまでもついていくロンとハーマイオニー。一方、あれほど信頼していたダンブルドアには、思いがけない過去が。分霊箱探しのあてどない旅に、手掛かりはダンブルドアの遺品だけ。", author: "J.K.ローリング", publisher: "静山社" },
      { id: 11, title: "ハリー・ポッターと死の秘宝 下", description: "７月３１日、１７歳の誕生日に、母親の血の護りが消える。「不死鳥の騎士団」に護衛されてプリベット通りを飛び立ったハリーに、どこまでもついていくロンとハーマイオニー。一方、あれほど信頼していたダンブルドアには、思いがけない過去が。分霊箱探しのあてどない旅に、手掛かりはダンブルドアの遺品だけ。", author: "J.K.ローリング", publisher: "静山社" },
    ]

    $reviews = [
      { id: 1, book_id: 1, user_id: 1, rating: 3, comment: "ポッターかっこいい", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 2, book_id: 2, user_id: 1, rating: 2, comment: "ウィーズリー家に入りたい", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 3, book_id: 3, user_id: 1, rating: 5, comment: "がんばれ！ポッター！！", created_at: "2025/4/30", updated_at: "2025/4/30" },
    ]

    endpoint = JSON.parse('${endpointJson}')
    request_data = JSON.parse('${requestDataJson}')

    if endpoint == "/session"
      authorized_user = $users.find do |user|
        user[:email_address] == request_data["user"]["email_address"] && user[:password] == request_data["user"]["password"]
      end

      if authorized_user
        $logged_in_user = { id: authorized_user[:id], name: authorized_user[:name] }
        JSON.generate($logged_in_user)
      else
        $logged_in_user = nil
        JSON.generate(nil)
      end
    elsif endpoint == "/delete_session"
      $logged_in_user = nil
      JSON.generate(nil)
    elsif endpoint == "/users"
      if $logged_in_user
        JSON.generate($logged_in_user)
      else
        JSON.generate(nil)
      end
    elsif endpoint == "/books"
      $books.to_json
    elsif endpoint =~ %r{^/books/(\\d+)$}
      id = endpoint.match(%r{^/books/(\\d+)$})[1].to_i
      book = $books.find { |b| b[:id] == id }
      if book
        book.to_json
      else
        { error: "book not found" }.to_json
      end
    elsif endpoint =~ %r{^/books/(\\d+)/reviews$}
      book_id = endpoint.match(%r{^/books/(\\d+)/reviews$})[1].to_i
      matched_reviews = $reviews.find { |review| review[:book_id] == book_id }
      JSON.generate(matched_reviews)
    elsif endpoint =~ %r{^/books\\?query=(.*)$}
      query = URI.decode_www_form_component($1)
      result = if query.empty?
        $books
      else
        $books.select { |book| book[:title].include?(query) }
      end
      JSON.generate(result)
    end
  `;

  const result = await vm.eval(rubyCode);
  console.log(JSON.parse(result.toString()));
  return { data: JSON.parse(result.toString())};
};
