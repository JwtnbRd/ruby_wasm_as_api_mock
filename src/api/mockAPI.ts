import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm";

let rubyVM: Awaited<ReturnType<typeof DefaultRubyVM>>["vm"] | null = null;
const wasmURL = "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/ruby+stdlib.wasm";

console.log("mockAPI Connected!!")

// interface UseMockAPIReturn {
//   response: Record<string, any> | null;
//   loading: boolean;
//   error: any;
//   request: (endpoint: string, params?: any) => Primise<void>;
// }

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
      { id: 1, name: "ダイチ", email_address: "kamada@sample.com", password: "foobar0101" },
      { id: 2, name: "カオル", email_address: "mitoma@sample.com", password: "foobar0101" },
      { id: 3, name: "ワタル", email_address: "endo@sample.com", password: "foobar0101" }
    ]

    $logged_in_user ||=  { id: 1, name: "ダイチ" }

    $books = [
      { id: 1, title: "ハリー・ポッターと賢者の石", description: "kamada@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 2, title: "ハリー・ポッターと秘密の部屋", description: "mitoma@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 3, title: "ハリー・ポッターとアズカバンの囚人", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 4, title: "ハリー・ポッターと炎のゴブレット 上", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 5, title: "ハリー・ポッターと炎のゴブレット 下", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 6, title: "ハリー・ポッターと不死鳥の騎士団 上", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 7, title: "ハリー・ポッターと不死鳥の騎士団 下", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 8, title: "ハリー・ポッターと謎のプリンス 上", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 9, title: "ハリー・ポッターと謎のプリンス 下", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 10, title: "ハリー・ポッターと死の秘宝 上", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
      { id: 11, title: "ハリー・ポッターと死の秘宝 下", description: "endo@sample.com", author: "J.K.ローリング", publisher: "sample" },
    ]

    $reviews = [
      { id: 1, book_id: 1, user_id: 1, rating: 3, comment: "ハリー・ポッターと賢者の石", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 2, book_id: 2, user_id: 1, rating: 5, comment: "ハリー・ポッターと秘密の部屋", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 3, book_id: 3, user_id: 1, rating: 2, comment: "ハリー・ポッターとアズカバンの囚人", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 4, book_id: 4, user_id: 1, rating: 3, comment: "ハリー・ポッターと炎のゴブレット 上", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 5, book_id: 5, user_id: 1, rating: 5, comment: "ハリー・ポッターと炎のゴブレット 下", created_at: "2025/4/30", updated_at: "2025/4/30" },
      { id: 6, book_id: 6, user_id: 1, rating: 3, comment: "ハリー・ポッターと不死鳥の騎士団 上", created_at: "2025/4/30", updated_at: "2025/4/30" },
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
    elsif endpoint =~ %r{^/books\\?query=(.+)$}
      p endpoint
      query = nil
      if query
        matched_books = $books.select { |book| book[:title].include?(query) }
        JSON.generate(matched_books)
      else
        JSON.generate($books)
      end
    end
  `;

  const result = await vm.eval(rubyCode);
  console.log(JSON.parse(result.toString()));
  return { data: JSON.parse(result.toString())};
};
